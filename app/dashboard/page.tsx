"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import router for redirection
import DashboardLayout from "@/components/layout/DashboardLayout";
import AnalysisResults, { AnalysisResult } from "@/components/ui/AnalysisResults";
import { useToast } from "../hooks/use-toast";
import CodeInput from "@/components/ui/codeInput";
import { supabase } from "../integrations/supabase/client"; // Import Supabase client
import { Loader2 } from "lucide-react"; // Import loader icon

// Helper functions to map backend data to frontend format
const mapIssueType = (issueType: string): "bug" | "security" | "performance" | "best-practice" => {
  switch (issueType) {
    case "bug":
      return "bug";
    case "security":
      return "security";
    case "performance":
      return "performance";
    case "style":
    case "logic":
    default:
      return "best-practice";
  }
};

const mapSeverity = (severity: string): "critical" | "warning" | "info" => {
  switch (severity) {
    case "critical":
      return "critical";
    case "high":
      return "critical";
    case "medium":
      return "warning";
    case "low":
    default:
      return "info";
  }
};

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // New state to track if we are checking the user's login status
  const [isAuthChecking, setIsAuthChecking] = useState(true); 
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [originalCode, setOriginalCode] = useState("");
  const { toast } = useToast();

  // --- AUTH CHECK EFFECT ---
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No user found, redirect to SIGNIN
          router.push("/signin"); // FIX: Changed from /login to /signin
        } else {
          // User is logged in, stop loading
          setIsAuthChecking(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.push("/signin"); // FIX: Changed from /login to /signin
      }
    };

    checkUser();
  }, [router]);

  // --- CODE ANALYSIS HANDLER ---
  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setOriginalCode(code);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call the FastAPI backend directly
      const response = await fetch("http://localhost:8000/api/v1/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": session?.user?.id || "anonymous", // Send actual User ID
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // Transform backend response to frontend format
      const transformedResult = {
        issues: data.analysis.issues.map((issue: any) => ({
          type: mapIssueType(issue.issue_type),
          severity: mapSeverity(issue.severity),
          title: issue.title,
          description: issue.description,
          line: issue.line_number,
          suggestion: issue.suggestion,
        })),
        optimizedCode: data.analysis.optimized_code || data.code_snippet,
        summary: data.analysis.summary,
      };

      setResults(transformedResult);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.analysis.issues_count || 0} issues in your code.`,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);

      if (error.message?.includes("429") || error.message?.includes("rate limit")) {
        toast({
          title: "Rate Limited",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        });
      } else if (error.message?.includes("402") || error.message?.includes("payment")) {
        toast({
          title: "Usage Limit Reached",
          description: "Please add credits to continue using the AI analysis.",
          variant: "destructive",
        });
      } else if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the analysis server. Please check if the backend is running.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER LOADING STATE ---
  // If we are still checking auth, show a full screen loader instead of the dashboard
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020a25]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD RENDER ---
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Analysis</h1>
          <p className="text-muted-foreground">
            Get AI-powered insights on bugs, security, and performance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 dark:bg-[#020a25]">
          <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          <AnalysisResults results={results} originalCode={originalCode} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;