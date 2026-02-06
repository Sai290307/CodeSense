"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
  User,
  CodeXml,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/app/hooks/use-toast";
import { supabase } from "@/app/integrations/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: BadgePercent, label: "Pricing", href: "/pricing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  // We can use the useTheme hook to toggle themes if we added a button
  // const { theme, setTheme } = useTheme(); 

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    router.push("/");
  };

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0].toUpperCase() || "U";

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r transition-all duration-300 ease-in-out md:flex",
            // Light: White bg, Slate border | Dark: Deep Blue bg, White/10 border
            "bg-white/95 border-slate-200 dark:bg-[#0B1120]/95 dark:border-white/10 backdrop-blur-xl",
            collapsed ? "w-20" : "w-72"
          )}
        >
          {/* Logo Section */}
          <div className="flex h-20 items-center px-6">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center dark:text-white">
                <CodeXml className="h-6 w-6" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap text-xl font-bold tracking-tight text-slate-900 dark:text-white"
                  >
                    CodeSense
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white"
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <div className="absolute left-16 ml-2 hidden rounded-md bg-slate-900 text-white px-2 py-1 text-xs shadow-md group-hover:block z-50 dark:bg-slate-800">
                        {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-slate-200 dark:border-white/10 p-4">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-center gap-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </aside>

        {/* ================= MOBILE HEADER ================= */}
        <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[#0B1120]/80">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white">
              <CodeXml className="h-5 w-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">CodeSense</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-900 dark:text-white">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden dark:bg-black/60"
                onClick={() => setMobileOpen(false)}
              />
              
              {/* Drawer */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-16 bottom-0 z-50 w-72 border-r border-slate-200 bg-white p-4 md:hidden dark:border-white/10 dark:bg-[#0B1120]"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </Button>
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main
          className={cn(
            "flex-1 flex flex-col min-h-screen transition-all duration-300 bg-gray-50/50 dark:bg-transparent",
            collapsed ? "md:ml-20" : "md:ml-72"
          )}
        >
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-30 hidden h-20 items-center justify-end border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md md:flex dark:border-white/5 dark:bg-[#020617]/80">
            
            <div className="flex items-center gap-4">
              
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                    <Avatar className="h-9 w-9 border border-slate-200 dark:border-white/10">
                      <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-slate-900 dark:bg-[#0B1120] dark:border-white/10 dark:text-slate-200">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-slate-900 dark:text-white">{userName}</p>
                      <p className="w-50 truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-white/5 dark:focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-white/5 dark:focus:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-300 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content Wrapper */}
          <div className="flex-1 p-6 md:p-8 mt-16 md:mt-0 overflow-y-auto">
            <div className="mx-auto max-w-6xl animate-in fade-in-50 duration-500">
                {children}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;