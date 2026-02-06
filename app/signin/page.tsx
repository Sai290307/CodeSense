"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen flex bg-white dark:bg-black overflow-hidden">
        {/* ================= Background Grid ================= */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[40px_40px]",
            "bg-[linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)]",
            "dark:bg-[linear-gradient(to_right,rgba(71,85,105,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.4)_1px,transparent_1px)]",
            "after:absolute after:inset-0 after:bg-linear-to-b after:from-white/80 after:via-white/40 after:to-white",
            "dark:after:from-black/80 dark:after:via-black/40 dark:after:to-black",
            "after:content-['']"
          )}
        />

        {/* ================= Left Side - Login Form ================= */}
        <div className="flex-1 flex items-center justify-center p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-xl"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
              <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-cyan-400">
                CodeSense AI
              </span>
            </Link>

            {/* Header */}
            <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white text-center">
              Welcome Back
            </h1>
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
              Sign in to continue to your dashboard
            </p>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="h-12 flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
              >
                <Chrome className="w-5 h-5" /> Google
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex items-center justify-center gap-2"
                onClick={handleGithubLogin}
              >
                <Github className="w-5 h-5" /> GitHub
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/40 dark:bg-black/40 px-2 text-neutral-500 dark:text-neutral-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900 dark:text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-neutral-900 dark:text-white">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-linear-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <p className="mt-8 text-center text-neutral-600 dark:text-neutral-400">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>

        {/* ================= Right Side Visual ================= */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg text-center"
          >
            <div className="w-40 h-40 mx-auto rounded-3xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg glow mb-8">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
              AI-Powered Code Analysis
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Upload your code, analyze bugs, and let CodeSense AI help you write better software faster than ever before.
            </p>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;