import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { NEARBY_DONATIONS, RECIPIENT_COMPLETED, RECIPIENT_REQUESTS } from "@/lib/demo-data";

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
  const navigate = useNavigate();

  return (
    <AppShell title="Recipient Dashboard" subtitle="Annapurna Seva Trust · community kitchen">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Available nearby" value={NEARBY_DONATIONS.length} hint="Within 8 km right now" tone="leaf" />
        <StatCard label="Active requests" value={RECIPIENT_REQUESTS.length} hint="Awaiting pickup or in transit" tone="harvest" />
        <StatCard label="Meals distributed" value="288" hint="Last 7 days" />
        <StatCard label="Storage capacity free" value="20 kg" hint="Hot holding + chilled" tone="cool" />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <CardTitle className="text-base">Nearby available donations</CardTitle>
          <DemoBadge />
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {NEARBY_DONATIONS.map((d) => (
            <div key={d.id} className="flex flex-col rounded-xl border border-border p-4">
              <p className="text-sm font-semibold">{d.item}</p>
              <p className="text-xs text-muted-foreground">{d.provider}</p>
              <div className="mt-3 space-y-1.5 text-sm">
                <p className="flex items-center gap-2">
                  <PackageCheck className="size-4 text-primary" aria-hidden="true" /> {d.qtyKg} kg · ≈{" "}
                  {d.qtyKg * 4} meals
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="size-4 text-harvest" aria-hidden="true" /> Collect by {d.deadline}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-sky-cool" aria-hidden="true" /> {d.distanceKm} km away
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{d.storage}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  toast.success(`Requested ${d.qtyKg} kg from ${d.provider}`, {
                    description: "Provider notified — opening tracking.",
                  });
                  window.setTimeout(() => navigate({ to: "/tracking" }), 700);
                }}
              >
                Request
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
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate({ to: "/tracking" })}>
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
