import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { DemandChart } from "@/components/prithvix/charts";
import { DEMAND_7DAY, MENU_OPTIONS } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "Demand Prediction — PrithviX" },
      {
        name: "description",
        content:
          "Adjust attendance, menu, weekday, holidays and events to recalculate a demo demand forecast and preparation recommendation.",
      },
      { property: "og:title", content: "Demand Prediction — PrithviX" },
      {
        property: "og:description",
        content: "Editable inputs, instant recalculated forecast — all computed locally as demo data.",
      },
    ],
  }),
  component: PredictionPage,
});

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EVENTS = [
  { id: "none", label: "No special event" },
  { id: "seminar", label: "Seminar / conference day" },
  { id: "sports", label: "Sports meet" },
  { id: "exam", label: "Exam week" },
];

function PredictionPage() {
  const { prediction, recalculate } = useDemo();
  const [form, setForm] = React.useState({
    attendance: prediction.attendance,
    menu: prediction.menu,
    weekday: prediction.weekday,
    holiday: prediction.holiday,
    event: prediction.event,
  });
  const [busy, setBusy] = React.useState(false);

  function run() {
    setBusy(true);
    window.setTimeout(() => {
      recalculate(form);
      setBusy(false);
      toast.success("Prediction recalculated", { description: "Demo model re-run with your inputs." });
    }, 650);
  }

  const chartData = DEMAND_7DAY.map((d, i) =>
    i === DEMAND_7DAY.length - 1
      ? { ...d, predicted: prediction.predicted, prepared: prediction.recommended }
      : d,
  );

  return (
    <AppShell
      title="Demand Prediction"
      subtitle="Forecast meal demand before service begins"
      actions={
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link to="/recommendation">Recommendation</Link>
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-primary/25 bg-primary-soft/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Predicted demand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">{prediction.predicted}</p>
            <p className="mt-1 text-sm text-muted-foreground">meals expected across the service</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recommended preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold text-primary">{prediction.recommended}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {prediction.predicted - prediction.recommended} meals trimmed to limit leftovers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confidence</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">{prediction.confidence}%</p>
            <Progress value={prediction.confidence} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              Illustrative score computed in-app — not a validated ML accuracy figure.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input factors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Edit attendance and menu, then recalculate. Everything runs locally.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attendance">Expected attendance</Label>
              <Input
                id="attendance"
                type="number"
                min={0}
                max={5000}
                value={form.attendance}
                onChange={(e) => setForm({ ...form, attendance: Number(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="menu">Menu type</Label>
              <Select value={form.menu} onValueChange={(v) => setForm({ ...form, menu: v })}>
                <SelectTrigger id="menu" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MENU_OPTIONS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekday">Day of week</Label>
              <Select value={form.weekday} onValueChange={(v) => setForm({ ...form, weekday: v })}>
                <SelectTrigger id="weekday" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Campus event</Label>
              <Select value={form.event} onValueChange={(v) => setForm({ ...form, event: v })}>
                <SelectTrigger id="event" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENTS.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="holiday">Public holiday</Label>
                <p className="text-xs text-muted-foreground">Reduces expected footfall sharply</p>
              </div>
              <Switch
                id="holiday"
                checked={form.holiday}
                onCheckedChange={(v) => setForm({ ...form, holiday: v })}
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              Historic consumption for this kitchen (last 30 services) is always included as a baseline
              factor in the demo calculation.
            </div>

            <Button className="w-full" onClick={run} disabled={busy}>
              <RefreshCw className={busy ? "size-4 animate-spin" : "size-4"} />
              {busy ? "Recalculating…" : "Recalculate prediction"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">7-day demand trend</CardTitle>
              <DemoBadge />
            </CardHeader>
            <CardContent>
              <DemandChart data={chartData} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Happy with the forecast? Send it to the kitchen as a preparation plan.
              </p>
              <Button asChild>
                <Link to="/recommendation">
                  Preparation recommendation <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
