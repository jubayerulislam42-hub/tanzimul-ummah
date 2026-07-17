-- Hifz progress + exam results schema for student dashboard modules.
-- Idempotent: drops/recreates only if missing, uses IF NOT EXISTS everywhere.

-- 1) Surah reference table (seeded once)
CREATE TABLE IF NOT EXISTS quran_surahs (
  id smallint PRIMARY KEY,
  name_bn text NOT NULL,
  name_ar text,
  name_en text,
  ayah_count smallint NOT NULL
);

-- 2) Per-student hifz progress per surah
CREATE TABLE IF NOT EXISTS hifz_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  surah_id smallint NOT NULL REFERENCES quran_surahs(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','memorized','revised')),
  ayah_from smallint,
  ayah_to smallint,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, surah_id)
);

-- 3) Exam results
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_name text NOT NULL,
  subject text,
  marks_obtained numeric,
  marks_total numeric,
  grade text,
  exam_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_hifz_student ON hifz_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_exams_student ON exams(student_id);

-- ===== RLS =====
ALTER TABLE quran_surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hifz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- quran_surahs: readable by anyone authenticated (reference data)
DROP POLICY IF EXISTS "surahs_read" ON quran_surahs;
CREATE POLICY "surahs_read" ON quran_surahs
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- hifz_progress: student sees own; branch-scoped admin manages.
DROP POLICY IF EXISTS "hifz_select" ON hifz_progress;
CREATE POLICY "hifz_select" ON hifz_progress
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM students s WHERE s.id = hifz_progress.student_id)
    OR is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = hifz_progress.student_id))
  );
DROP POLICY IF EXISTS "hifz_write" ON hifz_progress;
CREATE POLICY "hifz_write" ON hifz_progress
  FOR ALL USING (
    is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = hifz_progress.student_id))
  ) WITH CHECK (
    is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = hifz_progress.student_id))
  );

-- exams: same pattern
DROP POLICY IF EXISTS "exams_select" ON exams;
CREATE POLICY "exams_select" ON exams
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM students s WHERE s.id = exams.student_id)
    OR is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = exams.student_id))
  );
DROP POLICY IF EXISTS "exams_write" ON exams;
CREATE POLICY "exams_write" ON exams
  FOR ALL USING (
    is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = exams.student_id))
  ) WITH CHECK (
    is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = exams.student_id))
  );
