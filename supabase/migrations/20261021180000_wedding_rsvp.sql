create type public.rsvp_attendance as enum ('accept', 'decline');

create table public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  primary_guest_name text not null check (char_length(primary_guest_name) between 3 and 100),
  primary_guest_name_normalized text not null,
  phone_number text not null check (char_length(phone_number) between 7 and 32),
  phone_number_normalized text not null check (char_length(phone_number_normalized) between 7 and 15),
  attendance public.rsvp_attendance not null,
  dietary_notes text check (dietary_notes is null or char_length(dietary_notes) <= 1000),
  total_attending smallint not null check ((attendance = 'accept' and total_attending between 1 and 8) or (attendance = 'decline' and total_attending = 0)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (primary_guest_name_normalized, phone_number_normalized)
);

create table public.rsvp_additional_guests (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.rsvp_responses(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 3 and 100),
  full_name_normalized text not null,
  created_at timestamptz not null default now(),
  unique (response_id, full_name_normalized)
);

create table public.rsvp_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  updated_at timestamptz not null default now()
);

create table public.wedding_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.rsvp_responses enable row level security;
alter table public.rsvp_additional_guests enable row level security;
alter table public.rsvp_rate_limits enable row level security;
alter table public.wedding_admins enable row level security;

revoke all on table public.rsvp_responses, public.rsvp_additional_guests, public.rsvp_rate_limits, public.wedding_admins from anon, authenticated;

create index rsvp_responses_created_at_index on public.rsvp_responses (created_at desc);
create index rsvp_additional_guests_response_id_index on public.rsvp_additional_guests (response_id);

create or replace function public.normalize_rsvp_name(value text)
returns text language sql immutable strict set search_path = public as $$
  select lower(regexp_replace(trim(value), '\s+', ' ', 'g'));
$$;

create or replace function public.normalize_rsvp_phone(value text)
returns text language sql immutable strict set search_path = public as $$
  select regexp_replace(value, '[^0-9]', '', 'g');
$$;

create or replace function public.consume_rsvp_rate_limit(p_key_hash text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_attempt_count integer;
  v_window_started_at timestamptz;
begin
  if p_limit < 1 or p_window_seconds < 1 then raise exception 'Invalid rate limit settings'; end if;

  insert into public.rsvp_rate_limits as rate_limit (key_hash, window_started_at, attempt_count, updated_at)
  values (p_key_hash, now(), 1, now())
  on conflict (key_hash) do update set
    window_started_at = case when rate_limit.window_started_at < now() - make_interval(secs => p_window_seconds) then now() else rate_limit.window_started_at end,
    attempt_count = case when rate_limit.window_started_at < now() - make_interval(secs => p_window_seconds) then 1 else rate_limit.attempt_count + 1 end,
    updated_at = now()
  returning attempt_count, window_started_at into v_attempt_count, v_window_started_at;

  return v_attempt_count <= p_limit;
end;
$$;

create or replace function public.create_rsvp_submission(
  p_primary_guest_name text,
  p_phone_number text,
  p_attendance text,
  p_dietary_notes text,
  p_additional_guests text[] default array[]::text[]
)
returns table (id uuid, primary_guest_name text, phone_number text, attendance public.rsvp_attendance, dietary_notes text, total_attending smallint)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_response_id uuid;
  v_attendance public.rsvp_attendance;
  v_total smallint;
  v_primary_normalized text;
  v_phone_normalized text;
begin
  if p_attendance not in ('accept', 'decline') then raise exception 'Invalid attendance response'; end if;
  v_attendance := p_attendance::public.rsvp_attendance;
  v_primary_normalized := public.normalize_rsvp_name(p_primary_guest_name);
  v_phone_normalized := public.normalize_rsvp_phone(p_phone_number);
  if char_length(v_primary_normalized) < 3 or char_length(v_phone_normalized) not between 7 and 15 then raise exception 'Invalid guest data'; end if;

  if v_attendance = 'decline' then
    p_additional_guests := array[]::text[];
    p_dietary_notes := null;
    v_total := 0;
  else
    v_total := 1 + coalesce(array_length(p_additional_guests, 1), 0);
    if v_total > 8 then raise exception 'Guest limit exceeded'; end if;
  end if;

  insert into public.rsvp_responses (primary_guest_name, primary_guest_name_normalized, phone_number, phone_number_normalized, attendance, dietary_notes, total_attending)
  values (trim(p_primary_guest_name), v_primary_normalized, trim(p_phone_number), v_phone_normalized, v_attendance, nullif(trim(p_dietary_notes), ''), v_total)
  on conflict (primary_guest_name_normalized, phone_number_normalized) do update set
    primary_guest_name = excluded.primary_guest_name,
    phone_number = excluded.phone_number,
    attendance = excluded.attendance,
    dietary_notes = excluded.dietary_notes,
    total_attending = excluded.total_attending,
    updated_at = now()
  returning rsvp_responses.id into v_response_id;

  delete from public.rsvp_additional_guests where response_id = v_response_id;
  if v_attendance = 'accept' and coalesce(array_length(p_additional_guests, 1), 0) > 0 then
    insert into public.rsvp_additional_guests (response_id, full_name, full_name_normalized)
    select v_response_id, trim(guest_name), public.normalize_rsvp_name(guest_name)
    from unnest(p_additional_guests) as guest_name;
  end if;

  return query
  select response.id, response.primary_guest_name, response.phone_number, response.attendance, response.dietary_notes, response.total_attending
  from public.rsvp_responses as response where response.id = v_response_id;
end;
$$;

create or replace function public.update_rsvp_submission(
  p_response_id uuid,
  p_primary_guest_name text,
  p_phone_number text,
  p_attendance text,
  p_dietary_notes text,
  p_additional_guests text[] default array[]::text[]
)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_attendance public.rsvp_attendance;
  v_total smallint;
  v_primary_normalized text;
  v_phone_normalized text;
begin
  perform 1 from public.rsvp_responses where id = p_response_id for update;
  if not found then raise exception 'RSVP response not found'; end if;

  if p_attendance not in ('accept', 'decline') then raise exception 'Invalid attendance response'; end if;
  v_attendance := p_attendance::public.rsvp_attendance;
  v_primary_normalized := public.normalize_rsvp_name(p_primary_guest_name);
  v_phone_normalized := public.normalize_rsvp_phone(p_phone_number);
  if char_length(v_primary_normalized) < 3 or char_length(v_phone_normalized) not between 7 and 15 then raise exception 'Invalid guest data'; end if;

  if v_attendance = 'decline' then
    p_additional_guests := array[]::text[];
    p_dietary_notes := null;
    v_total := 0;
  else
    v_total := 1 + coalesce(array_length(p_additional_guests, 1), 0);
    if v_total > 8 then raise exception 'Guest limit exceeded'; end if;
  end if;

  update public.rsvp_responses set
    primary_guest_name = trim(p_primary_guest_name),
    primary_guest_name_normalized = v_primary_normalized,
    phone_number = trim(p_phone_number),
    phone_number_normalized = v_phone_normalized,
    attendance = v_attendance,
    dietary_notes = nullif(trim(p_dietary_notes), ''),
    total_attending = v_total,
    updated_at = now()
  where id = p_response_id;

  delete from public.rsvp_additional_guests where response_id = p_response_id;
  if v_attendance = 'accept' and coalesce(array_length(p_additional_guests, 1), 0) > 0 then
    insert into public.rsvp_additional_guests (response_id, full_name, full_name_normalized)
    select p_response_id, trim(guest_name), public.normalize_rsvp_name(guest_name)
    from unnest(p_additional_guests) as guest_name;
  end if;
end;
$$;

revoke all on function public.consume_rsvp_rate_limit(text, integer, integer), public.create_rsvp_submission(text, text, text, text, text[]), public.update_rsvp_submission(uuid, text, text, text, text, text[]) from public, anon, authenticated;
grant execute on function public.consume_rsvp_rate_limit(text, integer, integer), public.create_rsvp_submission(text, text, text, text, text[]), public.update_rsvp_submission(uuid, text, text, text, text, text[]) to service_role;
