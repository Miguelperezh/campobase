-- Supabase Auth sets administrator app_metadata after its initial user insert.
-- Resolve trusted metadata after createUser; never authorize from user_metadata.
create or replace function public.provision_delegate_pin(p_user uuid, p_owner uuid)
returns boolean language plpgsql security invoker set search_path=public,pg_temp as $$
declare v_owner uuid := p_owner; v_team uuid; v_role text; v_permissions jsonb;
begin
 -- The Edge caller has just verified both trusted metadata fields with Auth admin API.
 -- Service-only invocation avoids granting any direct access to auth.users.
 if not exists(select 1 from public.perfiles where id=p_user
 and email='pin-delegate+'||p_owner::text||'@campobase.invalid') then return false; end if;
 if v_owner is null or v_owner=p_user then return false; end if;
 select id into v_team from public.equipos_cuenta where owner_user_id=v_owner;
 select payload->'delegatePermissions' into v_permissions from public.configuracion
 where user_id=v_owner and id='main' and deleted_at is null;
 if v_team is null or v_permissions is null then return false; end if;
 select role into v_role from public.equipo_miembros where user_id=p_user;
 if exists(select 1 from public.jugadores where user_id=p_user)
 or exists(select 1 from public.partidos where user_id=p_user)
 or exists(select 1 from public.convocatorias where user_id=p_user)
 or exists(select 1 from public.asistencias where user_id=p_user)
 or exists(select 1 from public.configuracion where user_id=p_user) then
   raise exception 'La identidad técnica contiene datos; no se puede reasociar';
 end if;
 update public.perfiles set role='delegate',updated_at=now() where id=p_user;
 insert into public.equipo_miembros(equipo_id,user_id,role,view_permissions)
 values(v_team,p_user,'delegate',v_permissions)
 on conflict(user_id) do update set equipo_id=excluded.equipo_id,role='delegate',
 view_permissions=excluded.view_permissions,updated_at=now();
 -- Preserve the automatic empty team/subscription; no data is deleted.
 return true;
end;
$$;
revoke all on function public.provision_delegate_pin(uuid,uuid) from public,anon,authenticated;
grant execute on function public.provision_delegate_pin(uuid,uuid) to service_role;

do $$ begin
 if to_regprocedure('public.provision_delegate_pin(uuid)') is not null then
  revoke all on function public.provision_delegate_pin(uuid) from service_role;
 end if;
end $$;
