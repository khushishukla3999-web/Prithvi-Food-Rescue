import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Store,
  Truck,
  LogIn,
  UserPlus,
  Sparkles,
  LogOut,
  AlertCircle,
  Building,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoBadge, Logo } from "@/components/prithvix/brand";
import { BRAND, ROLES, type RoleId } from "@/lib/demo-data";
import { useDemo, DEFAULT_DEMO_USERS } from "@/lib/demo-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In & Sign Up — Prithvi Food Rescue" },
      {
        name: "description",
        content:
          "Log in or create a Prithvi Food Rescue account as a food provider, recipient NGO, volunteer partner, or admin.",
      },
      { property: "og:title", content: "Sign In & Sign Up — Prithvi Food Rescue" },
      {
        property: "og:description",
        content:
          "Access your dashboard to predict demand, prevent food waste, and coordinate rescues.",
      },
    ],
  }),
  component: LoginPage,
});

const ICONS: Record<RoleId, React.ElementType> = {
  provider: Store,
  recipient: HeartHandshake,
  volunteer: Truck,
  admin: ShieldCheck,
};

function LoginPage() {
  const { currentUser, role, login, signup, loginAsDemoRole, logout } = useDemo();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<string>("login");

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // Signup form state
  const [signupName, setSignupName] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
  const [signupPassword, setSignupPassword] = React.useState("");
  const [signupOrg, setSignupOrg] = React.useState("");
  const [signupRole, setSignupRole] = React.useState<RoleId>("provider");
  const [signupError, setSignupError] = React.useState("");
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const res = login(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error ?? "Failed to log in.");
      return;
    }

    toast.success(`Welcome back, ${res.user?.name}!`);
    const targetHome = ROLES.find((r) => r.id === res.user?.role)?.home ?? "/provider";
    navigate({ to: targetHome });
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");
    setIsSigningUp(true);

    const res = signup({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      org: signupOrg,
    });
    setIsSigningUp(false);

    if (!res.success) {
      setSignupError(res.error ?? "Failed to sign up.");
      return;
    }

    toast.success(`Account created successfully! Signed in as ${res.user?.name}.`);
    const targetHome = ROLES.find((r) => r.id === res.user?.role)?.home ?? "/provider";
    navigate({ to: targetHome });
  }

  function handleDemoLogin(roleId: RoleId, home: string) {
    loginAsDemoRole(roleId);
    const demo = DEFAULT_DEMO_USERS[roleId];
    toast.success(`Entered as demo ${demo.name} (${demo.org})`);
    navigate({ to: home });
  }

  function quickFillDemo(roleId: RoleId) {
    const demo = DEFAULT_DEMO_USERS[roleId];
    setLoginEmail(demo.email);
    setLoginPassword(demo.password);
    setLoginError("");
  }

  const currentDashboard = role
    ? (ROLES.find((r) => r.id === role)?.home ?? "/provider")
    : "/provider";

  return (
    <div className="hero-wash min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>

        {currentUser && (
          <div className="mt-8 rounded-xl border border-primary/30 bg-primary-soft/50 p-4 text-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-primary">Currently signed in</p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{currentUser.name}</span> (
                  {currentUser.email}) · {currentUser.org}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild>
                  <Link to={currentDashboard}>
                    Go to Dashboard <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                  }}
                >
                  <LogOut className="mr-1.5 size-3.5" /> Log Out
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 max-w-2xl">
          <DemoBadge label="Authentication · Sign In & Sign Up" />
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Join the Food Rescue Mission
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to your account, create a new organization profile, or use one-click demo
            personas to explore the dashboards.
          </p>
        </div>

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-2xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login" className="flex items-center gap-1.5">
                <LogIn className="size-4" /> Log In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-1.5">
                <UserPlus className="size-4" /> Sign Up
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex items-center gap-1.5">
                <Sparkles className="size-4" /> 1-Click Demo
              </TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="mt-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Log In to Your Account</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your role-based rescue dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          required
                          placeholder="e.g. ananya@sunrisekitchen.org"
                          className="pl-9"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          required
                          placeholder="••••••••"
                          className="pl-9"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? "Signing in..." : "Log In"} <ArrowRight className="size-4" />
                    </Button>
                  </form>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Quick Fill Demo Accounts:
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => quickFillDemo(r.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted cursor-pointer"
                        >
                          <span className="font-medium">{r.label}</span>
                          <span className="text-muted-foreground">({r.demoUser})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SIGN UP TAB */}
            <TabsContent value="signup" className="mt-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Create a New Account</CardTitle>
                  <CardDescription>
                    Register as a food provider, recipient shelter, volunteer driver, or network
                    admin.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    {signupError && (
                      <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{signupError}</span>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            required
                            placeholder="Ananya Rao"
                            className="pl-9"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            required
                            placeholder="ananya@kitchen.org"
                            className="pl-9"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-password">Password (min 6 chars)</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="pl-9"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signup-org">Organization / Kitchen Name</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="signup-org"
                            placeholder="Sunrise Campus Kitchen"
                            className="pl-9"
                            value={signupOrg}
                            onChange={(e) => setSignupOrg(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-role">Select Your Role</Label>
                      <Select
                        value={signupRole}
                        onValueChange={(val) => setSignupRole(val as RoleId)}
                      >
                        <SelectTrigger id="signup-role" className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              <span className="font-medium">{r.label}</span> —{" "}
                              <span className="text-muted-foreground">{r.blurb}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSigningUp}>
                      {isSigningUp ? "Creating Account..." : "Create Account"}{" "}
                      <ArrowRight className="size-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 1-CLICK DEMO TAB */}
            <TabsContent value="demo" className="mt-4 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2">
                {ROLES.map((roleItem) => {
                  const Icon = ICONS[roleItem.id];
                  return (
                    <Card
                      key={roleItem.id}
                      className="group food-card-hover transition-shadow hover:shadow-lg"
                    >
                      <CardContent className="flex h-full flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-transform duration-200 group-hover:scale-105">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold">{roleItem.label}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{roleItem.blurb}</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                          Demo account:{" "}
                          <span className="font-medium text-foreground">{roleItem.demoUser}</span> ·{" "}
                          {roleItem.org}
                        </div>
                        <Button
                          className="mt-auto w-full"
                          onClick={() => handleDemoLogin(roleItem.id, roleItem.home)}
                        >
                          Enter as {roleItem.label} <ArrowRight className="size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          {BRAND.name} authentication prototype. Accounts created in this session are safely
          preserved in your browser's local storage.
        </p>
      </div>
    </div>
  );
}
