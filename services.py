import os
from supabase import create_client, Client
from models import CodeAnalysisRequest
from typing import Dict, Any, List

class SupabaseService:
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
            
        # Standard initialization (The fresh install fixes the proxy error)
        self.client: Client = create_client(url, key)

    def save_analysis(self, user_id: str, request: CodeAnalysisRequest, analysis_data: Dict[str, Any]) -> str:
        # 1. Prepare data for 'analyses' table
        analysis_payload = {
            "user_id": user_id,
            "code_snippet": request.code,
            "language": request.language,
            "file_name": getattr(request, "file_name", None),
            "summary": analysis_data.get("summary"),
            "optimized_code": analysis_data.get("optimized_code"),
            "issues_count": analysis_data.get("issues_count", 0)
        }

        # 2. Insert into 'analyses'
        try:
            response = self.client.table("analyses").insert(analysis_payload).execute()
            
            # Robust ID extraction
            if response.data and len(response.data) > 0:
                analysis_id = response.data[0]["id"]
            else:
                 # Fallback if your specific supabase version returns data differently
                 print("Warning: No data returned from insert. Using fallback ID or checking if row exists.")
                 # If using newer libraries, response.data is the way. 
                 # If this fails, the table might not exist or RLS policies are blocking inserts.
                 return "error-saving-db"

        except Exception as e:
            print(f"Supabase Error (Analyses): {str(e)}")
            # We raise here so the main.py knows it failed
            raise e

        # 3. Prepare data for 'analysis_results' table
        issues = analysis_data.get("issues", [])
        if issues:
            results_payload = []
            for issue in issues:
                results_payload.append({
                    "analysis_id": analysis_id,
                    "title": issue.get("title"),
                    "description": issue.get("description"),
                    "severity": issue.get("severity"),
                    "issue_type": issue.get("issue_type"),
                    "line_number": issue.get("line_number"),
                    "suggestion": issue.get("suggestion")
                })
            
            try:
                self.client.table("analysis_results").insert(results_payload).execute()
            except Exception as e:
                print(f"Supabase Error (Results): {str(e)}")

        return analysis_id
    def get_history(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Fetches analysis history based on the schema image provided.
        """
        try:
            # Matches the 'analyses' table structure in your image
            response = self.client.table("analyses")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .execute()
            
            return response.data if response.data else []
            
        except Exception as e:
            print(f"Error fetching history: {str(e)}")
            return []