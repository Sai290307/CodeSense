import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bug, Shield, Zap, Lightbulb, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AnalysisIssue {
  type: "bug" | "security" | "performance" | "best-practice";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
}

export interface AnalysisResult {
  issues: AnalysisIssue[];
  optimizedCode: string;
  summary: string;
}

// Backend response structure
export interface BackendAnalysisIssue {
  title: string;
  description: string;
  severity: string; // "low", "medium", "high", "critical"
  issue_type: string; // "bug", "performance", "security", "style", "logic"
  line_number?: number;
  suggestion?: string;
}

export interface BackendAnalysisResponse {
  summary: string;
  issues: BackendAnalysisIssue[];
  optimized_code: string | null;
  issues_count: number;
}

export interface BackendAnalysisResult {
  id: string;
  analysis: BackendAnalysisResponse;
  code_snippet: string;
  language: string;
  file_name: string | null;
  created_at: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  originalCode: string;
}

const severityColors = {
  critical: "bg-destructive text-destructive-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
};

const typeIcons = {
  bug: Bug,
  security: Shield,
  performance: Zap,
  "best-practice": Lightbulb,
};

const typeLabels = {
  bug: "Bug",
  security: "Security",
  performance: "Performance",
  "best-practice": "Best Practice",
};

const AnalysisResults = ({ results, originalCode }: AnalysisResultsProps) => {
  const [copied, setCopied] = useState(false);

  if (!results) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <Lightbulb className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No Analysis Yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Paste your code and click Analyze Code to get AI-powered insights
            and optimization suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(results.optimizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const issuesByType = {
    bug: results.issues.filter((i) => i.type === "bug"),
    security: results.issues.filter((i) => i.type === "security"),
    performance: results.issues.filter((i) => i.type === "performance"),
    "best-practice": results.issues.filter((i) => i.type === "best-practice"),
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{results.summary}</p>
          
          {/* Issue counts */}
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(issuesByType).map(([type, issues]) => {
              const Icon = typeIcons[type as keyof typeof typeIcons];
              return (
                <div key={type} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {issues.length} {typeLabels[type as keyof typeof typeLabels]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {results.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issues Found</CardTitle>
            <CardDescription>
              {results.issues.length} issue{results.issues.length !== 1 ? "s" : ""} detected in your code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.issues.map((issue, index) => {
              const Icon = typeIcons[issue.type];
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className={cn(severityColors[issue.severity])}>
                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Icon className="h-3 w-3" />
                      {typeLabels[issue.type]}
                    </Badge>
                    {issue.line && (
                      <span className="text-xs text-muted-foreground">
                        Line {issue.line}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold mb-1">{issue.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {issue.description}
                  </p>
                  {issue.suggestion && (
                    <div className="rounded bg-secondary/50 p-3 text-sm">
                      <span className="font-medium text-primary">💡 Suggestion: </span>
                      {issue.suggestion}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Code Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Code Comparison</CardTitle>
              <CardDescription>
                Original vs. AI-optimized version
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Optimized
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="optimized" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="original">Original Code</TabsTrigger>
              <TabsTrigger value="optimized">Optimized Code</TabsTrigger>
            </TabsList>
            <TabsContent value="original" className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-code p-4 text-sm text-code-foreground">
                <code>{originalCode}</code>
              </pre>
            </TabsContent>
            <TabsContent value="optimized" className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-code p-4 text-sm text-code-foreground">
                <code>{results.optimizedCode}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
