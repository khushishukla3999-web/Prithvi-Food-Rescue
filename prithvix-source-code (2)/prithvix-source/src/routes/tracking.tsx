import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { RouteMap } from "@/components/prithvix/route-map";
import { StatCard } from "@/components/prithvix/stat-card";
import { RECIPIENTS, TRACKING_STEPS } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Redistribution Tracking — PrithviX" },
      {
        name: "description",
        content:
          "Follow a rescue from surplus reported to delivered, with quantity, recipient, distance and live-style status simulation.",
      },
      { property: "og:title", content: "Redistribution Tracking — PrithviX" },
      {
        property: "og:description",
        content: "Five-step rescue timeline you can advance in the demo.",
      },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const { surplus, matchedRecipient, trackingStage, advanceTracking, resetFlow } = useDemo();
  const recipient = matchedRecipient ?? RECIPIENTS[0]!;
  const stage = Math.max(1, trackingStage);
  const delivered = stage >= TRACKING_STEPS.length;
  const progress = (stage - 1) / (TRACKING_STEPS.length - 1);
  const etaLeft = Math.max(0, Math.round(recipient.etaMin * (1 - progress)));

  return (
    <AppShell
      title="Redistribution Tracking"
      subtitle={`${surplus?.item ?? "Surplus"} → ${recipient.org}`}
      actions={
        <Button
          variant="outline"
          className="hidden sm:inline-flex"
          onClick={() => {
            resetFlow();
            toast.info("Demo rescue reset");
          }}
        >
          <RotateCcw className="size-4" /> Reset
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Food quantity"
          value={`${surplus?.quantityKg ?? 18} kg`}
          hint={`≈ ${surplus?.meals ?? 72} meals`}
        />
        <StatCard label="Recipient" value={recipient.org} hint={recipient.type} tone="leaf" />
        <StatCard
          label="Distance"
          value={`${recipient.distanceKm} km`}
          hint="Illustrative road distance"
        />
        <StatCard
          label={delivered ? "Completed in" : "ETA"}
          value={delivered ? `${recipient.etaMin} min` : `${etaLeft} min`}
          hint={delivered ? "Handover confirmed" : TRACKING_STEPS[stage - 1]!.label}
          tone="harvest"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Rescue timeline</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-6 border-l border-border pl-6">
              {TRACKING_STEPS.map((step, i) => {
                const done = i + 1 < stage;
                const active = i + 1 === stage;
                return (
                  <li key={step.key} className="relative">
                    <span className="absolute -left-[31px] top-0.5 grid size-5 place-items-center rounded-full bg-background">
                      {done ? (
                        <CheckCircle2 className="size-5 text-success" aria-hidden="true" />
                      ) : active ? (
                        <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground/40" aria-hidden="true" />
                      )}
                    </span>
                    <p
                      className={`text-sm font-semibold ${done || active ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                    {active && (
                      <p className="mt-1 text-xs font-medium text-primary">Current status</p>
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={advanceTracking} disabled={delivered}>
                {delivered ? "Delivery complete" : "Simulate next status"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetFlow();
                  toast.info("Demo rescue reset");
                }}
              >
                <RotateCcw className="size-4" /> Reset demo
              </Button>
              {delivered && (
                <Button asChild variant="secondary">
                  <Link to="/impact">See impact</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <RouteMap
            from="Sunrise Campus Kitchen"
            to={recipient.org}
            distanceKm={recipient.distanceKm}
            etaMin={recipient.etaMin}
            progress={progress}
            legs={["Kitchen gate B", "Ring Road", "Lake Junction", `${recipient.org} entrance`]}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consignment details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ["Item", surplus?.item ?? "Veg pulao & dal tadka"],
                ["Handling", surplus?.storage ?? "Hot holding, 65°C"],
                ["Prepared at", surplus?.preparedAt ?? "12:15"],
                ["Volunteer", "Kabir Shah · PrithviX Rescue Fleet"],
                ["Status", delivered ? "Delivered" : TRACKING_STEPS[stage - 1]!.label],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
