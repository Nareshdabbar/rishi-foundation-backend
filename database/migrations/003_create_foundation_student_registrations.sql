CREATE TABLE IF NOT EXISTS foundation_student_registrations (
  id BIGSERIAL PRIMARY KEY,

  registration_type VARCHAR(20) NOT NULL
    CHECK (registration_type IN ('student', 'teacher')),

  student_name VARCHAR(150) NOT NULL,
  surname VARCHAR(150) NOT NULL,

  date_of_birth DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,

  teacher_name VARCHAR(150),
  teacher_phone VARCHAR(20),

  father_name VARCHAR(150),
  mother_name VARCHAR(150),
  guardian_name VARCHAR(150),

  parent_phone VARCHAR(20),
  alternate_phone VARCHAR(20),
  parent_email VARCHAR(255),

  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  mandal VARCHAR(100) NOT NULL,
  village_town VARCHAR(150) NOT NULL,
  pincode VARCHAR(6) NOT NULL,

  school_name VARCHAR(255) NOT NULL,
  school_type VARCHAR(100) NOT NULL,
  current_class VARCHAR(100) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,

  note TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_teacher_details
    CHECK (
      registration_type = 'student'
      OR (
        teacher_name IS NOT NULL
        AND teacher_phone IS NOT NULL
      )
    )
);

CREATE INDEX IF NOT EXISTS idx_foundation_student_registrations_type
  ON foundation_student_registrations(registration_type);

CREATE INDEX IF NOT EXISTS idx_foundation_student_registrations_created_at
  ON foundation_student_registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_student_registrations_school
  ON foundation_student_registrations(school_name);

CREATE INDEX IF NOT EXISTS idx_foundation_student_registrations_district
  ON foundation_student_registrations(district);