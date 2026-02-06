"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, FileCode, Trash2, Eye, X, Check, Copy } from "lucide-react";
import { useToast } from "@/app/hooks/use-toast";
import { supabase } from "@/app/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisRecord {
  id: string;
  language: string;
  file_name: string;
  issues_count: number;
  created_at: string;
  code_snippet: string;
  summary: string;       // Added field
  optimized_code: string; // Added field
}

const History = () => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/history`, {
        headers: {
          "X-User-ID": session?.user?.id || "",
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      setAnalyses(data || []);
    } catch (error: any) {
      console.error("Error fetching analyses:", error);
      toast({
        title: "Error",
        description: "Failed to load history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the sheet when clicking delete
    try {
      const { error } = await supabase.from("analyses").delete().eq("id", id);

      if (error) throw error;

      setAnalyses(analyses.filter((a) => a.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis record has been removed.",
      });
      if (selectedAnalysis?.id === id) setSelectedAnalysis(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete the analysis.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

  };

  const filteredAnalyses = analyses.filter(
    (a) =>
      a.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.file_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
          <p className="text-muted-foreground">
            View and manage your past code analyses
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Past Analyses</CardTitle>
                <CardDescription>
                  {analyses.length} total analyses found
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by language or file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredAnalyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileCode className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No analyses yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Start analyzing your code in the Dashboard to see your history here.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-border/50">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>File Info</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnalyses.map((analysis) => (
                      <TableRow 
                        key={analysis.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatDate(analysis.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{analysis.file_name || "Untitled Snippet"}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-37.5">
                                {analysis.id.slice(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize bg-blue-500/10 text-blue-500 border-blue-500/20">
                            {analysis.language}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={analysis.issues_count > 0 ? "destructive" : "default"}
                            className={analysis.issues_count === 0 ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" : ""}
                          >
                            {analysis.issues_count} {analysis.issues_count === 1 ? 'Issue' : 'Issues'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAnalysis(analysis);
                                }}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={(e) => handleDelete(analysis.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- DETAILS SHEET --- */}
        <Sheet open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(null)}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                {selectedAnalysis && (
                    <>
                        <SheetHeader className="mb-6">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                    {selectedAnalysis.language}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(selectedAnalysis.created_at)}
                                </span>
                            </div>
                            <SheetTitle className="text-2xl">
                                {selectedAnalysis.file_name || "Code Analysis Details"}
                            </SheetTitle>
                            <SheetDescription>
                                Review the AI insights and code optimization for this snapshot.
                            </SheetDescription>
                        </SheetHeader>

                        <Tabs defaultValue="summary" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="summary">Summary</TabsTrigger>
                                <TabsTrigger value="original">Original Code</TabsTrigger>
                                <TabsTrigger value="optimized">Optimized</TabsTrigger>
                            </TabsList>

                            {/* Summary Tab */}
                            <TabsContent value="summary" className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <FileCode className="h-4 w-4 text-blue-500" /> 
                                            AI Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedAnalysis.summary || "No summary provided for this analysis."}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                            Issues Detected ({selectedAnalysis.issues_count})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedAnalysis.issues_count > 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                This code contains potential bugs or security vulnerabilities. 
                                                Check the Optimized tab for fixes.
                                            </p>
                                        ) : (
                                            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                                                <Check className="h-4 w-4" />
                                                No critical issues found. Good job!
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Original Code Tab */}
                            <TabsContent value="original" className="relative">
                                <div className="absolute right-2 top-2 z-10">
                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => copyToClipboard(selectedAnalysis.code_snippet)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <ScrollArea className="h-[60vh] w-full rounded-md border bg-muted/50 p-4">
                                    <pre className="font-mono text-sm text-foreground">
                                        {selectedAnalysis.code_snippet}
                                    </pre>
                                </ScrollArea>
                            </TabsContent>

                            {/* Optimized Code Tab */}
                            <TabsContent value="optimized" className="relative">
                                <div className="absolute right-2 top-2 z-10">
                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => copyToClipboard(selectedAnalysis.optimized_code || "")}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <ScrollArea className="h-[60vh] w-full rounded-md border bg-[#0B1120] p-4">
                                    <pre className="font-mono text-sm text-green-400">
                                        {selectedAnalysis.optimized_code || "// No optimized code available."}
                                    </pre>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
};

export default History;