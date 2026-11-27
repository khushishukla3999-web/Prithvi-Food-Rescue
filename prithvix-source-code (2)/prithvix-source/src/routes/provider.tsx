import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Clock,
  ExternalLink,
  HeartHandshake,
  Leaf,
  MapPin,
  Package,
  PackageCheck,
  PackageSearch,
  PlusCircle,
  Sparkles,
  Trash2,
  TrendingUp,
  Truck,
  Utensils,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { StatCard, StatusDot } from "@/components/prithvix/stat-card";
import { DemandChart } from "@/components/prithvix/charts";
import { DEMAND_7DAY, RECENT_ACTIVITY } from "@/lib/demo-data";
import { useDemo, type DonationItem, type FoodClaimRequest } from "@/lib/demo-store";

export const Route = createFileRoute("/provider")({
  head: () => ({
    meta: [
      { title: "Food Provider Dashboard — Prithvi Food Rescue" },
      {
        name: "description",
        content:
          "Manage active food donations, review and approve recipient claim requests, and track rescue pickups alongside demand forecasts.",
      },
      { property: "og:title", content: "Food Provider Dashboard — Prithvi Food Rescue" },
      {
        property: "og:description",
        content:
          "Manage surplus food donations, review incoming claims, and track live rescues.",
      },
    ],
  }),
  component: ProviderDashboard,
});

export function ProviderDashboard() {
  const {
    snapshot,
    prediction,
    donations,
    requests,
    updateRequestStatus,
    deleteDonation,
    setActiveRequestId,
    currentUser,
  } = useDemo();
  const navigate = useNavigate();

  // Filter donations belonging to this logged-in provider (fallback to all if demo account)
  const isCurrentDonor = React.useCallback(
    (donorName: string) => {
      if (!currentUser) return true;
      const org = currentUser.org?.toLowerCase() || "";
      const name = currentUser.name?.toLowerCase() || "";
      const dName = donorName.toLowerCase();
      return (org && dName.includes(org)) || (name && dName.includes(name));
    },
    [currentUser],
  );

  const providerDonations = React.useMemo(() => {
    const mine = donations.filter((d) => isCurrentDonor(d.donorName));
    return mine.length > 0 ? mine : donations;
  }, [donations, isCurrentDonor]);

  // Associated recipient claim requests
  const providerRequests = React.useMemo(() => {
    const matched = requests.filter((r) => {
      const matchDon = providerDonations.some((d) => d.id === r.donationId);
      const matchProv = isCurrentDonor(r.provider);
      return matchDon || matchProv;
    });
    return matched.length > 0 ? matched : requests;
  }, [requests, providerDonations, isCurrentDonor]);

  // Computed metrics
  const availableDonationsCount = providerDonations.filter((d) => d.status === "Available").length;
  const pendingRequestsCount = providerRequests.filter((r) => r.status === "Requested").length;
  const totalFoodRescuedKg = providerDonations
    .filter((d) => d.status === "Collected" || d.status === "Requested")
    .reduce((sum, d) => sum + d.quantityKg, 0);

  const providerName =
    currentUser?.org || currentUser?.name || "Sunrise Campus Kitchen";

  // Provider Action: Approve claim
  async function handleApproveClaim(req: FoodClaimRequest) {
    await updateRequestStatus(req.id, "Approved", 2);
    toast.success(`Claim for "${req.foodName}" approved!`, {
      description: `Notified ${req.recipientOrg}. Food is now marked ready for pickup.`,
    });
  }

  // Provider Action: Hand off / mark In Transit
  async function handleHandOff(req: FoodClaimRequest) {
    await updateRequestStatus(req.id, "In transit", 3);
    setActiveRequestId(req.id);
    toast.success(`Food handed over for "${req.foodName}"!`, {
      description: "Rescue consignment is now In Transit.",
    });
    navigate({ to: "/tracking" });
  }

  // Provider Action: Decline claim
  async function handleDeclineClaim(req: FoodClaimRequest) {
    await updateRequestStatus(req.id, "Cancelled", 1);
    toast.info(`Claim request from ${req.recipientOrg} declined.`, {
      description: "Listing restored to available status for other recipients.",
    });
  }

  // Provider Action: Track live rescue
  function handleTrackRequest(req: FoodClaimRequest) {
    setActiveRequestId(req.id);
    navigate({ to: "/tracking" });
  }

  // Provider Action: Withdraw listing
  function handleWithdrawDonation(donation: DonationItem) {
    deleteDonation(donation.id);
    toast.success(`Donation "${donation.foodName}" withdrawn from listings.`);
  }

  return (
    <AppShell
      title="Food Provider Dashboard"
      subtitle={`${providerName} · Food Rescue Operations`}
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/donate">
              <PlusCircle className="mr-1.5 size-4 text-primary" /> Donate food
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/surplus">
              Report surplus <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      }
    >
      {/* KPI Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active food listings"
          value={`${availableDonationsCount} listings`}
          hint="Available for recipient NGOs"
          icon={PackageSearch}
          tone="leaf"
        />
        <StatCard
          label="Pending claim requests"
          value={`${pendingRequestsCount} requests`}
          hint={pendingRequestsCount > 0 ? "Requires provider approval" : "All claims addressed"}
          icon={HeartHandshake}
          tone={pendingRequestsCount > 0 ? "harvest" : "cool"}
        />
        <StatCard
          label="Food rescued / committed"
          value={`${totalFoodRescuedKg} kg`}
          hint={`≈ ${Math.round(totalFoodRescuedKg * 4)} meals redirected`}
          icon={Utensils}
          tone="leaf"
        />
        <StatCard
          label="Expected daily demand"
          value={`${snapshot.expectedDemand} meals`}
          hint="AI forecast for today"
          icon={TrendingUp}
          tone="cool"
        />
      </div>

      {/* SECTION 1: INCOMING RECIPIENT CLAIM REQUESTS */}
      <Card className="mt-6 border-primary/20 shadow-xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-5 text-primary" aria-hidden="true" />
              <CardTitle className="text-lg">Incoming Recipient Claims & Rescues</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Review and approve food requests from verified recipient shelters, NGOs, and community
              kitchens.
            </CardDescription>
          </div>
          {pendingRequestsCount > 0 && (
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              {pendingRequestsCount} Action Required
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {providerRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-8 text-center">
              <HeartHandshake className="mx-auto size-9 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium">No claim requests yet</p>
              <p className="text-xs text-muted-foreground">
                When recipient NGOs claim your donated food, requests will appear here for approval.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food Item</TableHead>
                    <TableHead>Recipient Organization</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Pickup Window</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{req.foodName}</span>
                          <span className="text-xs text-muted-foreground">{req.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{req.recipientOrg}</span>
                          <span className="text-xs text-muted-foreground">{req.recipientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{req.quantityKg} kg</span>
                        <span className="ml-1 text-xs text-muted-foreground">({req.meals} meals)</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="size-3.5 text-primary" />
                          <span>ETA {req.eta}</span>
                        </div>
                        {req.notes && (
                          <p className="mt-0.5 max-w-xs truncate text-[11px] text-muted-foreground/80 italic">
                            "{req.notes}"
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {req.status === "Requested" && (
                          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            Pending Approval
                          </Badge>
                        )}
                        {req.status === "Approved" && (
                          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            Approved · Ready
                          </Badge>
                        )}
                        {req.status === "In transit" && (
                          <Badge variant="outline" className="border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
                            In Transit
                          </Badge>
                        )}
                        {req.status === "Delivered" && (
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            Delivered
                          </Badge>
                        )}
                        {req.status === "Cancelled" && (
                          <Badge variant="secondary" className="text-muted-foreground">
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {req.status === "Requested" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeclineClaim(req)}
                              >
                                <XCircle className="mr-1 size-3.5" /> Decline
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => handleApproveClaim(req)}
                              >
                                <CheckCircle2 className="mr-1 size-3.5" /> Approve
                              </Button>
                            </>
                          )}
                          {req.status === "Approved" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs"
                                onClick={() => handleTrackRequest(req)}
                              >
                                <MapPin className="mr-1 size-3.5" /> Track
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleHandOff(req)}
                              >
                                <Truck className="mr-1 size-3.5" /> Hand Over
                              </Button>
                            </>
                          )}
                          {(req.status === "In transit" || req.status === "Delivered") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => handleTrackRequest(req)}
                            >
                              <ExternalLink className="mr-1 size-3.5" /> View Tracking
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: MY FOOD DONATIONS & SURPLUS LISTINGS */}
      <Card className="mt-6 border-border/70 shadow-xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" aria-hidden="true" />
              <CardTitle className="text-lg">My Food Donations & Listings</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Active food surplus posted from your kitchen, available for recipient discovery and
              pickup.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="w-fit">
            <Link to="/donate">
              <PlusCircle className="mr-1.5 size-4" /> New Donation
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {providerDonations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-8 text-center">
              <PackageSearch className="mx-auto size-9 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium">No active food donations</p>
              <p className="text-xs text-muted-foreground">
                Post surplus meals to connect with nearby shelters and prevent food waste.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link to="/donate">Post food donation</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {providerDonations.map((don) => (
                <div
                  key={don.id}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground">{don.foodName}</p>
                      <Badge
                        variant={don.status === "Available" ? "default" : "outline"}
                        className={
                          don.status === "Available"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "border-primary/40 text-primary"
                        }
                      >
                        {don.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {don.quantityKg} kg ({don.meals} meals)
                      </span>
                      <span>·</span>
                      <span>{don.category}</span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary shrink-0" />
                        <span>Prep: {don.preparedAt} · Exp: {don.expiresAt}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{don.pickupLocation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                    <span className="text-muted-foreground">{don.storage}</span>
                    {don.status === "Available" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-destructive hover:bg-destructive/10"
                        onClick={() => handleWithdrawDonation(don)}
                        title="Withdraw listing"
                      >
                        <Trash2 className="size-3.5 mr-1" /> Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: DEMAND PREDICTION & RECOMMENDATIONS */}
      <Card className="mt-6 border-primary/25 bg-primary-soft/30 shadow-xs">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              Kitchen Demand Recommendation
            </CardTitle>
            <DemoBadge label={`Forecast Confidence ${snapshot.confidence}%`} />
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
              Calculated forecast based on consumption history and current kitchen profile factors.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: 7-DAY DEMAND CHART & RECENT ACTIVITY */}
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
            <CardTitle className="text-base">Recent rescue activity</CardTitle>
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
