-- SDD059: the owner's row version and player profile are checked while the
-- conflicting row is locked. Deploy after the private delegate classifier.
-- This only creates an RPC; it never rewrites existing sporting records.
do $$ begin
 if to_regprocedure('public.owner_sync_upsert(text,text,jsonb,bigint,boolean)') is not null then
  execute 'revoke all on function public.owner_sync_upsert(text,text,jsonb,bigint,boolean) from public,anon,authenticated,service_role';
 end if;
end $$;
create or replace function public.owner_sync_upsert(
 p_store text,p_record_id text,p_payload jsonb,p_updated bigint,p_deleted boolean default false,
 p_expected_user_id uuid default null
) returns boolean language plpgsql security invoker
set search_path=pg_catalog,pg_temp as $$
declare
 v_actor uuid:=auth.uid();
 v_table text;
 v_payload_expression text:='excluded.payload';
 v_count integer;
begin
 if v_actor is null or p_expected_user_id is null or v_actor<>p_expected_user_id then
  raise exception using errcode='28000',message='Owner authentication required';
 end if;
 if campobase_private.is_delegate_actor() then
  raise exception using errcode='42501',message='Delegate must use filtered synchronization';
 end if;
 v_table:=case p_store when 'players' then 'jugadores'
  when 'matches' then 'partidos' when 'callups' then 'convocatorias'
  when 'trainings' then 'asistencias' when 'settings' then 'configuracion' else null end;
 if v_table is null or p_record_id is null or length(p_record_id)>250
 or p_updated is null or p_updated<0 or p_deleted is null
 or p_updated>(extract(epoch from clock_timestamp())*1000)::bigint+60000
 or (not p_deleted and (jsonb_typeof(p_payload) is distinct from 'object'
  or p_payload->>'id' is distinct from p_record_id)) then
  raise exception using errcode='22023',message='Invalid owner mutation';
 end if;
 if p_store='players' and not p_deleted then
  -- Preserve only the current profile fields, including removal of a field
  -- that the newer profile no longer contains. Sporting values stay incoming.
  -- Historic numeric strings are accepted; invalid/missing revisions are zero.
  v_payload_expression:=$profile$
   case when jsonb_typeof(current_row.payload)='object' and
    (case when current_row.payload->>'profileUpdatedAt' ~ '^[0-9]+([.][0-9]+)?$'
     then (current_row.payload->>'profileUpdatedAt')::numeric else 0 end)
    >=
    (case when excluded.payload->>'profileUpdatedAt' ~ '^[0-9]+([.][0-9]+)?$'
     then (excluded.payload->>'profileUpdatedAt')::numeric else 0 end)
   then (excluded.payload-array[
    'name','number','positions','foot','notes','fatherName','fatherPhone',
    'motherName','motherPhone','photo','createdAt','profileUpdatedAt'
   ]) || coalesce((select jsonb_object_agg(profile.key,profile.value)
    from jsonb_each(coalesce(current_row.payload,'{}'::jsonb)) as profile
    where profile.key=any(array[
     'name','number','positions','foot','notes','fatherName','fatherPhone',
     'motherName','motherPhone','photo','createdAt','profileUpdatedAt'
    ])),'{}'::jsonb)
   else excluded.payload end
  $profile$;
 end if;
 -- Table and expression are chosen only by the whitelist above. All caller
 -- values, including the authenticated owner, are bound parameters.
 execute format($upsert$
  insert into public.%I as current_row(user_id,id,payload,updated_at,deleted_at)
  values($1,$2,$3,$4,$5)
  on conflict(user_id,id) do update set payload=%s,
   updated_at=excluded.updated_at,deleted_at=excluded.deleted_at
  where current_row.updated_at<=excluded.updated_at
 $upsert$,v_table,v_payload_expression)
 using v_actor,p_record_id,case when p_deleted then null else p_payload end,
  p_updated,case when p_deleted then p_updated else null end;
 get diagnostics v_count=row_count;
 return v_count=1;
end;
$$;
revoke all on function public.owner_sync_upsert(text,text,jsonb,bigint,boolean,uuid) from public,anon,authenticated,service_role;
grant execute on function public.owner_sync_upsert(text,text,jsonb,bigint,boolean,uuid) to authenticated;
