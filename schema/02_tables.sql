-- ---------- STUDENTS ----------
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references user_profiles(id),
  roll_id text unique not null,
  name_bn text not null,
  name_en text,
  father_name text,
  mother_name text,
  date_of_birth date,
  branch_id uuid references branches(id) not null,
  admission_date date,
  completion_date date,
  status record_status default 'active',
  photo_url text,
  guardian_phone text,
  address text,
  class_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- TEACHERS ----------
create table if not exists teachers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references user_profiles(id),
  employee_id text unique not null,
  name_bn text not null,
  name_en text,
  designation text,
  branch_id uuid references branches(id) not null,
  joining_date date,
  qualification text,
  phone text,
  photo_url text,
  monthly_salary numeric,
  status record_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- STAFF ----------
create table if not exists staff (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references user_profiles(id),
  employee_id text unique not null,
  name_bn text not null,
  name_en text,
  designation text,
  branch_id uuid references branches(id) not null,
  joining_date date,
  phone text,
  photo_url text,
  monthly_salary numeric,
  status record_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- REGIONAL SUPERVISORS ----------
create table if not exists regional_supervisors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references user_profiles(id),
  name text not null,
  email text unique not null,
  division text,
  accessible_branches uuid[] default '{}',
  created_at timestamptz default now()
);

-- ---------- ADMIN WHITELIST ----------
create table if not exists admin_whitelist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role user_role not null,
  branch_id uuid references branches(id),
  added_by uuid references user_profiles(id),
  created_at timestamptz default now()
);

-- ---------- CLASSES ----------
create table if not exists classes (
  id uuid primary key default uuid_generate_v4(),
  branch_id uuid references branches(id) not null,
  name_bn text not null,
  name_en text,
  category class_category not null default 'সাধারণ',
  class_teacher_id uuid references user_profiles(id),
  created_at timestamptz default now()
);

-- ---------- NOTICES ----------
create table if not exists notices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  branch_id uuid references branches(id),
  target_type text not null default 'branch' check (target_type in ('branch','class','student')),
  target_id uuid,
  sent_by uuid references user_profiles(id),
  publish_date date default current_date,
  expire_date date,
  attachment_url text,
  created_at timestamptz default now()
);

-- ---------- LESSON UPDATES ----------
create table if not exists lesson_updates (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid references classes(id) not null,
  branch_id uuid references branches(id) not null,
  type text not null check (type in ('hifz_progress','homework','syllabus')),
  title text not null,
  description text,
  para_number int,
  surah_name text,
  ayah_range text,
  subject text,
  lesson_date date default current_date,
  created_by uuid references user_profiles(id),
  created_at timestamptz default now()
);

-- ---------- HOLIDAYS ----------
create table if not exists holidays (
  id uuid primary key default uuid_generate_v4(),
  title_bn text not null,
  title_en text,
  start_date date not null,
  end_date date not null,
  description text,
  branch_id uuid references branches(id)
);

-- ---------- AWARDS ----------
create table if not exists awards (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id),
  title text not null,
  competition_name text,
  position text,
  award_date date,
  certificate_url text
);

-- ---------- NOTIFICATIONS ----------
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references user_profiles(id) not null,
  type text not null,
  title text not null,
  body text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz default now()
);
