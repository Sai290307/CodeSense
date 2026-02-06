from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class CodeAnalysisRequest(BaseModel):
    """
    Validation model for incoming analysis requests from the frontend.
    """
    code: str
    language: str
    file_name: Optional[str] = None



class Issue(BaseModel):
    """
    Represents a single issue found in the code.
    Matches Supabase table 'analysis_results' columns.
    """
    issue_type: Literal["bug", "security", "performance", "style", "logic", "best-practice"]
    severity: Literal["critical", "high", "medium", "low", "info"]
    title: str
    description: str
    line_number: Optional[int] = None
    suggestion: Optional[str] = None

class AnalysisData(BaseModel):
    """
    The structured output from the AI, nested inside the response.
    """
    issues: List[Issue]
    optimized_code: Optional[str] = None  
    summary: Optional[str] = None         
    issues_count: int                     



class APIResponse(BaseModel):
    """
    The strict JSON structure returned to the frontend.
    This structure allows your React 'mapIssueType' and 'mapSeverity' functions to work.
    """
    analysis: AnalysisData
    code_snippet: Optional[str] = None 

class DBAnalysisRecord(BaseModel):
    """
    Matches the 'analyses' table columns from your schema image.
    """
    id: str                  # uuid
    user_id: str             # text
    code_snippet: str        # text
    language: str            # text
    file_name: Optional[str] = None  # text (nullable)
    summary: Optional[str] = None    # text (nullable)
    optimized_code: Optional[str] = None # text (nullable)
    issues_count: Optional[int] = 0  # int4
    created_at: str