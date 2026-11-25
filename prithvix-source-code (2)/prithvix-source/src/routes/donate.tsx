import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Info,
  MapPin,
  PackageCheck,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Food Donation — Prithvi Food Rescue" },
      {
        name: "description",
        content:
          "Donate surplus and freshly prepared food to verified local community kitchens and shelters. Quick, secure, and transparent.",
      },
      { property: "og:title", content: "Food Donation — Prithvi Food Rescue" },
      {
        property: "og:description",
        content: "Donate food to save waste and feed those in need in your local area.",
      },
    ],
  }),
  component: DonatePage,
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

const STORAGE_OPTIONS = [
  "Hot holding, 65°C+",
  "Chilled, 4°C",
  "Ambient, covered & sealed trays",
  "Freshly packed individual boxes",
  "Dry pantry storage",
];

interface FormErrors {
  foodName?: string | undefined;
  quantityKg?: string | undefined;
  category?: string | undefined;
  pickupLocation?: string | undefined;
  preparedAt?: string | undefined;
  expiresAt?: string | undefined;
}

function DonatePage() {
  const { donations, addDonation, currentUser } = useDemo();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    foodName: "",
    quantityKg: "",
    category: FOOD_CATEGORIES[0]!,
    pickupLocation: currentUser?.org ? `${currentUser.org}, Pune` : "",
    preparedAt: "",
    expiresAt: "",
    storage: STORAGE_OPTIONS[0]!,
    donorName: currentUser?.name || currentUser?.org || "",
    donorContact: "",
    notes: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Default time initializers if empty
  React.useEffect(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // 4 hours ahead for recommended expiry window
    const expiryTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const expiryTimeStr = `${pad(expiryTime.getHours())}:${pad(expiryTime.getMinutes())}`;

    setForm((prev) => ({
      ...prev,
      preparedAt: prev.preparedAt || currentTimeStr,
      expiresAt: prev.expiresAt || expiryTimeStr,
      donorName: prev.donorName || currentUser?.name || currentUser?.org || "Community Food Donor",
    }));
  }, [currentUser]);

  const numQuantity = Number(form.quantityKg) || 0;
  const estimatedMeals = Math.round(numQuantity * 4);

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.foodName.trim() || form.foodName.trim().length < 3) {
      nextErrors.foodName = "Please enter food name (at least 3 characters).";
    }

    if (!form.quantityKg || numQuantity <= 0) {
      nextErrors.quantityKg = "Please enter a positive food quantity in kilograms.";
    }

    if (!form.category) {
      nextErrors.category = "Please select a food category.";
    }

    if (!form.pickupLocation.trim() || form.pickupLocation.trim().length < 5) {
      nextErrors.pickupLocation = "Please specify a detailed pickup location or address.";
    }

    if (!form.preparedAt) {
      nextErrors.preparedAt = "Please enter preparation time.";
    }

    if (!form.expiresAt) {
      nextErrors.expiresAt = "Please enter expiry or consume-by deadline.";
    } else if (form.preparedAt && form.expiresAt === form.preparedAt) {
      nextErrors.expiresAt = "Expiry time must be after preparation time.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addDonation({
        foodName: form.foodName,
        quantityKg: numQuantity,
        category: form.category,
        pickupLocation: form.pickupLocation,
        preparedAt: form.preparedAt,
        expiresAt: form.expiresAt,
        storage: form.storage,
        donorName: form.donorName || "Community Food Donor",
        donorContact: form.donorContact,
        notes: form.notes,
      });

      if (res.success) {
        toast.success("Food donation submitted successfully!", {
          description: `${form.foodName} (${form.quantityKg} kg) is now available for recipient pickup.`,
        });

        // Reset form to ready state
        setForm((prev) => ({
          ...prev,
          foodName: "",
          quantityKg: "",
          notes: "",
        }));
        setErrors({});
      } else {
        toast.error(res.error || "Failed to submit donation. Please try again.");
      }
    } catch (_err) {
      toast.error("An unexpected error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredDonations = donations.filter((d) => {
    const matchCat = filterCategory === "all" || d.category === filterCategory;
    const matchQuery =
      searchQuery === "" ||
      d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <AppShell
      title="Food Donation"
      subtitle="Donate surplus and fresh food to verified community kitchens & shelters"
      actions={
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <a href="#submitted-donations">
            View Live Feed ({donations.length}) <ArrowRight className="size-4" />
          </a>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* LEFT COLUMN: Food Donation Form */}
        <Card className="border-primary/20 shadow-xs">
          <CardHeader className="flex-row items-center justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <HeartHandshake className="size-5 text-primary" aria-hidden="true" />
                Food Donation Form
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in the food details. Nearby verified NGOs and kitchens will be notified
                immediately.
              </CardDescription>
            </div>
            <DemoBadge />
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Food Name & Category */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="foodName" className="text-sm font-medium">
                      Food item name <span className="text-destructive">*</span>
                    </Label>
                    {errors.foodName && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="size-3.5" /> {errors.foodName}
                      </span>
                    )}
                  </div>
                  <Input
                    id="foodName"
                    placeholder="e.g. Steamed Rice & Dal Tadka, Fresh Chapati"
                    value={form.foodName}
                    onChange={(e) => {
                      setForm({ ...form, foodName: e.target.value });
                      if (errors.foodName) setErrors({ ...errors, foodName: undefined });
                    }}
                    className={
                      errors.foodName ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quantityKg" className="text-sm font-medium">
                        Quantity (kg) <span className="text-destructive">*</span>
                      </Label>
                      {errors.quantityKg && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="size-3.5" /> Required
                        </span>
                      )}
                    </div>
                    <Input
                      id="quantityKg"
                      type="number"
                      step="0.5"
                      min="0.5"
                      placeholder="e.g. 15"
                      value={form.quantityKg}
                      onChange={(e) => {
                        setForm({ ...form, quantityKg: e.target.value });
                        if (errors.quantityKg) setErrors({ ...errors, quantityKg: undefined });
                      }}
                      className={
                        errors.quantityKg ? "border-destructive focus-visible:ring-destructive" : ""
                      }
                    />
                    {numQuantity > 0 && (
                      <p className="text-xs font-medium text-primary">
                        ≈ {estimatedMeals} meals (calculated @ 250g per meal)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Food category <span className="text-destructive">*</span>
                      </Label>
                      {errors.category && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="size-3.5" /> Required
                        </span>
                      )}
                    </div>
                    <Select
                      value={form.category}
                      onValueChange={(val) => {
                        setForm({ ...form, category: val });
                        if (errors.category) setErrors({ ...errors, category: undefined });
                      }}
                    >
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {FOOD_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pickupLocation" className="text-sm font-medium">
                    Pickup location / address <span className="text-destructive">*</span>
                  </Label>
                  {errors.pickupLocation && (
                    <span className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3.5" /> {errors.pickupLocation}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="pickupLocation"
                    placeholder="e.g. Sunrise Campus Kitchen, Gate 2, Pune"
                    value={form.pickupLocation}
                    onChange={(e) => {
                      setForm({ ...form, pickupLocation: e.target.value });
                      if (errors.pickupLocation)
                        setErrors({ ...errors, pickupLocation: undefined });
                    }}
                    className={`pl-9 ${errors.pickupLocation ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
              </div>

              {/* Timing: Preparation & Expiry Times */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="preparedAt" className="text-sm font-medium">
                      Preparation time <span className="text-destructive">*</span>
                    </Label>
                    {errors.preparedAt && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="size-3.5" /> Required
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="preparedAt"
                      type="time"
                      value={form.preparedAt}
                      onChange={(e) => {
                        setForm({ ...form, preparedAt: e.target.value });
                        if (errors.preparedAt) setErrors({ ...errors, preparedAt: undefined });
                      }}
                      className={`pl-9 ${errors.preparedAt ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expiresAt" className="text-sm font-medium">
                      Expiry / best before <span className="text-destructive">*</span>
                    </Label>
                    {errors.expiresAt && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="size-3.5" /> {errors.expiresAt}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-2.5 size-4 text-harvest" />
                    <Input
                      id="expiresAt"
                      type="time"
                      value={form.expiresAt}
                      onChange={(e) => {
                        setForm({ ...form, expiresAt: e.target.value });
                        if (errors.expiresAt) setErrors({ ...errors, expiresAt: undefined });
                      }}
                      className={`pl-9 ${errors.expiresAt ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {/* Storage Handling & Donor Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storage" className="text-sm font-medium">
                    Handling / storage condition
                  </Label>
                  <Select
                    value={form.storage}
                    onValueChange={(val) => setForm({ ...form, storage: val })}
                  >
                    <SelectTrigger id="storage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorContact" className="text-sm font-medium">
                    Contact number (optional)
                  </Label>
                  <Input
                    id="donorContact"
                    placeholder="e.g. +91 98765 43210"
                    value={form.donorContact}
                    onChange={(e) => setForm({ ...form, donorContact: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Special notes & handling instructions
                </Label>
                <Textarea
                  id="notes"
                  rows={2}
                  placeholder="Allergens, packaging details, gate entry pass instructions, etc."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="size-4 text-primary" /> Food Safety Pledge
                </p>
                <p className="mt-1">
                  By submitting, you confirm that this food has been stored in compliant hygienic
                  conditions and is safe for human consumption.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-base font-medium"
              >
                {isSubmitting ? (
                  "Submitting donation…"
                ) : (
                  <>
                    <PlusCircle className="mr-2 size-4" /> Submit Food Donation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Live Card Preview & Info */}
        <div className="space-y-6">
          {/* Card Preview */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" /> Live Card Preview
              </CardTitle>
              <CardDescription className="text-xs">
                How recipients and delivery volunteers will see your donation listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-primary/30 bg-card p-4 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 bg-primary/10 text-primary border-primary/20 text-[11px]"
                    >
                      {form.category || "Cooked Meals"}
                    </Badge>
                    <p className="text-base font-bold text-foreground">
                      {form.foodName || "Your Food Item"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Donor: {form.donorName || "Community Food Donor"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-success/15 text-success font-medium">
                    Available Now
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <PackageCheck className="size-4 text-primary" />
                    <span>
                      {numQuantity > 0 ? `${numQuantity} kg` : "— kg"} · approx.{" "}
                      {estimatedMeals > 0 ? `${estimatedMeals} meals` : "— meals"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 text-harvest" />
                    <span>
                      Prepared: {form.preparedAt || "—"} · Consume by: {form.expiresAt || "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4 text-sky-cool" />
                    <span className="truncate">
                      {form.pickupLocation || "Pickup address not set"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-md bg-muted/60 p-2 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Storage:</span> {form.storage}
                  {form.notes && (
                    <p className="mt-1 italic border-t border-border/50 pt-1">"{form.notes}"</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Info */}
          <Card className="bg-primary-soft/40 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Utensils className="size-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    Zero Waste, Maximum Reach
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Every donation is logged with temperature handling and verified timestamps.
                    PrithviX algorithm matches surplus to the nearest verified NGO within 30
                    minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SUBMITTED DONATIONS SECTION */}
      <section id="submitted-donations" className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Submitted Donations ({filteredDonations.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Live list of available food donations active across the network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search food, donor, location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 text-xs"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {FOOD_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <Info className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 font-medium text-foreground">No matching donations found</p>
            <p className="text-xs text-muted-foreground">
              Submit your first food donation using the form above to get started.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.map((d) => (
              <Card
                key={d.id}
                className="food-card-hover flex flex-col justify-between border-border transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[11px] font-normal">
                      {d.category}
                    </Badge>
                    <Badge
                      variant={d.status === "Available" ? "default" : "secondary"}
                      className={
                        d.status === "Available"
                          ? "bg-success/15 text-success hover:bg-success/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {d.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-base font-semibold">{d.foodName}</CardTitle>
                  <CardDescription className="text-xs">
                    By <span className="font-medium text-foreground">{d.donorName}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <PackageCheck className="size-4 text-primary" />
                    <span>
                      {d.quantityKg} kg · approx. {d.meals} meals
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 text-harvest" />
                    <span>
                      Prepared: {d.preparedAt} · Expiry: {d.expiresAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4 text-sky-cool" />
                    <span className="truncate">{d.pickupLocation}</span>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                    <span className="font-medium">Storage:</span> {d.storage}
                  </p>

                  {d.notes && (
                    <p className="italic text-[11px] text-muted-foreground">"{d.notes}"</p>
                  )}

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        toast.info(`Viewing details for ${d.foodName}`, {
                          description: `Pickup location: ${d.pickupLocation}`,
                        });
                        navigate({ to: "/recipient" });
                      }}
                    >
                      View in Recipient Dashboard <ArrowRight className="ml-1 size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
