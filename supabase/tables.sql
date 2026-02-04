-- students
create table students (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  age integer not null check (age > 0),
  created_at timestamp with time zone default now()
);

-- courses
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  start_time time not null,
  description text not null,
  duration_minutes integer not null default 45,
  created_at timestamp with time zone default now()
);

-- course_students
create table course_students (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (course_id, student_id)
);
