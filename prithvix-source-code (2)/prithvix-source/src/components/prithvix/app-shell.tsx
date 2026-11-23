import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LineChart,
  ChefHat,
  PackagePlus,
  Users,
  Route as RouteIcon,
  BarChart3,
  Menu,
  LogOut,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ROLES, type RoleId } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";
import { DemoBadge, Logo } from "./brand";

type NavItem = { to: string; label: string; icon: React.ElementType; step?: number };

const PROVIDER_NAV: NavItem[] = [
  { to: "/provider", label: "Dashboard", icon: LayoutDashboard, step: 1 },
  { to: "/prediction", label: "Demand Prediction", icon: LineChart, step: 2 },
  { to: "/recommendation", label: "Preparation Recommendation", icon: ChefHat, step: 3 },
  { to: "/surplus", label: "Surplus", icon: PackagePlus, step: 4 },
  { to: "/matching", label: "Matching", icon: Users, step: 5 },
  { to: "/tracking", label: "Tracking", icon: RouteIcon, step: 6 },
  { to: "/impact", label: "Impact", icon: BarChart3, step: 7 },
];

const NAV_BY_ROLE: Record<RoleId, NavItem[]> = {
  provider: PROVIDER_NAV,
  recipient: [
    { to: "/recipient", label: "Recipient Dashboard", icon: HeartHandshake },
    { to: "/tracking", label: "Tracking", icon: RouteIcon },
    { to: "/impact", label: "Impact", icon: BarChart3 },
  ],
  volunteer: [
    { to: "/volunteer", label: "My Assignments", icon: Truck },
    { to: "/tracking", label: "Tracking", icon: RouteIcon },
    { to: "/impact", label: "Impact", icon: BarChart3 },
  ],
  admin: [
    { to: "/admin", label: "Network Overview", icon: ShieldCheck },
    { to: "/matching", label: "Matching", icon: Users },
    { to: "/tracking", label: "Tracking", icon: RouteIcon },
    { to: "/impact", label: "Impact", icon: BarChart3 },
  ],
};

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { role } = useDemo();
  const items = NAV_BY_ROLE[role ?? "provider"];
  const isProvider = (role ?? "provider") === "provider";

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {isProvider && (
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
          Provider flow
        </p>
      )}
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
          activeOptions={{ exact: true }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {item.step ? (
            <span className="grid size-6 shrink-0 place-items-center rounded-md border border-sidebar-border text-[11px] font-semibold">
              {item.step}
            </span>
          ) : (
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { roleMeta, currentUser } = useDemo();
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" className="px-1 text-sidebar-foreground" onClick={onNavigate}>
        <Logo />
      </Link>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
        <p className="text-xs font-semibold text-sidebar-accent-foreground">
          {currentUser?.org ?? roleMeta?.org ?? "Demo workspace"}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/70">
          Prepare what is needed. Rescue what remains.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { role, roleMeta, setRole, currentUser, logout } = useDemo();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!role) setRole("provider");
  }, [role, setRole]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function switchRole(next: string) {
    setRole(next as RoleId);
    const target = ROLES.find((r) => r.id === next)?.home ?? "/provider";
    navigate({ to: target });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarBody onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
                <DemoBadge className="hidden sm:inline-flex" />
              </div>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <Select value={role ?? "provider"} onValueChange={switchRole}>
                <SelectTrigger className="w-[168px]" aria-label="Switch demo role">
                  <ArrowRightLeft className="size-3.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Log out"
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
          {(currentUser || roleMeta) && (
            <div className="border-t border-border/70 bg-muted/40 px-4 py-1.5 text-[11px] text-muted-foreground sm:px-6">
              Signed in as{" "}
              <span className="font-semibold text-foreground">
                {currentUser?.name ?? roleMeta?.demoUser}
              </span>{" "}
              · {currentUser?.org ?? roleMeta?.org}
              {currentUser?.email && (
                <span className="hidden text-muted-foreground/80 sm:inline"> ({currentUser.email})</span>
              )}
            </div>
          )}
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
