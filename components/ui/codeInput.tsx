"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, Code2, Terminal, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  onAnalyze: (code: string, language: string) => void;
  isLoading: boolean;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
];

const CodeInput = ({ onAnalyze, isLoading }: CodeInputProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (code.trim()) {
      onAnalyze(code, language);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        
        // Auto-detect language from file extension
        const ext = file.name.split(".").pop()?.toLowerCase();
        const langMap: Record<string, string> = {
          js: "javascript", jsx: "javascript",
          ts: "typescript", tsx: "typescript",
          py: "python",
          java: "java",
          go: "go",
          rs: "rust",
          cpp: "cpp", cc: "cpp",
          cs: "csharp",
          php: "php",
          rb: "ruby",
        };
        if (ext && langMap[ext]) {
          setLanguage(langMap[ext]);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="border-border/50 dark:bg-[#0B1120]/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Terminal className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">Input Code</CardTitle>
            <CardDescription>
              Paste snippet or upload a file for analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg dark:bg-[#020617]/50 p-2 border dark:border-white/5">
          <div className="flex items-center gap-2 flex-1">
            <Code2 className="h-4 w-4 text-muted-foreground ml-2 hidden sm:block border-black" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-45 h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 hover:bg-white/5 transition-colors">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#0B1120] border-white/10 text-black dark:text-white">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="focus:bg-blue-600/20 focus:text-blue-400 cursor-pointer">
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.go,.rs,.cpp,.cc,.cs,.php,.rb"
              onChange={handleFileUpload}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="h-9 text-muted-foreground hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <label htmlFor="file-upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload File</span>
              </label>
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="relative group rounded-xl border border-white/10 bg-[#020617] overflow-hidden focus-within:border-blue-500/50 transition-colors">
          <div className="absolute top-0 left-0 bottom-0 w-10 bg-white/5 border-r border-white/5 flex flex-col items-center pt-3 gap-1 select-none pointer-events-none">
             {/* Fake line numbers for visual effect */}
             {[1, 2, 3, 4, 5, 6].map(n => (
               <span key={n} className="text-[10px] text-muted-foreground/30 font-mono">{n}</span>
             ))}
          </div>
          <Textarea
            ref={textareaRef}
            placeholder={`// Paste your ${languages.find(l => l.value === language)?.label || "code"} here...`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={cn(
              "min-h-100 w-full resize-none border-0 bg-transparent py-3 pl-14 pr-4",
              "font-mono text-sm leading-6 text-slate-300 placeholder:text-slate-600",
              "focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            spellCheck={false}
          />
          {/* Active Line Highlight (visual trick) */}
          <div className="absolute top-3 left-0 w-1 h-6 bg-blue-500 rounded-r-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!code.trim() || isLoading}
            className={cn(
              "min-w-35 h-11 text-base font-medium shadow-lg transition-all",
              "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileCode2 className="mr-2 h-4 w-4" />
                Analyze Code
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeInput;