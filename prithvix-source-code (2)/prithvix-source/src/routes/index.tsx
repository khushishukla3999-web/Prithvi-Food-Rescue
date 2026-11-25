import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  HandHeart,
  HeartHandshake,
  Leaf,
  PackageSearch,
  Route as RouteIcon,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoBadge, Logo } from "@/components/prithvix/brand";
import { BRAND, ROLES } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prithvi Food Rescue | Save Food, Feed People" },
      {
        name: "description",
        content:
          "Prithvi Food Rescue predicts kitchen demand, prevents food waste, and redistributes surplus meals to verified community recipients.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Prithvi Food Rescue | Save Food, Feed People" },
      {
        property: "og:description",
        content:
          "Predict kitchen demand, prevent food waste, and redistribute surplus meals to verified community recipients with Prithvi Food Rescue.",
      },
      {
        property: "og:url",
        content: "https://github.com/khushishukla3999-web/Prithvi-Food-Rescue",
      },
      { property: "og:image", content: "/favicon.ico" },
      { property: "og:image:alt", content: "Prithvi Food Rescue" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Prithvi Food Rescue | Save Food, Feed People" },
      {
        name: "twitter:description",
        content:
          "Predict kitchen demand, prevent food waste, and redistribute surplus meals to verified community recipients with Prithvi Food Rescue.",
      },
      { name: "twitter:image", content: "/favicon.ico" },
      { name: "twitter:image:alt", content: "Prithvi Food Rescue" },
    ],
  }),
  component: Landing,
});

const STATS = [
  { value: "1,284 kg", label: "Food waste prevented" },
  { value: "5,140", label: "Meals rescued" },
  { value: "96", label: "Verified recipients" },
  { value: "38 min", label: "Average rescue time" },
];

const STEPS = [
  {
    icon: Brain,
    title: "Predict",
    text: "Forecast meal demand from attendance, menu, weekday, holidays, events and historic consumption.",
  },
  {
    icon: Leaf,
    title: "Prevent",
    text: "Kitchens get a preparation recommendation that trims over-cooking before it becomes waste.",
  },
  {
    icon: PackageSearch,
    title: "Rescue",
    text: "Whatever remains is logged with handling and storage details in under a minute.",
  },
  {
    icon: HandHeart,
    title: "Redistribute",
    text: "Smart matching picks the best verified recipient and a volunteer runs the pickup to delivery.",
  },
];

function Landing() {
  const { currentUser, role } = useDemo();
  const currentDashboard = role
    ? (ROLES.find((r) => r.id === role)?.home ?? "/provider")
    : "/provider";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/donate">
                <HeartHandshake className="mr-1.5 size-4 text-primary" /> Donate Food
              </Link>
            </Button>
            {currentUser || role ? (
              <Button asChild>
                <Link to={currentDashboard}>
                  Dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">
                    Get Started <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero-wash border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="animate-fade-in">
            <DemoBadge label="Interactive prototype · Demo Data" />
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Predict. Prevent.
              <br />
              Rescue. <span className="text-leaf">Redistribute.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {BRAND.name} helps campus kitchens, canteens and caterers cook closer to real demand —
              and moves every surplus tray to a verified community kitchen before it spoils.
            </p>
            <p className="mt-4 font-display text-lg font-medium text-primary">“{BRAND.message}”</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={currentUser || role ? currentDashboard : "/login"}>
                  {currentUser || role ? "Go to Dashboard" : "Enter the demo"}{" "}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/donate">
                  <HeartHandshake className="mr-2 size-4 text-primary" /> Donate Food
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Sign up or test with one-click demo accounts. All operations are safe and client-side.
            </p>
          </div>

          <Card className="self-center border-primary/15 shadow-lg food-card-hover animate-fade-in-scale animate-delay-100">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Today at Sunrise Campus Kitchen</p>
                <DemoBadge />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: "Expected demand", v: "820 meals" },
                  { k: "Recommended prep", v: "790 meals" },
                  { k: "Actual served", v: "775 meals" },
                  { k: "Surplus", v: "15 meals" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-xl border border-border bg-muted/40 p-3 transition-all duration-200 ease-out hover:border-primary/30 hover:bg-muted/70 hover:scale-[1.02]"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {x.k}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">{x.v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary-soft/60 p-3 transition-all duration-200 ease-out hover:bg-primary-soft/80 hover:shadow-sm">
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="size-4" /> 42.5 kg of waste prevented this week
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sample confidence 91% — illustrative model output, not a live ML score.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              <p className="font-display text-3xl font-semibold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
          <p className="col-span-2 text-xs text-muted-foreground lg:col-span-4">
            All impact figures are seeded demo data for prototype purposes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-semibold">How PrithviX works</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          One continuous loop: forecast demand before service, then rescue whatever remains after
          it.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Card key={s.title} className="group h-full food-card-hover">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary transition-transform duration-200 ease-out group-hover:scale-110">
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Walk the full rescue journey
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Dashboard → Demand Prediction → Preparation Recommendation → Surplus → Matching →
              Tracking → Impact. Switch between provider, recipient, volunteer and admin views at
              any time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/login">
                Choose a role <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/impact">See impact analytics</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo mark />
          <span>
            {BRAND.name} — {BRAND.tagline}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="size-4" /> Rescue fleet demo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RouteIcon className="size-4" /> Prototype build
          </span>
        </div>
      </footer>
    </div>
  );
}
