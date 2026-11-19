import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, ShieldCheck, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoBadge, Logo } from "@/components/prithvix/brand";
import { BRAND, ROLES, type RoleId } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Choose a demo role — PrithviX" },
      {
        name: "description",
        content:
          "Enter the PrithviX demo as a food provider, recipient NGO, volunteer delivery partner or network admin.",
      },
      { property: "og:title", content: "Choose a demo role — PrithviX" },
      {
        property: "og:description",
        content: "Four role-based dashboards, one continuous food rescue flow.",
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
  const { setRole } = useDemo();
  const navigate = useNavigate();

  function enter(role: RoleId, home: string) {
    setRole(role);
    navigate({ to: home });
  }

  return (
    <div className="hero-wash min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>

        <div className="mt-10 max-w-2xl">
          <DemoBadge label="Demo login · no password" />
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Pick the role you want to explore
          </h1>
          <p className="mt-3 text-muted-foreground">
            {BRAND.tagline} — every dashboard below runs on seeded demo data, and you can switch roles at
            any time from the top bar.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = ICONS[role.id];
            return (
              <Card key={role.id} className="group transition-shadow hover:shadow-lg">
                <CardContent className="flex h-full flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">{role.label}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{role.blurb}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    Demo account: <span className="font-medium text-foreground">{role.demoUser}</span> ·{" "}
                    {role.org}
                  </div>
                  <Button className="mt-auto w-full" onClick={() => enter(role.id, role.home)}>
                    Enter as {role.label} <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          This prototype performs no real authentication or verification. Organisation verification badges
          shown inside the app are illustrative demo data.
        </p>
      </div>
    </div>
  );
}
