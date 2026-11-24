import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, ShieldCheck, Truck, Users2, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { WasteTrendChart } from "@/components/prithvix/charts";
import { ADMIN_USERS, WASTE_TREND } from "@/lib/demo-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — PrithviX" },
      {
        name: "description",
        content:
          "Network overview of registered providers, verified recipients, redistributions and waste prevented, with user management controls.",
      },
      { property: "og:title", content: "Admin Dashboard — PrithviX" },
      {
        property: "og:description",
        content: "Verification queue, user management and network-wide impact in one console.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [users, setUsers] = React.useState(ADMIN_USERS);
  const [query, setQuery] = React.useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()),
  );
  const pending = users.filter((u) => u.status === "Pending").length;

  function setStatus(id: string, status: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    toast.success(`Status updated to ${status}`, {
      description: "Demo action — nothing is verified live.",
    });
  }

  return (
    <AppShell title="Admin Dashboard" subtitle="PrithviX Network Ops · Pune region">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Registered providers"
          value="148"
          hint="+6 this month"
          icon={Building2}
          tone="cool"
        />
        <StatCard
          label="Verified recipients"
          value="96"
          hint={`${pending} pending verification`}
          icon={BadgeCheck}
          tone="leaf"
        />
        <StatCard
          label="Active redistributions"
          value="12"
          hint="Across 4 zones"
          icon={Truck}
          tone="harvest"
        />
        <StatCard
          label="Completed redistributions"
          value="3,472"
          hint="All time"
          icon={ShieldCheck}
        />
        <StatCard
          label="Waste prevented (network)"
          value="18.4 t"
          hint="All time · Demo Data"
          icon={Leaf}
          tone="leaf"
        />
        <StatCard label="Volunteers on duty" value="37" hint="Live shift roster" icon={Users2} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">User management & verification</CardTitle>
              <p className="text-sm text-muted-foreground">
                Approve, suspend or reinstate organisations in the demo network.
              </p>
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or role…"
              className="sm:w-56"
              aria-label="Search users"
            />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation / person</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.city} · joined {u.joined}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusDot status={u.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={u.status === "Verified"}
                          onClick={() => setStatus(u.id, "Verified")}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={u.status === "Suspended"}
                          onClick={() => setStatus(u.id, "Suspended")}
                        >
                          Suspend
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No matching users.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <p className="mt-3 text-xs text-muted-foreground">
              Verification here is a demo control only — no documents or licences are checked.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Network waste trend (kg / month)</CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <WasteTrendChart data={WASTE_TREND} />
            <p className="mt-3 text-xs text-muted-foreground">
              Downward trend reflects seeded sample data across all registered kitchens.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
