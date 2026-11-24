import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Clock, Gauge, MapPin, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { RouteMap } from "@/components/prithvix/route-map";
import { RECIPIENTS } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/matching")({
  head: () => ({
    meta: [
      { title: "Smart Recipient Matching — PrithviX" },
      {
        name: "description",
        content:
          "Verified recipient cards scored on distance, capacity, urgency and availability, with a local route visualisation.",
      },
      { property: "og:title", content: "Smart Recipient Matching — PrithviX" },
      {
        property: "og:description",
        content: "Pick the best-fit recipient and request pickup in one tap.",
      },
    ],
  }),
  component: MatchingPage,
});

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <Progress value={value} className="mt-1 h-1.5" />
    </div>
  );
}

function MatchingPage() {
  const { surplus, matchedRecipient, selectRecipient } = useDemo();
  const navigate = useNavigate();
  const top = matchedRecipient ?? RECIPIENTS[0]!;

  return (
    <AppShell
      title="Smart Recipient Matching"
      subtitle={
        surplus
          ? `${surplus.quantityKg} kg · ${surplus.item} · ${surplus.storage}`
          : "Matching verified recipients"
      }
    >
      <Card className="mb-6 border-primary/25 bg-primary-soft/30">
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-2 font-medium">
            <Gauge className="size-4 text-primary" aria-hidden="true" /> Match score =
          </span>
          <span>Distance 35%</span>
          <span>Capacity fit 25%</span>
          <span>Urgency 20%</span>
          <span>Availability 20%</span>
          <DemoBadge className="ml-auto" />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-4">
          {RECIPIENTS.map((r, i) => {
            const distanceScore = Math.round(Math.max(0, 100 - r.distanceKm * 9));
            const capacityScore = Math.round(
              Math.min(100, (r.capacityKg / Math.max(1, surplus?.quantityKg ?? 18)) * 78),
            );
            const urgencyScore = r.urgency === "High" ? 92 : r.urgency === "Medium" ? 74 : 55;
            const availabilityScore = r.available ? 96 : 48;
            const selected = matchedRecipient?.id === r.id;

            return (
              <Card
                key={r.id}
                className={
                  selected ? "border-primary shadow-md" : "transition-shadow hover:shadow-md"
                }
              >
                <CardContent className="grid gap-4 md:grid-cols-[1fr_200px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {i === 0 && !matchedRecipient && (
                        <Badge className="bg-primary text-primary-foreground">Best match</Badge>
                      )}
                      {selected && (
                        <Badge className="bg-success text-success-foreground">Selected</Badge>
                      )}
                      <h2 className="text-lg font-semibold">{r.org}</h2>
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified (demo) ·{" "}
                        {r.verifiedSince}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.type} · contact {r.contact}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { icon: MapPin, k: "Distance", v: `${r.distanceKm} km` },
                        { icon: Users, k: "Capacity", v: `${r.capacityKg} kg` },
                        { icon: Clock, k: "Pickup ETA", v: `${r.etaMin} min` },
                        { icon: Zap, k: "Urgency", v: r.urgency },
                      ].map((m) => (
                        <div key={m.k} className="rounded-lg border border-border bg-muted/40 p-2">
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <m.icon className="size-3" aria-hidden="true" /> {m.k}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold">{m.v}</p>
                        </div>
                      ))}
                    </div>

                    <p
                      className={`mt-3 text-sm font-medium ${r.available ? "text-success" : "text-muted-foreground"}`}
                    >
                      {r.availability}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl border border-border p-3">
                    <div className="text-center">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Match score
                      </p>
                      <p className="font-display text-3xl font-semibold text-primary">
                        {r.matchScore}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <ScoreBar label="Distance" value={distanceScore} />
                      <ScoreBar label="Capacity" value={capacityScore} />
                      <ScoreBar label="Urgency" value={urgencyScore} />
                      <ScoreBar label="Availability" value={availabilityScore} />
                    </div>
                    <Button
                      className="mt-auto w-full"
                      variant={selected ? "secondary" : "default"}
                      onClick={() => {
                        selectRecipient(r.id);
                        toast.success(`Pickup requested from ${r.org}`, {
                          description: "Volunteer assigned — moving to tracking.",
                        });
                        window.setTimeout(() => navigate({ to: "/tracking" }), 700);
                      }}
                    >
                      {selected ? "Pickup requested" : "Request Pickup"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Route preview</CardTitle>
              <DemoBadge />
            </CardHeader>
            <CardContent>
              <RouteMap
                from="Sunrise Campus Kitchen"
                to={top.org}
                distanceKm={top.distanceKm}
                etaMin={top.etaMin}
                progress={matchedRecipient ? 0.25 : 0}
                legs={["Kitchen gate B", "Ring Road", "Lake Junction", `${top.org} entrance`]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Why this order?</p>
              <p>
                Recipients within 8 km are ranked by weighted score. Availability windows and
                cold-chain capacity break ties. Verification status here is illustrative demo data,
                not a live check.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
