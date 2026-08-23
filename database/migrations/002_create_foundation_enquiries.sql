CREATE TABLE IF NOT EXISTS foundation_enquiries (
  id BIGSERIAL PRIMARY KEY,

  name VARCHAR(150) NOT NULL,

  email VARCHAR(255) NOT NULL,

  phone VARCHAR(20) NOT NULL,

  subject VARCHAR(100) NOT NULL,

  message TEXT NOT NULL,

  status VARCHAR(30) NOT NULL DEFAULT 'NEW'
    CHECK (
      status IN (
        'NEW',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
      )
    ),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foundation_enquiries_status
  ON foundation_enquiries(status);

CREATE INDEX IF NOT EXISTS idx_foundation_enquiries_created_at
  ON foundation_enquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_enquiries_email
  ON foundation_enquiries(email);