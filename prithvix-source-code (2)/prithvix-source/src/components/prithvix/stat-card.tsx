import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string | undefined;
  icon?: React.ElementType | undefined;
  tone?: "default" | "leaf" | "harvest" | "cool" | undefined;
  className?: string | undefined;
}) {
  const toneRing = {
    default: "bg-muted text-muted-foreground",
    leaf: "bg-primary-soft text-primary",
    harvest: "bg-accent text-accent-foreground",
    cool: "bg-secondary text-secondary-foreground",
  }[tone];

  return (
    <Card className={cn("gap-0 py-4 transition-shadow hover:shadow-md", className)}>
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {Icon && (
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", toneRing)}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
          )}
        </div>
        <p className="mt-2 font-display text-2xl font-semibold tabular-nums sm:text-3xl">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    Delivered: "bg-success",
    Completed: "bg-success",
    Verified: "bg-success",
    "Available now": "bg-success",
    "In progress": "bg-harvest",
    "In transit": "bg-harvest",
    Pending: "bg-harvest",
    "Pickup requested": "bg-sky-cool",
    Assigned: "bg-sky-cool",
    Suspended: "bg-destructive",
  };
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className={cn("size-2 rounded-full", map[status] ?? "bg-muted-foreground")}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
