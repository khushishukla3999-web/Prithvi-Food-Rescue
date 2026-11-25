import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, HeartHandshake, MapPin, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { RECIPIENT_COMPLETED, RECIPIENT_REQUESTS } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/recipient")({
  head: () => ({
    meta: [
      { title: "Recipient Dashboard — PrithviX" },
      {
        name: "description",
        content:
          "Nearby available donations with quantity, deadline and distance, plus active requests and completed distributions.",
      },
      { property: "og:title", content: "Recipient Dashboard — PrithviX" },
      {
        property: "og:description",
        content: "Claim nearby surplus and track what your organisation has already distributed.",
      },
    ],
  }),
  component: RecipientDashboard,
});

function RecipientDashboard() {
  const { donations, requestDonation } = useDemo();
  const navigate = useNavigate();

  return (
    <AppShell
      title="Recipient Dashboard"
      subtitle="Annapurna Seva Trust · community kitchen"
      actions={
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link to="/donate">
            <HeartHandshake className="mr-1.5 size-4 text-primary" /> Donate food
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Available nearby"
          value={donations.length}
          hint="Within 8 km right now"
          tone="leaf"
        />
        <StatCard
          label="Active requests"
          value={RECIPIENT_REQUESTS.length}
          hint="Awaiting pickup or in transit"
          tone="harvest"
        />
        <StatCard label="Meals distributed" value="288" hint="Last 7 days" />
        <StatCard
          label="Storage capacity free"
          value="20 kg"
          hint="Hot holding + chilled"
          tone="cool"
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Nearby available donations</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live donations from verified providers and community kitchens
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {donations.map((d) => (
            <div
              key={d.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 food-card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                    {d.category}
                  </Badge>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      d.status === "Available"
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-sm font-semibold">{d.foodName}</p>
                <p className="text-xs text-muted-foreground">{d.donorName}</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="flex items-center gap-2">
                    <PackageCheck className="size-4 text-primary" aria-hidden="true" />{" "}
                    {d.quantityKg} kg · ≈ {d.meals} meals
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="size-4 text-harvest" aria-hidden="true" /> Collect by{" "}
                    {d.expiresAt}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-sky-cool" aria-hidden="true" />{" "}
                    {d.distanceKm ? `${d.distanceKm} km away` : d.pickupLocation}
                  </p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Storage: {d.storage}</p>
                {d.notes && (
                  <p className="mt-1 text-xs italic text-muted-foreground">"{d.notes}"</p>
                )}
              </div>

              <Button
                className="mt-4 w-full"
                disabled={d.status !== "Available"}
                onClick={() => {
                  requestDonation(d.id);
                  toast.success(`Requested ${d.quantityKg} kg from ${d.donorName}`, {
                    description: "Donor notified — opening tracking.",
                  });
                  window.setTimeout(() => navigate({ to: "/tracking" }), 700);
                }}
              >
                {d.status === "Available" ? "Request" : d.status}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECIPIENT_REQUESTS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium">{r.item}</p>
                      <p className="text-xs text-muted-foreground">{r.provider}</p>
                    </TableCell>
                    <TableCell>{r.qtyKg} kg</TableCell>
                    <TableCell>
                      <StatusDot status={r.status} />
                    </TableCell>
                    <TableCell className="text-right">{r.eta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate({ to: "/tracking" })}
            >
              Open tracking
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completed distributions</CardTitle>
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
    </AppShell>
  );
}
