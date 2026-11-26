import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Building,
  CheckCircle2,
  HeartHandshake,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  User,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoBadge, Logo } from "@/components/prithvix/brand";
import { ROLES, type RoleId } from "@/lib/demo-data";
import { useDemo, DEFAULT_DEMO_USERS } from "@/lib/demo-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Prithvi Food Rescue" },
      {
        name: "description",
        content:
          "Create an account on Prithvi Food Rescue as a food provider, recipient shelter, volunteer partner, or admin.",
      },
      { property: "og:title", content: "Sign Up — Prithvi Food Rescue" },
      {
        property: "og:description",
        content: "Join the mission to predict demand, prevent food waste, and feed people.",
      },
    ],
  }),
  component: SignupPage,
});

const ROLE_ICONS: Record<RoleId, React.ElementType> = {
  provider: Store,
  recipient: HeartHandshake,
  volunteer: Truck,
  admin: ShieldCheck,
};

function SignupPage() {
  const { currentUser, role, signup, loginAsDemoRole } = useDemo();
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<RoleId>("provider");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    const res = signup({
      name,
      email,
      password,
      role: selectedRole,
      org: org.trim() || undefined,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Failed to create account. Please try again.");
      return;
    }

    toast.success(`Account created successfully! Welcome, ${res.user?.name}.`);
    const targetDashboard = ROLES.find((r) => r.id === res.user?.role)?.home ?? "/provider";
    navigate({ to: targetDashboard });
  }

  function handleDemo(roleId: RoleId, home: string) {
    loginAsDemoRole(roleId);
    const demo = DEFAULT_DEMO_USERS[roleId];
    toast.success(`Signed in as demo ${demo.name} (${demo.org})`);
    navigate({ to: home });
  }

  const currentDashboard = role
    ? (ROLES.find((r) => r.id === role)?.home ?? "/provider")
    : "/provider";

  return (
    <div className="hero-wash min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Already have an account?
            </span>
            <Button asChild variant="outline" size="sm">
              <Link to="/login">
                <LogIn className="mr-1.5 size-3.5" /> Log In
              </Link>
            </Button>
          </div>
        </div>

        {currentUser && (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft/50 p-4 text-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-primary">Currently signed in</p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{currentUser.name}</span> (
                  {currentUser.email}) · {currentUser.org}
                </p>
              </div>
              <Button size="sm" asChild>
                <Link to={currentDashboard}>
                  Go to Dashboard <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 max-w-2xl">
          <DemoBadge label="Registration · Create Account" />
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl text-foreground">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the Prithvi Food Rescue network to log food surplus, claim rescue donations, or
            coordinate deliveries.
          </p>
        </div>

        <Card className="mt-8 max-w-2xl border-border shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="size-5 text-primary" /> Sign Up Details
            </CardTitle>
            <CardDescription className="text-xs">
              Fill in your details below. Your credentials will persist securely in your browser
              session.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-xs font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      required
                      placeholder="e.g. Ananya Rao"
                      className="pl-9 text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="e.g. ananya@kitchen.org"
                      className="pl-9 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-medium">
                    Password (min 6 characters) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-9 text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-role" className="text-xs font-medium">
                    Account Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(val) => setSelectedRole(val as RoleId)}
                  >
                    <SelectTrigger id="signup-role" className="w-full text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => {
                        const Icon = ROLE_ICONS[r.id];
                        return (
                          <SelectItem key={r.id} value={r.id}>
                            <span className="flex items-center gap-2">
                              <Icon className="size-4 text-primary" />
                              <span>{r.label}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-org" className="text-xs font-medium">
                  Organisation / Kitchen Name (Optional)
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="signup-org"
                    placeholder="e.g. Sunrise Campus Kitchen, Annapurna Seva Trust"
                    className="pl-9 text-sm"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5 font-semibold text-foreground">
                  <ShieldCheck className="size-4 text-primary" /> Food Rescue Code of Conduct
                </p>
                <p className="mt-1">
                  By registering, you agree to handle food safely according to regional hygiene
                  standards and ensure timely, respectful distribution to community members.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full text-sm font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Creating Account..."
                ) : (
                  <>
                    <UserPlus className="mr-2 size-4" /> Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log In here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 1-Click Demo Personas Alternative */}
        <div className="mt-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Or Explore Instantly with 1-Click Demo Personas:
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ROLES.map((r) => {
              const Icon = ROLE_ICONS[r.id];
              const demo = DEFAULT_DEMO_USERS[r.id];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleDemo(r.id, r.home)}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-muted/40 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{r.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {demo.name} · {demo.org}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
