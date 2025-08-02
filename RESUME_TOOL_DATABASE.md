# 📊 Resume Tool Database Schema

## 🏗️ Database Design Overview

The resume tool integrates seamlessly with the existing Visa Score database structure, extending the user profile system with resume-specific tables.

## 📋 Schema Design

### **Core Tables**

#### **1. resumes**
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File Information
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'pdf', 'docx', 'txt'
  storage_path TEXT NOT NULL, -- Supabase storage path
  
  -- Content
  raw_text TEXT NOT NULL,
  structured_data JSONB, -- Parsed resume sections
  
  -- Metadata
  title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  
  -- AI Analysis
  ai_analysis JSONB, -- Skills, experience level, industry, etc.
  ats_score INTEGER, -- 0-100 ATS compatibility
  improvement_suggestions JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX idx_resumes_active ON resumes(user_id, is_active) WHERE is_active = true;
```

#### **2. job_descriptions**
```sql
CREATE TABLE job_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Job Information
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  location VARCHAR(255),
  salary_min INTEGER,
  salary_max INTEGER,
  job_type VARCHAR(50), -- 'full-time', 'part-time', 'contract'
  experience_level VARCHAR(50), -- 'entry', 'mid', 'senior', 'executive'
  
  -- Content
  description TEXT NOT NULL,
  requirements JSONB, -- Parsed requirements
  source_url TEXT, -- Original job posting URL
  source_platform VARCHAR(50), -- 'linkedin', 'indeed', 'manual', etc.
  
  -- AI Analysis
  required_skills JSONB,
  preferred_skills JSONB,
  industry VARCHAR(100),
  visa_sponsorship BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_job_descriptions_title ON job_descriptions USING gin(to_tsvector('english', title));
CREATE INDEX idx_job_descriptions_visa ON job_descriptions(visa_sponsorship) WHERE visa_sponsorship = true;
```

#### **3. resume_job_matches**
```sql
CREATE TABLE resume_job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE CASCADE,
  
  -- Matching Scores
  overall_score INTEGER NOT NULL, -- 0-100 overall compatibility
  skills_score INTEGER NOT NULL, -- 0-100 skills match
  experience_score INTEGER NOT NULL, -- 0-100 experience match
  keywords_score INTEGER NOT NULL, -- 0-100 keyword optimization
  
  -- Detailed Analysis
  matching_skills JSONB, -- Skills that match
  missing_skills JSONB, -- Skills user lacks
  keyword_gaps JSONB, -- Important keywords missing
  strengths JSONB, -- What makes this a good match
  weaknesses JSONB, -- What could be improved
  
  -- AI Recommendations
  optimization_suggestions JSONB,
  interview_questions JSONB, -- Suggested questions for this role
  
  -- Metadata
  analysis_version VARCHAR(10) DEFAULT 'v1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_matches_user_id ON resume_job_matches(user_id);
CREATE INDEX idx_matches_resume_id ON resume_job_matches(resume_id);
CREATE INDEX idx_matches_score ON resume_job_matches(overall_score DESC);
CREATE UNIQUE INDEX idx_matches_unique ON resume_job_matches(resume_id, job_description_id);
```

#### **4. resume_optimizations**
```sql
CREATE TABLE resume_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
  
  -- Optimized Content
  optimized_content JSONB NOT NULL, -- Rewritten resume sections
  optimization_type VARCHAR(50) NOT NULL, -- 'job-specific', 'general', 'ats'
  
  -- Changes Made
  changes_summary JSONB, -- What was changed and why
  keyword_additions JSONB, -- Keywords added
  structure_improvements JSONB, -- Format/structure changes
  
  -- Quality Metrics
  readability_score INTEGER, -- 0-100
  ats_improvement INTEGER, -- Points improved
  estimated_impact VARCHAR(50), -- 'low', 'medium', 'high'
  
  -- Export Information
  exported_formats JSONB, -- Which formats were generated
  export_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ -- When user last accessed this optimization
);

-- Indexes
CREATE INDEX idx_optimizations_user_id ON resume_optimizations(user_id);
CREATE INDEX idx_optimizations_resume_id ON resume_optimizations(resume_id);
CREATE INDEX idx_optimizations_created ON resume_optimizations(created_at DESC);
```

#### **5. user_preferences**
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Career Preferences
  target_industries JSONB, -- Preferred industries
  target_roles JSONB, -- Preferred job titles
  salary_expectations JSONB, -- Min/max salary by location
  location_preferences JSONB, -- Preferred work locations
  work_preferences JSONB, -- Remote, hybrid, on-site
  
  -- Resume Preferences
  resume_style VARCHAR(50) DEFAULT 'modern', -- Template preference
  contact_privacy VARCHAR(50) DEFAULT 'standard', -- How much contact info to show
  skills_emphasis VARCHAR(50) DEFAULT 'balanced', -- How to emphasize skills
  
  -- Notification Settings
  job_match_notifications BOOLEAN DEFAULT true,
  weekly_insights BOOLEAN DEFAULT true,
  optimization_reminders BOOLEAN DEFAULT true,
  
  -- AI Settings
  ai_creativity_level VARCHAR(50) DEFAULT 'balanced', -- 'conservative', 'balanced', 'creative'
  include_soft_skills BOOLEAN DEFAULT true,
  emphasize_visa_skills BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint
CREATE UNIQUE INDEX idx_user_preferences_user ON user_preferences(user_id);
```

#### **6. usage_analytics**
```sql
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Action Information
  action_type VARCHAR(100) NOT NULL, -- 'resume_upload', 'job_analysis', 'optimization_request'
  resource_type VARCHAR(50), -- 'resume', 'job', 'match'
  resource_id UUID, -- ID of the resource acted upon
  
  -- Context
  session_id UUID, -- Track user sessions
  feature_used VARCHAR(100), -- Specific feature within action
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Performance Metrics
  processing_time_ms INTEGER,
  ai_tokens_used INTEGER,
  file_size_bytes INTEGER,
  
  -- User Context
  user_plan VARCHAR(50), -- 'free', 'professional', 'executive'
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_analytics_action ON usage_analytics(action_type, created_at DESC);
CREATE INDEX idx_analytics_date ON usage_analytics(created_at DESC);
```

### **Extended User Profile Table**

#### **Update existing user_profile table**
```sql
-- Add resume-specific fields to existing user profile
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS resume_count INTEGER DEFAULT 0;
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS job_matches_count INTEGER DEFAULT 0;
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS optimization_count INTEGER DEFAULT 0;
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'free';
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 3; -- Free tier credits
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS last_resume_analysis TIMESTAMPTZ;
```

## 🔍 Key Design Decisions

### **1. JSONB Usage**
- **Structured Data**: Resume sections, skills, requirements stored as JSONB for flexibility
- **AI Analysis**: Results stored as JSONB to accommodate evolving AI outputs
- **Performance**: Indexed JSONB fields for fast querying

### **2. File Storage Strategy**
- **Supabase Storage**: Original files stored securely
- **Text Extraction**: Parsed text stored in database for fast access
- **Version Control**: Multiple resume versions per user

### **3. Scoring System**
- **0-100 Scale**: Consistent scoring across all features
- **Component Scores**: Separate scores for skills, experience, keywords
- **Improvement Tracking**: Historical score progression

### **4. Privacy & Security**
- **User Isolation**: All data tied to user_id with CASCADE delete
- **Encryption**: Sensitive data encrypted at rest
- **GDPR Compliance**: Easy data export and deletion

## 🚀 Performance Optimizations

### **Indexes Strategy**
```sql
-- Composite indexes for common queries
CREATE INDEX idx_resumes_user_active ON resumes(user_id, is_active, created_at DESC);
CREATE INDEX idx_matches_user_score ON resume_job_matches(user_id, overall_score DESC);
CREATE INDEX idx_analytics_user_date ON usage_analytics(user_id, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_job_descriptions_search ON job_descriptions 
  USING gin(to_tsvector('english', title || ' ' || description));
```

### **Query Patterns**
- **Dashboard Queries**: Pre-aggregated data for fast loading
- **Search Optimization**: Full-text search with ranking
- **Pagination**: Cursor-based pagination for large datasets

## 📊 Data Relationships

```
users (existing)
├── resumes (1:many)
│   ├── resume_optimizations (1:many)
│   └── resume_job_matches (many:many via job_descriptions)
├── job_descriptions (1:many)
├── user_preferences (1:1)
└── usage_analytics (1:many)
```

## 🔐 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for user data isolation
CREATE POLICY "Users can only access their own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own job descriptions" ON job_descriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own matches" ON resume_job_matches
  FOR ALL USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

This schema provides a robust foundation for the resume tool while maintaining excellent performance and security standards.