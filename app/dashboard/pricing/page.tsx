"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Zap, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Pricing Data
const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for hobbyists and individual developers.",
    features: [
      "500 lines of code analysis/mo",
      "Basic vulnerability scanning",
      "Community support",
      "1 user",
    ],
    cta: "Current Plan",
    icon: Zap,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professional developers and small teams.",
    features: [
      "Unlimited lines of code",
      "Advanced security & performance",
      "CI/CD integration",
      "Priority email support",
      "Up to 5 users",
    ],
    cta: "Upgrade to Pro",
    icon: Rocket,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations requiring maximum security.",
    features: [
      "On-premise deployment",
      "Custom LLM fine-tuning",
      "SSO & Audit logs",
      "Dedicated account manager",
      "Unlimited users",
    ],
    cta: "Contact Sales",
    icon: Shield,
    popular: false,
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const PricingPage = () => {
  const [currentPlan, setCurrentPlan] = useState("starter"); // Mock state for user's plan
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = (planId: string) => {
    setLoadingPlan(planId);
    // Simulate API call
    setTimeout(() => {
      setLoadingPlan(null);
      // Logic to redirect to Stripe/Payment gateway would go here
      console.log(`Upgrading to ${planId}`);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
          <p className="text-muted-foreground">
            Manage your plan and usage limits.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-3 items-start"
        >
          {pricingPlans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const Icon = plan.icon;

            return (
              <motion.div key={plan.id} variants={itemVariants} className="h-full">
                <Card
                  className={`
                    relative flex flex-col h-full transition-all duration-300
                    ${
                      plan.popular
                        ? "border-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20 bg-blue-50/50 dark:bg-[#040a28]" // Adaptive Background
                        : "border-border/50 bg-card hover:border-blue-500/30 hover:shadow-md"
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${plan.popular ? "bg-blue-600 text-white" : "bg-secondary text-primary"}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <CardDescription className="pt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="w-full border-t border-border/50 my-4" />
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <Check className="h-5 w-5 shrink-0 text-blue-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => !isCurrent && handleUpgrade(plan.id)}
                      disabled={isCurrent || loadingPlan === plan.id}
                      className={`
                        w-full font-semibold transition-all
                        ${
                          isCurrent
                            ? "bg-secondary text-secondary-foreground hover:bg-secondary cursor-default opacity-80"
                            : plan.popular
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }
                      `}
                      size="lg"
                    >
                      {loadingPlan === plan.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : isCurrent ? (
                        "Current Plan"
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Usage Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border/50 bg-card p-6"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-lg">Need Enterprise Customization?</h3>
                    <p className="text-muted-foreground text-sm">
                        We offer dedicated instances, SLA guarantees, and custom AI model training for large teams.
                    </p>
                </div>
                <Button variant="outline" className="shrink-0">
                    Talk to Sales
                </Button>
            </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;