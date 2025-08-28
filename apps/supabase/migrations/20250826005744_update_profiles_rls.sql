create policy "Authenticated users can insert their own profile" on public.profiles
as permissive
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Authenticated users can update their own profile" on public.profiles
as permissive
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
