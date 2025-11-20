-- Step 1: Drop the table and recreate it properly
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- Step 2: Create posts table with ALL columns
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'General',
  likes INTEGER DEFAULT 0,
  flagged BOOLEAN DEFAULT false,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create comments table
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
CREATE POLICY "Enable all for posts" ON posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for comments" ON comments FOR ALL USING (true) WITH CHECK (true);

-- Step 6: Insert sample data
INSERT INTO posts (title, content, author, category, likes, flagged) VALUES
('Welcome to CampusConnect', 'This is a test post', 'Admin', 'General', 0, false),
('AI is Amazing', 'Learning about artificial intelligence', 'Student1', 'Notes', 5, false),
('Need help with React', 'Can someone explain hooks?', 'Student2', 'Doubts', 3, false);
