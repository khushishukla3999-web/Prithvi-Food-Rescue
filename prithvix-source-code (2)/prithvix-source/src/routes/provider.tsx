import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChefHat,
  Leaf,
  PackageSearch,
  Sparkles,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { StatCard } from "@/components/prithvix/stat-card";
import { DemandChart } from "@/components/prithvix/charts";
import { DEMAND_7DAY, RECENT_ACTIVITY } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/provider")({
  head: () => ({
    meta: [
      { title: "Food Provider Dashboard — PrithviX" },
      {
        name: "description",
        content:
          "Track expected demand, preparation recommendation, meals served and surplus for your kitchen in the PrithviX demo.",
      },
      { property: "og:title", content: "Food Provider Dashboard — PrithviX" },
      {
        property: "og:description",
        content: "Expected demand, AI-style preparation recommendation and surplus in one view.",
      },
    ],
  }),
  component: ProviderDashboard,
});

function ProviderDashboard() {
  const { snapshot, prediction } = useDemo();

  return (
    <AppShell
      title="Food Provider Dashboard"
      subtitle="Sunrise Campus Kitchen · Sunday dinner service"
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/donate">Donate food</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/surplus">
              Report surplus <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Expected demand"
          value={`${snapshot.expectedDemand} meals`}
          hint="Forecast for today's service"
          icon={TrendingUp}
          tone="cool"
        />
        <StatCard
          label="Recommended preparation"
          value={`${snapshot.recommendedPrep} meals`}
          hint="30 meals below raw forecast"
          icon={ChefHat}
          tone="leaf"
        />
        <StatCard
          label="Actual served"
          value={`${snapshot.actualServed} meals`}
          hint="98% of recommended prep"
          icon={Utensils}
        />
        <StatCard
          label="Surplus"
          value={`${snapshot.surplusMeals} meals`}
          hint={`${snapshot.wastePreventedKg} kg waste prevented this week`}
          icon={PackageSearch}
          tone="harvest"
        />
      </div>

      <Card className="mt-6 border-primary/25 bg-primary-soft/40">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              Preparation recommendation
            </CardTitle>
            <DemoBadge label={`Demo Data · Confidence ${snapshot.confidence}%`} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="font-display text-3xl font-semibold sm:text-4xl">
              Prepare {prediction.recommended} meals today
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This recommendation considers expected attendance, the planned menu, your kitchen's
              consumption history, the day of the week, and any events or holidays on the calendar.
              It sits deliberately below the raw forecast of {prediction.predicted} meals so
              leftovers stay small and rescuable.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {[
                "Attendance",
                "Menu type",
                "Consumption history",
                "Day of week",
                "Events & holidays",
              ].map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-primary/25 bg-card px-3 py-1 font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/recommendation">
                  Open recommendation detail <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/prediction">Adjust prediction inputs</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Model confidence
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">{snapshot.confidence}%</p>
            <Progress value={snapshot.confidence} className="mt-3" />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Illustrative confidence score generated in-app for this prototype. It does not
              represent a trained or validated machine-learning model.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">7-day demand vs preparation</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <DemandChart data={DEMAND_7DAY} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.text} className="flex gap-3">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${a.tone === "good" ? "bg-success" : "bg-sky-cool"}`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/tracking">
                <Leaf className="size-4" /> View live redistribution
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
