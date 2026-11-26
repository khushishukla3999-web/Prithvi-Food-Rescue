import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  HeartHandshake,
  MapPin,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { RECIPIENT_COMPLETED } from "@/lib/demo-data";
import { useDemo, type DonationItem, type FoodClaimRequest } from "@/lib/demo-store";

export const Route = createFileRoute("/recipient")({
  head: () => ({
    meta: [
      { title: "Food Discovery & Recipient Dashboard — PrithviX" },
      {
        name: "description",
        content:
          "Discover available food donations, filter by category and location, request meals for your shelter or kitchen, and track rescue status.",
      },
      { property: "og:title", content: "Food Discovery & Recipient Dashboard — PrithviX" },
      {
        property: "og:description",
        content: "Browse available food donations and claim surplus meals in real-time.",
      },
    ],
  }),
  component: RecipientDashboard,
});

const FOOD_CATEGORIES = [
  "Cooked Meals",
  "Bakery & Breads",
  "Fresh Produce (Fruits & Veg)",
  "Packaged & Canned Goods",
  "Dairy & Refrigerated",
  "Beverages & Juices",
  "Grains, Rice & Pulses",
];

function RecipientDashboard() {
  const {
    donations,
    requests,
    claimDonation,
    updateRequestStatus,
    setActiveRequestId,
    currentUser,
  } = useDemo();
  const navigate = useNavigate();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Claim Dialog State
  const [claimingDonation, setClaimingDonation] = React.useState<DonationItem | null>(null);
  const [requestedKg, setRequestedKg] = React.useState<number>(0);
  const [claimNotes, setClaimNotes] = React.useState<string>("");
  const [isClaiming, setIsClaiming] = React.useState<boolean>(false);

  // Filtered available food donations
  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && d.status === "Available") ||
      (statusFilter === "requested" && d.status !== "Available");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const availableCount = donations.filter((d) => d.status === "Available").length;
  const activeRequests = requests.filter((r) => r.status !== "Cancelled");
  const completedDeliveries = requests.filter((r) => r.status === "Delivered");

  // Open Claim Dialog
  function openClaimModal(donation: DonationItem) {
    setClaimingDonation(donation);
    setRequestedKg(donation.quantityKg);
    setClaimNotes("");
  }

  // Submit Claim Request
  async function handleConfirmClaim() {
    if (!claimingDonation) return;

    if (requestedKg <= 0 || requestedKg > claimingDonation.quantityKg) {
      toast.error(`Please enter a quantity between 0.5 kg and ${claimingDonation.quantityKg} kg.`);
      return;
    }

    setIsClaiming(true);
    try {
      const res = await claimDonation(claimingDonation.id, {
        requestedKg,
        notes: claimNotes,
      });

      if (res.success && res.request) {
        toast.success(`Food request placed for ${claimingDonation.foodName}!`, {
          description: `Requested ${requestedKg} kg from ${claimingDonation.donorName}. Provider has been notified.`,
        });
        setClaimingDonation(null);
      } else {
        toast.error(res.error || "Could not claim this food item. Please try again.");
      }
    } catch (_err) {
      toast.error("Failed to submit claim request. Please check your connection.");
    } finally {
      setIsClaiming(false);
    }
  }

  // Quick Action to Track Request
  function trackRequest(request: FoodClaimRequest) {
    setActiveRequestId(request.id);
    toast.info(`Opening live tracking for ${request.foodName}`, {
      description: `Current status: ${request.status} · ETA ${request.eta}`,
    });
    navigate({ to: "/tracking" });
  }

  // Quick Action to Advance Status (Simulation for demo & testing)
  async function handleAdvanceStatus(req: FoodClaimRequest) {
    let nextStatus: FoodClaimRequest["status"] = "Approved";
    let nextStage = req.trackingStage + 1;

    if (req.trackingStage === 1) {
      nextStatus = "Approved";
      nextStage = 2;
    } else if (req.trackingStage === 2) {
      nextStatus = "In transit";
      nextStage = 3;
    } else if (req.trackingStage === 3) {
      nextStatus = "In transit";
      nextStage = 4;
    } else if (req.trackingStage >= 4) {
      nextStatus = "Delivered";
      nextStage = 5;
    }

    await updateRequestStatus(req.id, nextStatus, nextStage);
    toast.success(`Updated status for ${req.foodName} to ${nextStatus}`, {
      description: nextStage === 5 ? "Consignment delivery completed!" : `Stage ${nextStage} of 5.`,
    });
  }

  return (
    <AppShell
      title="Recipient Dashboard & Discovery"
      subtitle={`${currentUser?.org || "Annapurna Seva Trust"} · Verified Community Recipient`}
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/donate">
              <HeartHandshake className="mr-1.5 size-4 text-primary" /> Donate food
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/tracking">
              <Truck className="mr-1.5 size-4" /> Live Tracking
            </Link>
          </Button>
        </div>
      }
    >
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Available to claim"
          value={availableCount}
          hint="From verified donors right now"
          tone="leaf"
        />
        <StatCard
          label="Active requests"
          value={activeRequests.length}
          hint={`${requests.filter((r) => r.status === "In transit").length} in transit`}
          tone="harvest"
        />
        <StatCard
          label="Meals distributed"
          value={288 + completedDeliveries.reduce((acc, r) => acc + r.meals, 0)}
          hint="All time through network"
        />
        <StatCard
          label="Storage capacity free"
          value="20 kg"
          hint="Hot holding + chilled"
          tone="cool"
        />
      </div>

      {/* FOOD DISCOVERY & CLAIM SYSTEM */}
      <Card className="mt-6 border-primary/25 shadow-xs">
        <CardHeader className="gap-3 border-b border-border/60 pb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                <Sparkles className="size-5 text-primary" />
                Food Discovery & Claim System
              </CardTitle>
              <CardDescription className="text-xs">
                Browse nearby surplus meals, search by food name, filter by category, and claim
                portions for immediate pickup.
              </CardDescription>
            </div>
            <DemoBadge label="Live Discovery Feed" />
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-2 grid gap-3 sm:grid-cols-12">
            {/* Search Input */}
            <div className="relative sm:col-span-6 lg:col-span-5">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by food name, donor, or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3 lg:col-span-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {FOOD_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability Filter */}
            <div className="sm:col-span-3 lg:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="requested">Already Claimed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Filter className="size-3 text-primary" /> Active filters:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Food: "{searchQuery}"
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Category: {categoryFilter}
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Status: {statusFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                <RotateCcw className="mr-1 size-3" /> Reset filters
              </Button>
            </div>
          )}
        </CardHeader>

        {/* Discovery Grid */}
        <CardContent className="pt-6">
          {filteredDonations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <PackageCheck className="mx-auto size-10 text-muted-foreground/60" />
              <p className="mt-3 font-display text-base font-semibold text-foreground">
                No matching food donations found
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                Try searching for another food item or reset your category and status filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDonations.map((d) => {
                const isAvailable = d.status === "Available";
                return (
                  <div
                    key={d.id}
                    className="food-card-hover flex flex-col justify-between rounded-xl border border-border bg-card p-4.5 transition-all shadow-2xs"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="mb-2 flex items-start justify-between gap-1.5">
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/5 text-[11px] font-medium text-primary"
                        >
                          {d.category}
                        </Badge>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isAvailable
                              ? "bg-success/15 text-success"
                              : "bg-harvest/15 text-harvest"
                          }`}
                        >
                          {isAvailable ? "Available" : "Claimed"}
                        </span>
                      </div>

                      {/* Food Title & Donor */}
                      <p className="font-display text-base font-bold text-foreground line-clamp-1">
                        {d.foodName}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Provider: <span className="text-foreground">{d.donorName}</span>
                      </p>

                      {/* Details List */}
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <p className="flex items-center gap-2 font-medium text-foreground">
                          <PackageCheck
                            className="size-4 text-primary shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {d.quantityKg} kg · approx. {d.meals} meals
                          </span>
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="size-4 text-harvest shrink-0" aria-hidden="true" />
                          <span>Consume by: {d.expiresAt}</span>
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="size-4 text-sky-cool shrink-0" aria-hidden="true" />
                          <span className="truncate">
                            {d.distanceKm ? `${d.distanceKm} km · ` : ""}
                            {d.pickupLocation}
                          </span>
                        </p>
                      </div>

                      {/* Storage Condition & Notes */}
                      <div className="mt-3 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
                        <p>
                          <span className="font-semibold text-foreground">Storage:</span>{" "}
                          {d.storage}
                        </p>
                        {d.notes && (
                          <p className="mt-1 border-t border-border/40 pt-1 italic">"{d.notes}"</p>
                        )}
                      </div>
                    </div>

                    {/* Claim Button */}
                    <div className="mt-4 pt-1">
                      {isAvailable ? (
                        <Button
                          className="w-full text-xs font-semibold"
                          onClick={() => openClaimModal(d)}
                        >
                          <PackageCheck className="mr-1.5 size-4" /> Request Available Food
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="secondary" className="w-full text-xs" disabled>
                            Claimed / In Transit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs shrink-0"
                            onClick={() => {
                              const relatedReq = requests.find((r) => r.donationId === d.id);
                              if (relatedReq) {
                                trackRequest(relatedReq);
                              } else {
                                navigate({ to: "/tracking" });
                              }
                            }}
                          >
                            Track
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ACTIVE REQUESTS & STATUS TRACKING SECTION */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold">
                Active Requests & Status Tracking ({activeRequests.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Live consignments requested by your organisation
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/tracking">
                Full map <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeRequests.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Truck className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                No active food requests at this time.
                <p className="text-xs mt-1">
                  Use the Discovery section above to browse and request available meals.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Consignment</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRequests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <p className="font-semibold text-foreground text-sm">{r.foodName}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.provider} · <span className="text-[11px]">{r.pickupLocation}</span>
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">{r.quantityKg} kg</span>
                          <span className="block text-[11px] text-muted-foreground">
                            ≈ {r.meals} meals
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <StatusDot status={r.status} />
                            <span className="text-[10px] text-muted-foreground">
                              ETA {r.eta} · Stage {r.trackingStage}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => trackRequest(r)}
                            >
                              Track
                            </Button>
                            {r.status !== "Delivered" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-xs text-primary"
                                onClick={() => handleAdvanceStatus(r)}
                                title="Simulate advancing to next logistics status"
                              >
                                Step →
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

        {/* COMPLETED DISTRIBUTIONS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Completed Distributions</CardTitle>
            <CardDescription className="text-xs">
              Past rescued food successfully received & distributed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Meals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Dynamically completed items from requests state */}
                {completedDeliveries.map((c) => (
                  <TableRow key={c.id} className="bg-success/5">
                    <TableCell className="text-xs font-medium text-success">Today</TableCell>
                    <TableCell>
                      <p className="font-medium">{c.foodName}</p>
                      <p className="text-xs text-muted-foreground">{c.provider}</p>
                    </TableCell>
                    <TableCell>{c.quantityKg} kg</TableCell>
                    <TableCell className="text-right font-medium text-success">{c.meals}</TableCell>
                  </TableRow>
                ))}
                {/* Historical baseline records */}
                {RECIPIENT_COMPLETED.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>
                      <p className="font-medium">{c.item}</p>
                      <p className="text-xs text-muted-foreground">{c.provider}</p>
                    </TableCell>
                    <TableCell>{c.qtyKg} kg</TableCell>
                    <TableCell className="text-right font-medium">{c.meals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* CLAIM CONFIRMATION DIALOG */}
      <Dialog open={!!claimingDonation} onOpenChange={(open) => !open && setClaimingDonation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <PackageCheck className="size-5 text-primary" /> Request Food Donation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your request details. The food provider will be immediately notified to
              prepare for collection or dispatch.
            </DialogDescription>
          </DialogHeader>

          {claimingDonation && (
            <div className="space-y-4 py-2 text-sm">
              {/* Item Summary Card */}
              <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">
                    {claimingDonation.foodName}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {claimingDonation.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Provider:{" "}
                  <span className="font-medium text-foreground">{claimingDonation.donorName}</span>
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-sky-cool" /> {claimingDonation.pickupLocation}
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-harvest" /> Consume by:{" "}
                  {claimingDonation.expiresAt}
                </p>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reqQty" className="text-xs font-semibold">
                    Requested Quantity (kg)
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Max available: {claimingDonation.quantityKg} kg
                  </span>
                </div>
                <Input
                  id="reqQty"
                  type="number"
                  min="0.5"
                  max={claimingDonation.quantityKg}
                  step="0.5"
                  value={requestedKg}
                  onChange={(e) => setRequestedKg(Number(e.target.value))}
                />
                <p className="text-[11px] font-medium text-primary">
                  ≈ {Math.round(requestedKg * 4)} meals for community distribution
                </p>
              </div>

              {/* Authenticated Recipient Attribution */}
              <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs">
                <p className="font-semibold text-primary flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> Authenticated Recipient
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  Claiming as:{" "}
                  <span className="font-medium text-foreground">
                    {currentUser?.name || "Ravi Menon"}
                  </span>{" "}
                  ({currentUser?.org || "Annapurna Seva Trust"})
                </p>
              </div>

              {/* Notes for donor */}
              <div className="space-y-1.5">
                <Label htmlFor="claimNotes" className="text-xs font-semibold">
                  Pickup / Vehicle Note (optional)
                </Label>
                <Textarea
                  id="claimNotes"
                  rows={2}
                  placeholder="e.g. Arriving in clean insulated van with 2 volunteers within 30 mins."
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setClaimingDonation(null)}
              disabled={isClaiming}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmClaim}
              disabled={isClaiming}
              className="gap-1.5"
            >
              {isClaiming ? (
                "Submitting request…"
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Confirm & Request Food
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
