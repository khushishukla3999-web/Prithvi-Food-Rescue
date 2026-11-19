import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Clock, Coins, Leaf, Scale, Utensils } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { StatCard } from "@/components/prithvix/stat-card";
import {
  PredictedVsActualChart,
  RescuedChart,
  WasteTrendChart,
} from "@/components/prithvix/charts";
import { DEMAND_7DAY, WASTE_TREND } from "@/lib/demo-data";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact Analytics — PrithviX" },
      {
        name: "description",
        content:
          "Demo analytics for waste prevented, meals rescued, food recovered, cost saved, rescue time and prediction accuracy.",
      },
      { property: "og:title", content: "Impact Analytics — PrithviX" },
      {
        property: "og:description",
        content: "Waste trend, predicted vs actual consumption and food rescued over time.",
      },
    ],
  }),
  component: ImpactPage,
});

const CARDS = [
  { label: "Food waste prevented", value: "1,284 kg", hint: "+12.4% vs last month", icon: Leaf, tone: "leaf" as const },
  { label: "Meals rescued", value: "5,140", hint: "+8.1% vs last month", icon: Utensils, tone: "cool" as const },
  { label: "Food recovered", value: "1,072 kg", hint: "+9.6% vs last month", icon: Scale },
  { label: "Estimated cost saved", value: "₹3,86,400", hint: "+11.2% vs last month", icon: Coins, tone: "harvest" as const },
  { label: "Average rescue time", value: "38 min", hint: "-6 min vs last month", icon: Clock },
  { label: "Prediction accuracy", value: "91%", hint: "Sample score, not validated ML", icon: BarChart3, tone: "leaf" as const },
];

function ImpactPage() {
  return (
    <AppShell
      title="Impact Analytics"
      subtitle="Every value on this page is Demo Data"
      actions={<DemoBadge className="hidden sm:inline-flex" />}
    >
      <div className="mb-4 rounded-xl border border-harvest/40 bg-accent px-4 py-3 text-sm text-accent-foreground">
        <strong className="font-semibold">Demo Data:</strong> all metrics, trends and accuracy figures on
        this page are seeded sample values for prototype demonstration. They are not measured outcomes and
        do not reflect a validated model.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <StatCard key={c.label} label={`${c.label} (Demo Data)`} value={c.value} hint={c.hint} icon={c.icon} tone={c.tone} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Food waste trend (kg / month)</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <WasteTrendChart data={WASTE_TREND} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Food rescued over time (meals)</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <RescuedChart data={WASTE_TREND} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Predicted vs actual consumption (last 7 services)</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <PredictedVsActualChart data={DEMAND_7DAY} />
            <p className="mt-3 text-xs text-muted-foreground">
              Gap between the two lines is the surplus that PrithviX routes to verified recipients.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
