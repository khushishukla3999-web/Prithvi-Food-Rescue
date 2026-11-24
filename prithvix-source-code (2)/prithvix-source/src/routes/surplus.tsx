import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2, PackagePlus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AppShell } from "@/components/prithvix/app-shell";
import { DemoBadge } from "@/components/prithvix/brand";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/surplus")({
  head: () => ({
    meta: [
      { title: "Surplus Management — PrithviX" },
      {
        name: "description",
        content:
          "Log leftover food with quantity, preparation time and storage handling, then move straight into recipient matching.",
      },
      { property: "og:title", content: "Surplus Management — PrithviX" },
      {
        property: "og:description",
        content: "Record what remains in under a minute and start the rescue.",
      },
    ],
  }),
  component: SurplusPage,
});

const STORAGE = [
  "Hot holding, 65°C",
  "Hot holding, 70°C",
  "Chilled, 4°C",
  "Ambient, covered trays",
  "Freshly packed, sealed boxes",
];

type Phase = "form" | "confirmed" | "searching" | "ready";

function SurplusPage() {
  const { recordSurplus, surplus } = useDemo();
  const navigate = useNavigate();
  const [phase, setPhase] = React.useState<Phase>("form");
  const [form, setForm] = React.useState({
    item: "Veg pulao & dal tadka",
    quantityKg: 18,
    preparedAt: "12:15",
    currentTime: "18:40",
    storage: STORAGE[0]!,
    notes: "Sealed trays, unserved from counter 2.",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    recordSurplus({
      item: form.item,
      quantityKg: Number(form.quantityKg) || 0,
      preparedAt: form.preparedAt,
      currentTime: form.currentTime,
      storage: form.storage,
      notes: form.notes,
    });
    setPhase("confirmed");
    toast.success("Surplus recorded successfully.");
    window.setTimeout(() => setPhase("searching"), 900);
    window.setTimeout(() => setPhase("ready"), 3000);
  }

  return (
    <AppShell title="Surplus Management" subtitle="Log what remains after service">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PackagePlus className="size-4 text-primary" aria-hidden="true" /> Report surplus food
            </CardTitle>
            <DemoBadge />
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="item">Food item</Label>
                <Input
                  id="item"
                  required
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  placeholder="e.g. Veg pulao & dal"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity (kg)</Label>
                  <Input
                    id="qty"
                    type="number"
                    min={1}
                    step="0.5"
                    required
                    value={form.quantityKg}
                    onChange={(e) => setForm({ ...form, quantityKg: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Handling / storage status</Label>
                  <Select
                    value={form.storage}
                    onValueChange={(v) => setForm({ ...form, storage: v })}
                  >
                    <SelectTrigger id="storage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORAGE.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prepared">Preparation time</Label>
                  <Input
                    id="prepared"
                    type="time"
                    required
                    value={form.preparedAt}
                    onChange={(e) => setForm({ ...form, preparedAt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="now">Current time</Label>
                  <Input
                    id="now"
                    type="time"
                    required
                    value={form.currentTime}
                    onChange={(e) => setForm({ ...form, currentTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes for the recipient</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Packaging, allergens, collection instructions…"
                />
              </div>

              <Button type="submit" className="w-full" disabled={phase !== "form"}>
                {phase === "form" ? "Record surplus" : "Surplus recorded"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {phase === "form" ? (
            <Card className="h-full border-dashed">
              <CardContent className="flex h-full flex-col justify-center gap-2 py-12 text-center">
                <p className="font-display text-lg font-semibold">Nothing submitted yet</p>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Once you record surplus, PrithviX checks eligible verified recipients nearby and
                  moves you into smart matching.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-success/40">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                  <p className="font-semibold">Surplus recorded successfully.</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                  <p className="font-medium">{surplus?.item}</p>
                  <p className="mt-1 text-muted-foreground">
                    {surplus?.quantityKg} kg · approx. {surplus?.meals} meals · {surplus?.storage}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Prepared {surplus?.preparedAt} · logged {surplus?.currentTime}
                  </p>
                  {surplus?.notes && (
                    <p className="mt-2 text-muted-foreground">“{surplus.notes}”</p>
                  )}
                </div>

                <div className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {phase === "ready" ? (
                      <Search className="size-4 text-primary" aria-hidden="true" />
                    ) : (
                      <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
                    )}
                    {phase === "ready"
                      ? "4 eligible recipients found"
                      : "Checking eligible recipients…"}
                  </div>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Filtering verified recipients within 8 km",
                      "Checking storage capacity and availability windows",
                      "Scoring on distance, capacity, urgency and availability",
                    ].map((line, i) => {
                      const done = phase === "ready" || (phase === "searching" && i === 0);
                      return (
                        <li key={line} className="flex items-center gap-2">
                          <span
                            className={`size-1.5 rounded-full ${done ? "bg-success" : "bg-muted-foreground/40"}`}
                            aria-hidden="true"
                          />
                          {line}
                        </li>
                      );
                    })}
                  </ol>
                  <Button
                    className="w-full"
                    disabled={phase !== "ready"}
                    onClick={() => navigate({ to: "/matching" })}
                  >
                    View matched recipients <ArrowRight className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
