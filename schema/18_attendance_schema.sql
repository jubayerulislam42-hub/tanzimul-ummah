-- Attendance module schema for student/teacher/admin dashboards.
-- Idempotent: uses IF NOT EXISTS / DROP POLICY IF EXISTS everywhere.

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present','absent','late','excused')),
  marked_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- ===== RLS =====
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Student sees own attendance.
DROP POLICY IF EXISTS "attendance_select" ON attendance;
CREATE POLICY "attendance_select" ON attendance
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM students s WHERE s.id = attendance.student_id)
    OR is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = attendance.student_id))
  );

-- Admin/teacher (branch-scoped) can mark attendance.
DROP POLICY IF EXISTS "attendance_write" ON attendance;
CREATE POLICY "attendance_write" ON attendance
  FOR ALL USING (
    is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = attendance.student_id))
  ) WITH CHECK (
    is_admin_role(ARRAY['principal','regional_supervisor','super_admin'])
    OR can_approve_branch((SELECT branch_id FROM students s WHERE s.id = attendance.student_id))
  );
