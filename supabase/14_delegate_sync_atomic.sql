-- Service-only write boundary: one transaction checks fresh permissions and revision.
-- Does not change existing records; called only after a user's authorized live/attendance action.
create or replace function public.delegate_sync_upsert(
 p_owner uuid,p_store text,p_record_id text,p_payload jsonb,p_updated bigint
) returns boolean language plpgsql security invoker set search_path=public,pg_temp as $$
declare v_permissions jsonb; v_count integer;
begin
 select coalesce(payload->'delegatePermissions','[]'::jsonb) into v_permissions
 from public.configuracion where user_id=p_owner and id='main' and deleted_at is null for share;
 if p_payload->>'id' is distinct from p_record_id then return false; end if;
 if p_store='settings' and p_record_id='live' and v_permissions ?| array['partido','delegado'] then
   update public.configuracion set payload=p_payload,updated_at=p_updated,deleted_at=null
   where user_id=p_owner and id='live' and deleted_at is null
   and updated_at<=p_updated
   and payload->'timer'->>'matchId' is not null
   and payload->'timer'->>'matchId'=p_payload->'timer'->>'matchId';
   get diagnostics v_count=row_count;
   return v_count=1;
 elsif p_store='trainings' and v_permissions ? 'asistencia' then
   insert into public.asistencias(user_id,id,payload,updated_at,deleted_at)
   values(p_owner,p_record_id,p_payload,p_updated,null)
   on conflict (user_id,id) do update set payload=excluded.payload,updated_at=excluded.updated_at,deleted_at=null
   where asistencias.updated_at<=excluded.updated_at and asistencias.deleted_at is null;
   get diagnostics v_count=row_count;
   return v_count=1;
 end if;
 return false;
end;
$$;
revoke all on function public.delegate_sync_upsert(uuid,text,text,jsonb,bigint) from public,anon,authenticated;
grant execute on function public.delegate_sync_upsert(uuid,text,text,jsonb,bigint) to service_role;
