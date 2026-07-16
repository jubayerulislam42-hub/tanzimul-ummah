-- ---------- EXPENSE CATEGORIES (editable) ----------
create table if not exists expense_categories (
  id uuid primary key default uuid_generate_v4(),
  name_bn text not null,
  name_en text,
  parent_group text
);
insert into expense_categories (name_bn, name_en, parent_group)
select v.name_bn, v.name_en, v.parent_group from (values
  ('অধ্যক্ষের বেতন','Principal Salary','বেতন'),
  ('শিক্ষকদের বেতন','Teacher Salary','বেতন'),
  ('স্টাফদের বেতন','Staff Salary','বেতন'),
  ('প্রতিষ্ঠান ভবন ভাড়া','Building Rent','ভাড়া'),
  ('ছাত্রাবাস ভাড়া','Hostel Rent','ভাড়া'),
  ('খাদ্য/মেস খরচ','Food/Mess Expense','পরিচালন ব্যয়'),
  ('বিদ্যুৎ বিল','Electricity Bill','পরিচালন ব্যয়'),
  ('গ্যাস বিল','Gas Bill','পরিচালন ব্যয়'),
  ('পানি বিল','Water Bill','পরিচালন ব্যয়'),
  ('ইন্টারনেট বিল','Internet Bill','পরিচালন ব্যয়'),
  ('স্টেশনারি/শিক্ষা উপকরণ','Stationery','পরিচালন ব্যয়'),
  ('চিকিৎসা খরচ','Medical Expense','পরিচালন ব্যয়'),
  ('যাতায়াত খরচ','Transport Expense','পরিচালন ব্যয়'),
  ('ভবন রক্ষণাবেক্ষণ','Maintenance','পরিচালন ব্যয়'),
  ('আসবাবপত্র/সরঞ্জাম','Furniture/Equipment','পরিচালন ব্যয়'),
  ('অনুষ্ঠান/মাহফিল খরচ','Event Expense','পরিচালন ব্যয়'),
  ('দাওয়াতি/প্রচার খরচ','Dawah/Promotion','পরিচালন ব্যয়'),
  ('বিবিধ খরচ','Miscellaneous','পরিচালন ব্যয়')
) as v(name_bn, name_en, parent_group)
on conflict do nothing;

-- ---------- INCOME CATEGORIES (editable) ----------
create table if not exists income_categories (
  id uuid primary key default uuid_generate_v4(),
  name_bn text not null,
  name_en text
);
insert into income_categories (name_bn, name_en)
select v.name_bn, v.name_en from (values
  ('ভর্তি ফি','Admission Fee'),
  ('মাসিক বেতন (ছাত্র ফি)','Monthly Student Fee'),
  ('ব্যক্তিগত অনুদান','Personal Donation'),
  ('ফাউন্ডেশন অনুদান','Foundation Donation'),
  ('যাকাত','Zakat'),
  ('সদকা/ফিতরা','Sadaqah/Fitrah'),
  ('পরীক্ষার ফি','Exam Fee'),
  ('অন্যান্য আয়','Other Income')
) as v(name_bn, name_en)
on conflict do nothing;

-- ---------- INCOME ----------
create table if not exists income (
  id uuid primary key default uuid_generate_v4(),
  branch_id uuid references branches(id) not null,
  category_id uuid references income_categories(id) not null,
  amount numeric not null,
  entry_date date default current_date,
  note text,
  added_by uuid references user_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- EXPENSES ----------
create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  branch_id uuid references branches(id) not null,
  category_id uuid references expense_categories(id) not null,
  amount numeric not null,
  entry_date date default current_date,
  note text,
  receipt_url text,
  added_by uuid references user_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
