import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none">
          <path
            d="M12 21c0-6 3.5-9.5 8-10.5C20 16 16.5 20 12 21Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M12 21C7.5 20 4 16 4 10.5 8.5 11.5 12 15 12 21Z"
            fill="currentColor"
            opacity="0.55"
          />
          <circle cx="12" cy="5" r="2.5" fill="currentColor" />
        </svg>
      </span>
      {!mark && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Prithvi<span className="text-leaf">X</span>
        </span>
      )}
    </span>
  );
}

export function DemoBadge({
  label = "Demo Data",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-harvest/40 bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-harvest" aria-hidden="true" />
      {label}
    </span>
  );
}
