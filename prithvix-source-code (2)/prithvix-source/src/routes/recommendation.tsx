import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { MENU_OPTIONS } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/recommendation")({
  head: () => ({
    meta: [
      { title: "Preparation Recommendation — PrithviX" },
      {
        name: "description",
        content:
          "A concise kitchen-ready preparation recommendation with the factors and confidence behind it, shown as demo data.",
      },
      { property: "og:title", content: "Preparation Recommendation — PrithviX" },
      {
        property: "og:description",
        content: "Cook this much today — and why the number looks the way it does.",
      },
    ],
  }),
  component: RecommendationPage,
});

function RecommendationPage() {
  const { prediction } = useDemo();
  const menuLabel = MENU_OPTIONS.find((m) => m.id === prediction.menu)?.label ?? "Standard veg thali";

  const factors = [
    { label: "Expected attendance", value: `${prediction.attendance} people`, weight: 38 },
    { label: "Menu type", value: menuLabel, weight: 22 },
    { label: "Historic consumption", value: "Last 30 services", weight: 18 },
    { label: "Day of week", value: prediction.weekday, weight: 12 },
    {
      label: "Events & holidays",
      value: prediction.holiday ? "Public holiday" : "No holiday flagged",
      weight: 10,
    },
  ];

  return (
    <AppShell
      title="Preparation Recommendation"
      subtitle="One number for the kitchen, with the reasoning behind it"
      actions={
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/surplus">
            Log surplus <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <Card className="border-primary/25 bg-primary-soft/40">
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ChefHat className="size-5" aria-hidden="true" />
              </span>
              <DemoBadge label={`Demo Data · Confidence ${prediction.confidence}%`} />
            </div>
            <p className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Prepare {prediction.recommended} meals
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Against a predicted demand of {prediction.predicted} meals, the recommendation trims{" "}
              {prediction.predicted - prediction.recommended} meals. It weighs expected attendance, the
              planned menu, this kitchen's consumption history, the day of the week and any events or
              holidays. The goal is a surplus small enough to rescue safely — never a shortfall you cannot
              serve.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/surplus">
                  Continue to surplus logging <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/prediction">Change inputs</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Confidence</p>
            <p className="mt-1 font-display text-3xl font-semibold">{prediction.confidence}%</p>
            <Progress value={prediction.confidence} className="mt-3" />
            <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Prototype figure produced by a local rule-based calculation. No trained model, no live data.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What drove this number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {factors.map((f) => (
              <div key={f.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{f.label}</p>
                  <p className="text-sm text-muted-foreground">{f.value}</p>
                </div>
                <Progress value={f.weight * 2.5} className="mt-2 h-1.5" />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Relative weight in demo calculation: {f.weight}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kitchen brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["Total to prepare", `${prediction.recommended} meals`],
              ["Batch in two rounds", `${Math.round(prediction.recommended * 0.7)} + ${prediction.recommended - Math.round(prediction.recommended * 0.7)}`],
              ["Hold back buffer", `${Math.round(prediction.recommended * 0.05)} meals of quick-cook items`],
              ["Expected surplus band", "10 – 25 meals"],
              ["Rescue window", "Within 4 hours of preparation"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Guidance values are illustrative demo data for this prototype.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
