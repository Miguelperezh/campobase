-- SDD059: metadata-only hardening for one team per account.
-- No UPDATE/DELETE/INSERT of existing sporting, membership or media records.
-- Apply the RPC first, deploy delegate-sync v2, then the restrictive policies.

create schema if not exists campobase_private;
revoke all on schema campobase_private from public;
grant usage on schema campobase_private to authenticated;

create or replace function campobase_private.is_delegate_actor()
returns boolean language sql stable security definer
set search_path = pg_catalog, pg_temp as $$
 select coalesce(auth.jwt()->'app_metadata'->>'campobase_role','')='delegate_pin'
 or exists(select 1 from public.equipo_miembros where user_id=auth.uid() and role='delegate')
 or exists(select 1 from public.perfiles where id=auth.uid() and role='delegate');
$$;
revoke all on function campobase_private.is_delegate_actor() from public,anon;
grant execute on function campobase_private.is_delegate_actor() to authenticated;

create or replace function public.delegate_sync_upsert_v2(
 p_actor uuid,p_owner uuid,p_store text,p_record_id text,p_payload jsonb,
 p_updated bigint,p_pin_version text default null
) returns boolean language plpgsql security invoker
set search_path=pg_catalog,pg_temp as $$
declare
 v_member public.equipo_miembros%rowtype;
 v_team public.equipos_cuenta%rowtype;
 v_subscription public.suscripciones%rowtype;
 v_main jsonb;
 v_permissions jsonb;
 v_fingerprint text;
 v_count integer;
begin
 if p_actor is null or p_owner is null or p_actor=p_owner
 or p_record_id is null or length(p_record_id)>250
 or p_updated is null or p_updated<0
 or p_updated>(extract(epoch from clock_timestamp())*1000)::bigint+60000
 or jsonb_typeof(p_payload) is distinct from 'object'
 or p_payload->>'id' is distinct from p_record_id then
  raise exception using errcode='22023',message='Invalid delegate mutation';
 end if;

 -- Locks keep membership, team, subscription and permissions coherent until commit.
 select * into v_member from public.equipo_miembros
 where user_id=p_actor and role='delegate' for share;
 if not found then raise exception using errcode='42501',message='Delegate membership revoked'; end if;
 select * into v_team from public.equipos_cuenta
 where id=v_member.equipo_id and owner_user_id=p_owner for share;
 if not found then raise exception using errcode='42501',message='Delegate team changed'; end if;
 select * into v_subscription from public.suscripciones
 where user_id=p_owner for share;
 if not found or v_subscription.estado not in ('gift_free','trial','active')
 or (v_subscription.expira_en is not null and v_subscription.expira_en<=clock_timestamp())
 then raise exception using errcode='42501',message='Team access inactive'; end if;
 select payload into v_main from public.configuracion
 where user_id=p_owner and id='main' and deleted_at is null for share;
 if not found then raise exception using errcode='42501',message='Team permissions unavailable'; end if;
 v_permissions:=case when jsonb_typeof(v_main->'delegatePermissions')='array'
 then v_main->'delegatePermissions' else '[]'::jsonb end;
 if p_pin_version is not null then
  v_fingerprint:=encode(extensions.digest(convert_to(
    coalesce(v_main->>'pinSalt','')||':'||coalesce(nullif(v_main->>'delegatePinHash',''),v_main->>'delegatePin',''),
    'UTF8'),'sha256'),'hex');
  if v_fingerprint is distinct from p_pin_version then
   raise exception using errcode='28000',message='Delegate PIN changed';
  end if;
 end if;

 if p_store='settings' and p_record_id='live'
 and v_permissions ?| array['partido','delegado'] then
  update public.configuracion set payload=p_payload,updated_at=p_updated,deleted_at=null
  where user_id=p_owner and id='live' and deleted_at is null
  and updated_at<=p_updated and payload->'timer'->>'matchId' is not null
  and payload->'timer'->>'matchId'=p_payload->'timer'->>'matchId';
  get diagnostics v_count=row_count;
  return v_count=1;
 elsif p_store='trainings' and v_permissions ? 'asistencia' then
  insert into public.asistencias(user_id,id,payload,updated_at,deleted_at)
  values(p_owner,p_record_id,p_payload,p_updated,null)
  on conflict(user_id,id) do update set payload=excluded.payload,
   updated_at=excluded.updated_at,deleted_at=null
  where asistencias.updated_at<=excluded.updated_at and asistencias.deleted_at is null;
  get diagnostics v_count=row_count;
  return v_count=1;
 end if;
 raise exception using errcode='42501',message='Delegate operation revoked';
end;
$$;
revoke all on function public.delegate_sync_upsert_v2(uuid,uuid,text,text,jsonb,bigint,text) from public,anon,authenticated;
grant execute on function public.delegate_sync_upsert_v2(uuid,uuid,text,text,jsonb,bigint,text) to service_role;

-- Keep the function's existing public result shape; all delegates use the
-- owner's canonical permissions, never invitation metadata or URL parameters.
create or replace function public.mi_equipo_contexto()
returns jsonb language sql stable security definer
set search_path=pg_catalog,pg_temp as $$
 select jsonb_build_object('team_id',e.id,'team_name',e.nombre,
 'data_owner_user_id',e.owner_user_id,'membership_role',m.role,
 'view_permissions',case when m.role='delegate'
 or auth.jwt()->'app_metadata'->>'campobase_role'='delegate_pin'
 then coalesce((select payload->'delegatePermissions' from public.configuracion
 where user_id=e.owner_user_id and id='main' and deleted_at is null),'[]'::jsonb)
 else m.view_permissions end)
 from public.equipo_miembros m join public.equipos_cuenta e on e.id=m.equipo_id
 where m.user_id=auth.uid() limit 1;
$$;
revoke all on function public.mi_equipo_contexto() from public,anon;
grant execute on function public.mi_equipo_contexto() to authenticated,service_role;

-- POLICY PHASE: deploy only once the adapter and Edge support email/PIN delegates.
do $$
declare target text;
begin
 foreach target in array array['jugadores','convocatorias','partidos','asistencias','configuracion'] loop
  execute format('drop policy if exists campobase_authenticated_team_gate on public.%I',target);
  execute format('create policy campobase_authenticated_team_gate on public.%I as restrictive
   for all to authenticated
   using (case when auth.uid() is null then false else user_id=auth.uid()
    and not campobase_private.is_delegate_actor() end)
   with check (case when auth.uid() is null then false else user_id=auth.uid()
    and not campobase_private.is_delegate_actor() end)',target);
  execute format('drop policy if exists campobase_anon_team_deny on public.%I',target);
  execute format('create policy campobase_anon_team_deny on public.%I as restrictive
   for all to anon using (false) with check (false)',target);
 end loop;
end;
$$;

-- Preserve public exercise-library reads and other buckets. Own writes require
-- an authenticated non-delegate, matching Storage owner and own path prefix.
drop policy if exists campobase_own_video_insert on storage.objects;
create policy campobase_own_video_insert on storage.objects as restrictive
for insert to authenticated with check (
 case when bucket_id<>'ejercicio-videos' then true when auth.uid() is null then false
 else not campobase_private.is_delegate_actor()
 and coalesce(owner_id,owner::text)=auth.uid()::text
 and split_part(name,'/',1)=auth.uid()::text end);
drop policy if exists campobase_own_video_update on storage.objects;
create policy campobase_own_video_update on storage.objects as restrictive
for update to authenticated using (
 case when bucket_id<>'ejercicio-videos' then true when auth.uid() is null then false
 else not campobase_private.is_delegate_actor()
 and coalesce(owner_id,owner::text)=auth.uid()::text
 and split_part(name,'/',1)=auth.uid()::text end)
with check (
 case when bucket_id<>'ejercicio-videos' then true when auth.uid() is null then false
 else not campobase_private.is_delegate_actor()
 and coalesce(owner_id,owner::text)=auth.uid()::text
 and split_part(name,'/',1)=auth.uid()::text end);
drop policy if exists campobase_own_video_delete on storage.objects;
create policy campobase_own_video_delete on storage.objects as restrictive
for delete to authenticated using (
 case when bucket_id<>'ejercicio-videos' then true when auth.uid() is null then false
 else not campobase_private.is_delegate_actor()
 and coalesce(owner_id,owner::text)=auth.uid()::text
 and split_part(name,'/',1)=auth.uid()::text end);

-- Anonymous denials have no private helper dependency. PostgreSQL checks function
-- permissions even when a CASE branch would be false; do not grant anon the helper.
drop policy if exists campobase_anon_video_insert on storage.objects;
create policy campobase_anon_video_insert on storage.objects as restrictive
for insert to anon with check (bucket_id<>'ejercicio-videos');
drop policy if exists campobase_anon_video_update on storage.objects;
create policy campobase_anon_video_update on storage.objects as restrictive
for update to anon using (bucket_id<>'ejercicio-videos') with check (bucket_id<>'ejercicio-videos');
drop policy if exists campobase_anon_video_delete on storage.objects;
create policy campobase_anon_video_delete on storage.objects as restrictive
for delete to anon using (bucket_id<>'ejercicio-videos');

-- Finalize only after delegate-sync v2 is active. No actor-less service writes.
revoke all on function public.delegate_sync_upsert(uuid,text,text,jsonb,bigint) from public,anon,authenticated,service_role;
