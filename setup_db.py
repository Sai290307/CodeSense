import psycopg2
from psycopg2 import sql

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
# Replace this with your actual connection string from Supabase Settings -> Database
DB_CONNECTION_STRING = "postgresql://postgres:Harshithsai29@db.nrqynesnsqaeekwbjsgt.supabase.co:5432/postgres"

# ---------------------------------------------------------
# SQL SCHEMA DEFINITION
# ---------------------------------------------------------
create_tables_sql = """
-- 1. Create 'analyses' table
CREATE TABLE IF NOT EXISTS analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    code_snippet TEXT NOT NULL,
    language TEXT NOT NULL,
    file_name TEXT,
    summary TEXT,
    optimized_code TEXT,
    issues_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'analysis_results' table
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE NOT NULL,
    issue_type TEXT NOT NULL, -- 'bug', 'security', 'performance', etc.
    severity TEXT NOT NULL,   -- 'critical', 'high', 'medium', etc.
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    line_number INTEGER,
    suggestion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_results_analysis_id ON analysis_results(analysis_id);
"""

# ---------------------------------------------------------
# EXECUTION
# ---------------------------------------------------------
def setup_database():
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(DB_CONNECTION_STRING)
        conn.autocommit = True # Enable autocommit for DDL statements
        cursor = conn.cursor()

        print("Creating tables...")
        cursor.execute(create_tables_sql)
        
        print("✅ Tables 'analyses' and 'analysis_results' created successfully!")
        
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Tip: Check your password and ensure 'Database Password' is used, not your Supabase Account Password.")

if __name__ == "__main__":
    setup_database()