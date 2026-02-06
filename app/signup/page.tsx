"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  Github,
  Chrome,
  Check,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";

const features = [
  "Unlimited document uploads",
  "Video analysis & transcription",
  "AI-generated quizzes & flashcards",
  "Context-aware conversations",
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and privacy policy.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a verification link to complete your signup.",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black">
        {/* ================= GRID BACKGROUND ================= */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-[linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.15)_1px,transparent_1px)]",
            "bg-size-[40px_40px]",
            "dark:bg-[linear-gradient(to_right,rgba(71,85,105,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.35)_1px,transparent_1px)]",
            "after:absolute after:inset-0 after:bg-linear-to-b after:from-white/90 after:via-white/60 after:to-white",
            "dark:after:from-black/85 dark:after:via-black/60 dark:after:to-black",
            "after:content-['']"
          )}
        />

        <div className="relative z-10 flex min-h-screen">
          {/* ================= LEFT PANEL ================= */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-lg"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                  Join CodeSense AI
                </h2>
              </div>

              <p className="mb-8 text-neutral-600 dark:text-neutral-400">
                Unlock the power of AI to analyze, rewrite, and optimize your code instantly.
              </p>

              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                      <Check className="h-4 w-4 text-blue-500" />
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ================= FORM ================= */}
          <div className="flex flex-1 items-center justify-center px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl
              bg-white/40 dark:bg-neutral-900/60
              backdrop-blur-xl
              border border-neutral-200/50 dark:border-neutral-800/60
              shadow-2xl p-10"
            >
              {/* Logo */}
              <Link href="/" className="mb-8 flex items-center justify-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  CodeSense AI
                </span>
              </Link>

              <h1 className="mb-2 text-center text-3xl font-bold text-neutral-900 dark:text-white">
                Create an account
              </h1>
              <p className="mb-8 text-center text-neutral-600 dark:text-neutral-400">
                Get started for free
              </p>

              {/* Social */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 gap-2" onClick={handleGoogleSignup}>
                  <Chrome className="h-5 w-5" /> Google
                </Button>
                <Button variant="outline" className="h-12 gap-2" onClick={handleGithubSignup}>
                  <Github className="h-5 w-5" /> GitHub
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/40 dark:bg-neutral-900/60 px-2 text-neutral-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-900 dark:text-neutral-200">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 pl-10 bg-white/20 dark:bg-black/30 border-neutral-300 dark:border-neutral-700 placeholder:text-neutral-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-900 dark:text-neutral-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10 bg-white/20 dark:bg-black/30 border-neutral-300 dark:border-neutral-700 placeholder:text-neutral-500"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-neutral-900 dark:text-neutral-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10 bg-white/20 dark:bg-black/30 border-neutral-300 dark:border-neutral-700 placeholder:text-neutral-500"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-neutral-900 dark:text-neutral-200">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 pl-10 bg-white/20 dark:bg-black/30 border-neutral-300 dark:border-neutral-700 placeholder:text-neutral-500"
                      required
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-neutral-600 dark:text-neutral-400 leading-none cursor-pointer"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-linear-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-8 text-center text-neutral-600 dark:text-neutral-400">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-500 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Signup;