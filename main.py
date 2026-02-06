import os
import json
from typing import List, Optional, Literal
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from typing import List

# Import the Supabase Service we created earlier
from models import DBAnalysisRecord
from services import SupabaseService 

# 1. Load Environment Variables
load_dotenv()

# Verify API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in .env file.")
if not SUPABASE_URL:
    print("WARNING: SUPABASE_URL not found in .env file.")

# 2. Initialize FastAPI
app = FastAPI(title="AI Code Review Agent")

# 3. CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# --- Pydantic Models ---
class CodeAnalysisRequest(BaseModel):
    code: str
    language: str
    file_name: Optional[str] = None # Added file_name to support saving it

class Issue(BaseModel):
    issue_type: Literal["bug", "security", "performance", "style", "logic", "best-practice"]
    severity: Literal["critical", "high", "medium", "low", "info"]
    title: str
    description: str
    line_number: Optional[int] = None
    suggestion: Optional[str] = None

class AnalysisData(BaseModel):
    issues: List[Issue]
    optimized_code: str
    summary: str
    issues_count: int

class APIResponse(BaseModel):
    analysis: AnalysisData
    code_snippet: Optional[str] = None

# --- API Endpoint ---

@app.post("/api/v1/analyze", response_model=APIResponse)
async def analyze_code(
    request: CodeAnalysisRequest,
    # Capture User ID from headers (matches frontend: "X-User-ID": "demo-user")
    x_user_id: str = Header("demo-user", alias="X-User-ID") 
):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    # System Prompt
    system_prompt = """
    You are an expert code reviewer and senior software engineer.
    Analyze the provided code for bugs, security vulnerabilities, performance issues, and best practices.
    
    You MUST output your response in valid JSON format exactly matching this structure:
    {
        "issues": [
            {
                "issue_type": "bug" | "security" | "performance" | "style",
                "severity": "critical" | "high" | "medium" | "low",
                "title": "Short title of the issue",
                "description": "Detailed explanation",
                "line_number": <integer or null>,
                "suggestion": "How to fix it"
            }
        ],
        "optimized_code": "<The FULL fixed code. Do not truncate.>",
        "summary": "A brief 2-sentence summary of the code quality.",
        "issues_count": <integer>
    }
    
    Do not include any markdown formatting (like ```json). Return ONLY the raw JSON string.
    """

    user_prompt = f"Language: {request.language}\n\nCode:\n{request.code}"

    try:
        # 1. Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            response_format={"type": "json_object"}
        )

        # 2. Parse Response
        response_content = chat_completion.choices[0].message.content
        data = json.loads(response_content)

        # 3. Save to Supabase
        try:
            supabase_svc = SupabaseService()
            # We pass the header user_id, the request object, and the raw Groq data
            supabase_svc.save_analysis(x_user_id, request, data)
            print(f"✅ Analysis saved for user: {x_user_id}")
        except Exception as db_error:
            # We log the error but don't stop the response
            # because the user still wants to see their analysis even if saving fails.
            print(f"⚠️ Failed to save to Supabase: {db_error}")

        # 4. Return Response to Frontend
        return APIResponse(
            analysis=AnalysisData(
                issues=data.get("issues", []),
                optimized_code=data.get("optimized_code", request.code),
                summary=data.get("summary", "Analysis complete."),
                issues_count=len(data.get("issues", []))
            ),
            code_snippet=request.code
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON format.")
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"status": "Backend is running", "service": "Code Analysis Agent"}

@app.get("/api/v1/history", response_model=List[DBAnalysisRecord])
async def get_history(
    x_user_id: str = Header("demo-user", alias="X-User-ID")
):
    try:
        supabase_svc = SupabaseService()
        return supabase_svc.get_history(x_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))