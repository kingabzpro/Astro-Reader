-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reading progress table
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  scroll_position DECIMAL(5, 4) DEFAULT 0.0,
  element_id TEXT,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter_id)
);

-- Reader settings/preferences
CREATE TABLE reader_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Typography settings
  font_size INTEGER DEFAULT 18,
  line_height DECIMAL(3, 2) DEFAULT 1.6,
  content_width INTEGER DEFAULT 720,

  -- Theme settings
  theme TEXT DEFAULT 'system',

  -- Reading behavior
  auto_save_progress BOOLEAN DEFAULT TRUE,
  show_reading_progress BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reader_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading_progress
CREATE POLICY "Users can view own progress"
  ON reading_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON reading_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON reading_progress FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reader_settings
CREATE POLICY "Users can view own settings"
  ON reader_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON reader_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON reader_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON reader_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_progress_user_book_chapter ON reading_progress(user_id, book_id, chapter_id);
CREATE INDEX idx_progress_last_read ON reading_progress(user_id, last_read_at DESC);
CREATE INDEX idx_settings_user ON reader_settings(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE
  ON reading_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reader_settings_updated_at BEFORE UPDATE
  ON reader_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
