import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, Navigation, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { RouteMap } from "@/components/prithvix/route-map";
import { StatCard, StatusDot } from "@/components/prithvix/stat-card";
import { VOLUNTEER_ASSIGNMENTS } from "@/lib/demo-data";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer Dashboard — PrithviX" },
      {
        name: "description",
        content:
          "Pickup and delivery assignments with route details, quantities, windows and status for PrithviX rescue volunteers.",
      },
      { property: "og:title", content: "Volunteer Dashboard — PrithviX" },
      {
        property: "og:description",
        content: "Your rescue runs for today, with route and status at a glance.",
      },
    ],
  }),
  component: VolunteerDashboard,
});

function VolunteerDashboard() {
  const [activeId, setActiveId] = React.useState(VOLUNTEER_ASSIGNMENTS[0]!.id);
  const active = VOLUNTEER_ASSIGNMENTS.find((a) => a.id === activeId) ?? VOLUNTEER_ASSIGNMENTS[0]!;
  const navigate = useNavigate();

  return (
    <AppShell title="Volunteer Dashboard" subtitle="Kabir Shah · PrithviX Rescue Fleet">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Assignments today"
          value={VOLUNTEER_ASSIGNMENTS.length}
          hint="1 in progress"
          tone="leaf"
        />
        <StatCard label="Distance to cover" value="10.7 km" hint="Across all runs" tone="cool" />
        <StatCard label="Food moved" value="53 kg" hint="≈ 212 meals" tone="harvest" />
        <StatCard label="On-time rate" value="96%" hint="Demo Data" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">My assignments</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent className="space-y-3">
            {VOLUNTEER_ASSIGNMENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setActiveId(a.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  a.id === activeId
                    ? "border-primary bg-primary-soft/40"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    {a.pickup} → {a.drop}
                  </p>
                  <StatusDot status={a.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Package className="size-3.5" aria-hidden="true" /> {a.qtyKg} kg
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden="true" /> {a.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" /> {a.window} · ETA {a.etaMin}{" "}
                    min
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <RouteMap
            from={active.pickup}
            to={active.drop}
            distanceKm={active.distanceKm}
            etaMin={active.etaMin}
            progress={
              active.status === "Completed" ? 1 : active.status === "In progress" ? 0.55 : 0.05
            }
            legs={active.legs}
          />
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="size-4" aria-hidden="true" />
                Turn-by-turn steps are illustrative demo data.
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.success(`Status updated for ${active.drop}`)}
                >
                  Update status
                </Button>
                <Button onClick={() => navigate({ to: "/tracking" })}>Open tracking</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
