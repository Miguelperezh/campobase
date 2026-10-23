-- Non-writing authorization probes. Claims are simulated inside READ ONLY
-- transactions; no real session/PIN is created or shared. Output is aggregate.
begin read only;
select set_config('request.jwt.claims',(select jsonb_build_object(
 'sub',e.owner_user_id,'role','authenticated','app_metadata','{}'::jsonb)::text
 from public.equipos_cuenta e join public.equipo_miembros m on m.user_id=e.owner_user_id
 and m.equipo_id=e.id where m.role in ('admin','coach')
 order by (select count(*) from public.configuracion c where c.user_id=e.owner_user_id and c.id='main') desc
 limit 1),true);
set local role authenticated;
select set_config('campobase.probe_owner',jsonb_build_object(
 'visible_players',(select count(*) from public.jugadores),
 'foreign_players',(select count(*) from public.jugadores where user_id<>auth.uid()),
 'main_visible',exists(select 1 from public.configuracion where id='main'),
 'delegate_actor',campobase_private.is_delegate_actor())::text,true);
reset role;
select set_config('request.jwt.claims',(select jsonb_build_object(
 'sub',user_id,'role','authenticated','app_metadata','{}'::jsonb)::text
 from public.equipo_miembros where role='delegate' limit 1),true);
set local role authenticated;
select set_config('campobase.probe_delegate',jsonb_build_object(
 'visible_players',(select count(*) from public.jugadores),
 'direct_main_visible',exists(select 1 from public.configuracion where id='main'),
 'delegate_actor',campobase_private.is_delegate_actor(),
 'team_context_available',public.mi_equipo_contexto() is not null,
 'old_rpc_executable',has_function_privilege(current_user,'public.delegate_sync_upsert(uuid,text,text,jsonb,bigint)','EXECUTE'),
 'v2_rpc_executable',has_function_privilege(current_user,'public.delegate_sync_upsert_v2(uuid,uuid,text,text,jsonb,bigint,text)','EXECUTE'))::text,true);
reset role;
select set_config('request.jwt.claims','{"role":"anon"}',true);
set local role anon;
select set_config('campobase.probe_anon',jsonb_build_object(
 'visible_players',(select count(*) from public.jugadores),
 'direct_main_visible',exists(select 1 from public.configuracion where id='main'))::text,true);
reset role;
select jsonb_build_object(
 'owner',current_setting('campobase.probe_owner')::jsonb,
 'delegate',current_setting('campobase.probe_delegate')::jsonb,
 'anon',current_setting('campobase.probe_anon')::jsonb,
 'anon_private_helper_executable',has_function_privilege('anon','campobase_private.is_delegate_actor()','EXECUTE')) authorization;
rollback;
