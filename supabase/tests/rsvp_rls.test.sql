begin;
select plan(12);

select ok(row_security_active('public.rsvp_responses'), 'RSVP responses has RLS enabled');
select ok(row_security_active('public.rsvp_additional_guests'), 'Additional guests has RLS enabled');
select ok(row_security_active('public.rsvp_rate_limits'), 'Rate limits has RLS enabled');
select ok(row_security_active('public.wedding_admins'), 'Wedding admins has RLS enabled');

select ok(not has_table_privilege('anon', 'public.rsvp_responses', 'select,insert,update,delete'), 'anon cannot access RSVP responses');
select ok(not has_table_privilege('authenticated', 'public.rsvp_responses', 'select,insert,update,delete'), 'authenticated cannot access RSVP responses directly');
select ok(not has_table_privilege('anon', 'public.rsvp_additional_guests', 'select,insert,update,delete'), 'anon cannot access household members');
select ok(not has_table_privilege('authenticated', 'public.rsvp_additional_guests', 'select,insert,update,delete'), 'authenticated cannot access household members directly');
select ok(not has_table_privilege('anon', 'public.rsvp_rate_limits', 'select,insert,update,delete'), 'anon cannot access rate-limit records');
select ok(not has_table_privilege('authenticated', 'public.rsvp_rate_limits', 'select,insert,update,delete'), 'authenticated cannot access rate-limit records');
select ok(not has_table_privilege('anon', 'public.wedding_admins', 'select,insert,update,delete'), 'anon cannot access admin allowlist');
select ok(not has_table_privilege('authenticated', 'public.wedding_admins', 'select,insert,update,delete'), 'authenticated cannot access admin allowlist directly');

select * from finish();
rollback;
