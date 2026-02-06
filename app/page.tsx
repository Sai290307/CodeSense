"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Play, Code, Shield, Zap, Menu, X, Search, Bug, Sparkles, FileCode, CheckCircle, Cpu, Upload, Star, Github, Twitter, Linkedin, Check } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { ThemeProvider } from 'next-themes'
import { motion } from "framer-motion";

// --- Components ---

// Typing Effect Component
const TypingText = ({ text, speed = 50, delay = 0, className = "", onComplete }: { text: string; speed?: number; delay?: number; className?: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true);
      setCurrentIndex(0);
      setDisplayedText("");
    };

    if (delay > 0) {
      const delayTimer = setTimeout(startTyping, delay);
      return () => clearTimeout(delayTimer);
    } else {
      startTyping();
    }
  }, [delay]);

  useEffect(() => {
    if (isTyping && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (isTyping && currentIndex >= text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, isTyping, onComplete]);

  return <span className={className}>{displayedText}</span>;
};

// --- Data ---

const features = [
  {
    icon: Search,
    title: "Automated Code Review",
    description: "Get comprehensive code analysis with AI-powered insights that catch issues human reviewers might miss.",
  },
  {
    icon: Bug,
    title: "Bug Detection",
    description: "Identify potential bugs, logic errors, and edge cases before they reach production.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Discover performance bottlenecks and get actionable suggestions to speed up your code.",
  },
  {
    icon: Shield,
    title: "Security Vulnerability Checks",
    description: "Scan for common security vulnerabilities like SQL injection, XSS, and insecure dependencies.",
  },
  {
    icon: Sparkles,
    title: "AI Code Rewriting",
    description: "Get AI-generated optimized code that follows best practices and modern patterns.",
  },
  {
    icon: FileCode,
    title: "Multi-Language Support",
    description: "Analyze code in JavaScript, TypeScript, Python, Java, Go, Rust, and more.",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Code",
    description: "Paste your code or upload files directly. We support 10+ programming languages.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our AI engine analyzes your code for bugs, security issues, and optimization opportunities.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Get Results & Improve",
    description: "Review detailed findings with explanations and apply AI-suggested fixes instantly.",
  },
];

const technologies = [
  { name: "FastAPI", icon: "⚡" },
  { name: "Gemini", icon: "🤖" },
  { name: "Groq", icon: "🔥" },
  { name: "Hugging Face", icon: "🤗" },
  { name: "JavaScript", icon: "📜" },
  { name: "TypeScript", icon: "💙" },
  { name: "Python", icon: "🐍" },
  { name: "Tailwind CSS", icon: "🎨" },
];

const testimonials = [
  {
    quote: "CodeSense AI caught a critical SQL injection vulnerability that our team missed during manual review. It's now an essential part of our CI/CD pipeline.",
    author: "Sarah Chen",
    role: "Senior Engineer at TechCorp",
    initials: "SC",
  },
  {
    quote: "The AI-generated code suggestions are surprisingly accurate. It's like having a senior developer reviewing every PR around the clock.",
    author: "Marcus Johnson",
    role: "CTO at StartupXYZ",
    initials: "MJ",
  },
  {
    quote: "We reduced our code review time by 60% and caught more issues than before. The ROI was immediate and substantial.",
    author: "Emily Rodriguez",
    role: "Engineering Manager at DevOps Inc",
    initials: "ER",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for hobbyists and individual developers.",
    features: [
      "500 lines of code analysis per month",
      "Basic vulnerability scanning",
      "Community support",
      "1 user"
    ],
    cta: "Start for Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professional developers and small teams.",
    features: [
      "Unlimited lines of code",
      "Advanced security & performance check",
      "CI/CD integration",
      "Priority email support",
      "Up to 5 users"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations requiring maximum security.",
    features: [
      "On-premise deployment options",
      "Custom LLM fine-tuning",
      "SSO & Audit logs",
      "Dedicated account manager",
      "Unlimited users"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

// --- Animations ---

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// --- Main Page Component ---

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [startSecondTyping, setStartSecondTyping] = useState(false);

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Code className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-foreground">CodeSense AI</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-8 md:flex">
                <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </a>
                <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Docs
                </a>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden items-center gap-4 md:flex">
                <Button asChild variant="ghost">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="border-t border-border py-4 md:hidden bg-background">
                <div className="flex flex-col gap-4">
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                  <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    How it Works
                  </a>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                  <div className="flex flex-col gap-2 pt-4 border-t border-border">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* --- Hero Section --- */}
        {/* Responsive Background: White/Blue gradient in Light Mode, Deep Blue/Black in Dark Mode */}
        <section className="relative overflow-hidden bg-linear-to-b from-white via-blue-50/50 to-white dark:from-[#020617] dark:via-[#0f172a] dark:to-[#020617] pt-32 pb-32">
          
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl opacity-50" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl opacity-50" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="mx-auto max-w-4xl text-center"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-950/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur-sm">
                <Zap className="h-4 w-4" />
                Powered by Advanced AI
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeInUp} className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl min-h-[1.2em]">
                 <TypingText text="AI-Powered Code Reviews." speed={50} delay={500} onComplete={() => setStartSecondTyping(true)} />
                {startSecondTyping && (
                  <span className="mt-2 block text-blue-600 dark:text-blue-400">
                    <TypingText text="Faster. Smarter. Secure." speed={50} delay={200} />
                  </span>
                )}
              </motion.h1>

              {/* Subheading */}
              <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-gray-400 sm:text-xl min-h-[3em]">
                <p>
                  <TypingText text="Analyze your source code for bugs, performance issues, and security vulnerabilities." speed={30} delay={2000} />
                </p>
                <p className="mt-2">
                 {startSecondTyping && <TypingText text="Get AI-generated explanations and optimized code rewrites in seconds." speed={30} delay={4500} />}
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2 px-8 text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 px-8 text-base border-border bg-background/50 hover:bg-accent hover:text-accent-foreground">
                  <Link href="/dashboard">
                    <Play className="h-4 w-4" />
                    Try Demo
                  </Link>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <span>Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <span>10+ languages supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span>Analysis in seconds</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Code visualization mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto mt-16 max-w-5xl"
            >
              <div className="relative rounded-xl border border-border/40 bg-[#0B1120] p-6 shadow-2xl dark:shadow-black/50">
                {/* Window controls */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 text-xs text-gray-500">code-analysis.tsx</span>
                </div>
                
                {/* Code snippet (Always Dark Mode for Code) */}
                <pre className="overflow-x-auto text-sm leading-relaxed font-mono">
                  <code className="text-gray-300">
                    <span className="text-amber-500">{"// ⚠️ Security Issue Detected"}</span>{"\n"}
                    <span className="text-purple-400">{"function "}</span>
                    <span className="text-blue-400">{"validateUser"}</span>
                    <span className="text-gray-300">{"(input) {"}</span>{"\n"}
                    <span className="text-red-400/80">{"  // SQL Injection vulnerability"}</span>{"\n"}
                    <span className="text-gray-300">{"  const query = `SELECT * FROM users WHERE id = ${input}`;"}</span>{"\n"}
                    <span className="text-gray-300">{"}"}</span>{"\n\n"}
                    <span className="text-emerald-500">{"// ✓ AI-Optimized Solution"}</span>{"\n"}
                    <span className="text-purple-400">{"function "}</span>
                    <span className="text-blue-400">{"validateUserSecure"}</span>
                    <span className="text-gray-300">{"(input) {"}</span>{"\n"}
                    <span className="text-gray-300">{"  const query = 'SELECT * FROM users WHERE id = ?';"}</span>{"\n"}
                    <span className="text-gray-300">{"  return db.prepare(query).get(input);"}</span>{"\n"}
                    <span className="text-gray-300">{"}"}</span>
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background" id="features">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mx-auto max-w-3xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">
                  Everything you need to write better code
                </h2>
                <p className="text-lg text-muted-foreground">
                  CodeSense AI analyzes your code from multiple angles to help you ship 
                  high-quality, secure, and performant software faster.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {features.map((feature) => (
                  <motion.div key={feature.title} variants={fadeInUp}>
                    <Card className="group relative overflow-hidden border-border/50 bg-card dark:bg-[#040a28] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base text-muted-foreground">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-secondary/30 dark:bg-[#020617]" id="how-it-works">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mx-auto max-w-3xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get from code to insights in three simple steps
                </p>
              </motion.div>

              <div className="relative">
                {/* Connection line */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "66%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute left-1/2 top-24 hidden h-0.5 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent lg:block" 
                />

                <motion.div variants={staggerContainer} className="grid gap-8 lg:grid-cols-3">
                  {steps.map((step) => (
                    <motion.div
                      key={step.step}
                      variants={fadeInUp}
                      className="relative flex flex-col items-center text-center"
                    >
                      {/* Step number */}
                      <div className="relative mb-6">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                          <step.icon className="h-8 w-8" />
                        </div>
                        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-400 text-sm font-bold text-blue-900 border border-white dark:border-none">
                          {step.step}
                        </span>
                      </div>

                      <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground max-w-xs">{step.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section className="py-24 bg-background" id="pricing">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mx-auto max-w-3xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose the plan that's right for you and start improving your code today.
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid gap-8 lg:grid-cols-3 items-start">
                {pricingPlans.map((plan) => (
                  <motion.div key={plan.name} variants={fadeInUp}>
                    <Card className={`relative flex flex-col h-full border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                      ${plan.popular 
                        ? 'bg-blue-50/50 dark:bg-[#040a28] border-blue-200 dark:border-blue-500 shadow-lg scale-105 z-10' 
                        : 'bg-card hover:border-blue-300/50 dark:hover:border-blue-700'
                      }`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                          Most Popular
                        </div>
                      )}
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                        <CardDescription className="pt-2 text-muted-foreground">{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-3 mt-4">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <Check className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          asChild 
                          className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
                          size="lg"
                        >
                          <Link href="/signup">{plan.cta}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground"
            >
              Powered by cutting-edge technology
            </motion.p>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
              {technologies.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={fadeInUp}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mx-auto max-w-3xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                  Loved by developers worldwide
                </h2>
                <p className="text-lg text-muted-foreground">
                  See what engineering teams are saying about CodeSense AI
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid gap-8 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <motion.div key={testimonial.author} variants={fadeInUp}>
                    <Card className="border-border/50 h-full bg-card/50 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        {/* Stars */}
                        <div className="mb-4 flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                          ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="mb-6 text-muted-foreground italic">
                          "{testimonial.quote}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                              {testimonial.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">{testimonial.author}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-border bg-card py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-8 md:grid-cols-4"
            >
              {/* Brand */}
              <motion.div variants={fadeInUp} className="md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Code className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold text-foreground">CodeSense AI</span>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered code review and optimization platform for modern development teams.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>

              {/* Product */}
              <motion.div variants={fadeInUp}>
                <h4 className="mb-4 font-semibold text-foreground">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
                </ul>
              </motion.div>

              {/* Resources */}
              <motion.div variants={fadeInUp}>
                <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div variants={fadeInUp}>
                <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                </ul>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground"
            >
              <p>© {new Date().getFullYear()} CodeSense AI. All rights reserved.</p>
            </motion.div>
          </div>
        </footer>
      </ThemeProvider>
    </>
  );
};

export default Page;