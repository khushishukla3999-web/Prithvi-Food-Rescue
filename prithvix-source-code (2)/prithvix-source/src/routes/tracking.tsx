import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Loader2, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { RouteMap } from "@/components/prithvix/route-map";
import { StatCard } from "@/components/prithvix/stat-card";
import { RECIPIENTS, TRACKING_STEPS } from "@/lib/demo-data";
import { useDemo, type FoodClaimRequest } from "@/lib/demo-store";

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
  const {
    surplus,
    matchedRecipient,
    trackingStage,
    advanceTracking,
    resetFlow,
    requests,
    activeRequestId,
    setActiveRequestId,
    updateRequestStatus,
  } = useDemo();

  const recipient = matchedRecipient ?? RECIPIENTS[0]!;

  // Current active request being tracked, if any
  const currentRequest: FoodClaimRequest | undefined = activeRequestId
    ? requests.find((r) => r.id === activeRequestId)
    : requests[0];

  const isTrackingRequest = !!currentRequest;

  // Tracking stage and progress
  const stage = isTrackingRequest ? currentRequest.trackingStage : Math.max(1, trackingStage);
  const delivered = stage >= TRACKING_STEPS.length;
  const progress = (stage - 1) / (TRACKING_STEPS.length - 1);

  // Consignment metadata
  const foodTitle = isTrackingRequest ? currentRequest.foodName : (surplus?.item ?? "Surplus food");
  const quantityKg = isTrackingRequest ? currentRequest.quantityKg : (surplus?.quantityKg ?? 18);
  const mealsCount = isTrackingRequest ? currentRequest.meals : (surplus?.meals ?? 72);
  const fromLocation = isTrackingRequest ? currentRequest.pickupLocation : "Sunrise Campus Kitchen";
  const toRecipient = isTrackingRequest ? currentRequest.recipientOrg : recipient.org;
  const distanceKm = isTrackingRequest ? 3.2 : recipient.distanceKm;
  const baseEtaMin = isTrackingRequest ? 28 : recipient.etaMin;
  const etaLeft = Math.max(0, Math.round(baseEtaMin * (1 - progress)));

  async function handleAdvance() {
    if (isTrackingRequest && currentRequest) {
      const nextStage = Math.min(TRACKING_STEPS.length, currentRequest.trackingStage + 1);
      let nextStatus: FoodClaimRequest["status"] = "Approved";

      if (nextStage === 2) nextStatus = "Approved";
      else if (nextStage === 3 || nextStage === 4) nextStatus = "In transit";
      else if (nextStage === 5) nextStatus = "Delivered";

      await updateRequestStatus(currentRequest.id, nextStatus, nextStage);
      toast.success(`Updated status for ${currentRequest.foodName} to ${nextStatus}`, {
        description:
          nextStage === 5
            ? "Delivery verified and marked as complete!"
            : `Stage ${nextStage} of 5.`,
      });
    } else {
      advanceTracking();
    }
  }

  return (
    <AppShell
      title="Redistribution Tracking"
      subtitle={`${foodTitle} (${quantityKg} kg) → ${toRecipient}`}
      actions={
        <Button
          variant="outline"
          className="hidden sm:inline-flex"
          onClick={() => {
            resetFlow();
            toast.info("Demo rescue tracking reset");
          }}
        >
          <RotateCcw className="size-4" /> Reset
        </Button>
      }
    >
      {/* Consignment Switcher (if multiple requests exist) */}
      {requests.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Select Consignment to Track:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={currentRequest ? currentRequest.id : "surplus"}
              onValueChange={(val) => {
                if (val === "surplus") {
                  setActiveRequestId(null);
                } else {
                  setActiveRequestId(val);
                }
              }}
            >
              <SelectTrigger className="h-8 w-64 text-xs">
                <SelectValue placeholder="Choose consignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surplus">Provider Surplus Consignment (Demo)</SelectItem>
                {requests.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.foodName} ({r.quantityKg} kg) - {r.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isTrackingRequest && (
              <Badge variant="outline" className="text-[11px] font-medium text-primary">
                {currentRequest.status}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Food quantity" value={`${quantityKg} kg`} hint={`≈ ${mealsCount} meals`} />
        <StatCard
          label="Recipient"
          value={toRecipient}
          hint={isTrackingRequest ? currentRequest.category : recipient.type}
          tone="leaf"
        />
        <StatCard label="Distance" value={`${distanceKm} km`} hint="Estimated road transit" />
        <StatCard
          label={delivered ? "Completed in" : "ETA"}
          value={delivered ? `${baseEtaMin} min` : `${etaLeft} min`}
          hint={delivered ? "Handover confirmed" : TRACKING_STEPS[stage - 1]!.label}
          tone="harvest"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* Rescue Timeline */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold">Rescue Timeline</CardTitle>
              <CardDescription className="text-xs">
                {isTrackingRequest
                  ? `Tracking consignment #${currentRequest.id}`
                  : "Provider surplus lifecycle"}
              </CardDescription>
            </div>
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
                      className={`text-sm font-semibold ${
                        done || active ? "text-foreground" : "text-muted-foreground"
                      }`}
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
              <Button onClick={handleAdvance} disabled={delivered}>
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

        {/* Route Map & Consignment Details */}
        <div className="space-y-4">
          <RouteMap
            from={fromLocation}
            to={toRecipient}
            distanceKm={distanceKm}
            etaMin={baseEtaMin}
            progress={progress}
            legs={[
              fromLocation.split(",")[0] || "Origin pickup",
              "Ring Road express",
              "City central bypass",
              `${toRecipient} distribution center`,
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Consignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ["Consignment item", foodTitle],
                ["Quantity & portions", `${quantityKg} kg (≈ ${mealsCount} meals)`],
                ["Origin / Pickup", fromLocation],
                ["Destination recipient", toRecipient],
                ["Volunteer / Fleet", "Kabir Shah · PrithviX Rescue Fleet"],
                ["Current status", delivered ? "Delivered" : TRACKING_STEPS[stage - 1]!.label],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground text-xs">{k}</span>
                  <span className="text-right font-medium text-xs text-foreground">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
