-- SDD059: bind new permission requests to their opening account. Deploy this
-- wrapper before the new client; the original RPC remains for older clients.
-- The existing owner/member checks, permission normalization and return shape
-- were verified with pg_get_functiondef in a read-only production query.
-- Creating the wrapper does not change any membership or permissions.
create or replace function public.set_delegate_permissions_v2(
 p_permissions text[],p_expected_user_id uuid
) returns jsonb language plpgsql security invoker
set search_path=pg_catalog,pg_temp as $$
begin
 if auth.uid() is null or p_expected_user_id is null
 or auth.uid()<>p_expected_user_id then
  raise exception using errcode='28000',message='La cuenta ha cambiado. Vuelve a abrir los permisos.';
 end if;
 return public.set_delegate_permissions(p_permissions);
end;
$$;
revoke all on function public.set_delegate_permissions_v2(text[],uuid) from public,anon,authenticated,service_role;
grant execute on function public.set_delegate_permissions_v2(text[],uuid) to authenticated;
