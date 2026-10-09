create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_team_id uuid;
  v_name text := coalesce(nullif(trim(new.raw_user_meta_data->>'club_name'), ''), 'Mi equipo');
begin
  -- Only trusted Auth administrator metadata can provision a PIN delegate.
  if new.raw_app_meta_data->>'campobase_role' = 'delegate_pin' then
    select id, nombre into v_team_id, v_name from public.equipos_cuenta
    where owner_user_id = (new.raw_app_meta_data->>'campobase_owner_id')::uuid;
    if v_team_id is null then raise exception 'Equipo del delegado no encontrado'; end if;
    insert into public.perfiles(id,email,username,full_name,club_name,role)
    values(new.id,new.email,'d_'||replace(new.id::text,'-',''),'Delegado',v_name,'delegate');
    insert into public.equipo_miembros(equipo_id,user_id,role,view_permissions)
    select v_team_id,new.id,'delegate',coalesce(payload->'delegatePermissions','[]'::jsonb)
    from public.configuracion
    where user_id=(new.raw_app_meta_data->>'campobase_owner_id')::uuid and id='main' and deleted_at is null;
    if not found then raise exception 'Permisos del delegado no encontrados'; end if;
    return new;
  end if;
  insert into public.perfiles (id, email, username, full_name, club_name, role)
  values (
    new.id,
    new.email,
    lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    v_name,
    'coach'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = timezone('utc', now());

  insert into public.equipos_cuenta(owner_user_id, nombre)
  values (new.id, v_name)
  on conflict (owner_user_id) do update
    set updated_at = timezone('utc', now())
  returning id into v_team_id;

  insert into public.equipo_miembros(equipo_id, user_id, role, view_permissions)
  values (v_team_id, new.id, 'coach', '[]'::jsonb)
  on conflict (user_id) do nothing;

  insert into public.suscripciones(
    user_id, estado, plan, dias_prueba, expira_en, cancel_at_period_end
  )
  values (
    new.id, 'pending_payment', 'mensual', 14, now() + interval '14 days', false
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Additional restrictive gates neutralize historical public ALL policies.
-- Existing records, permissive policies and owner/member access are preserved.
create policy campobase_authenticated_team_gate on public.jugadores as restrictive for all to anon,authenticated using (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id())) with check (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id()));
create policy campobase_authenticated_team_gate on public.convocatorias as restrictive for all to anon,authenticated using (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id())) with check (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id()));
create policy campobase_authenticated_team_gate on public.partidos as restrictive for all to anon,authenticated using (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id())) with check (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id()));
create policy campobase_authenticated_team_gate on public.asistencias as restrictive for all to anon,authenticated using (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id())) with check (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id()));
create policy campobase_authenticated_team_gate on public.configuracion as restrictive for all to anon,authenticated using (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id())) with check (auth.uid() is not null and coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin' and (user_id=auth.uid() or user_id=public.current_team_owner_id()));
create policy campobase_delegate_no_insert on public.perfiles as restrictive for insert to anon,authenticated with check (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin');
create policy campobase_delegate_no_update on public.perfiles as restrictive for update to anon,authenticated using (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin') with check (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin');
create policy campobase_delegate_no_delete on public.perfiles as restrictive for delete to anon,authenticated using (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin') ;
create policy campobase_delegate_no_insert on storage.objects as restrictive for insert to anon,authenticated with check (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin');
create policy campobase_delegate_no_update on storage.objects as restrictive for update to anon,authenticated using (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin') with check (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin');
create policy campobase_delegate_no_delete on storage.objects as restrictive for delete to anon,authenticated using (coalesce(auth.jwt()->'app_metadata'->>'campobase_role','') <> 'delegate_pin') ;

create or replace function public.mi_equipo_contexto()
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
 select jsonb_build_object('team_id',e.id,'team_name',e.nombre,
 'data_owner_user_id',e.owner_user_id,'membership_role',m.role,
 'view_permissions',case when auth.jwt()->'app_metadata'->>'campobase_role'='delegate_pin'
 then coalesce((select payload->'delegatePermissions' from public.configuracion
 where user_id=e.owner_user_id and id='main' and deleted_at is null),'[]'::jsonb)
 else m.view_permissions end)
 from public.equipo_miembros m join public.equipos_cuenta e on e.id=m.equipo_id
 where m.user_id=auth.uid() limit 1;
$$;
