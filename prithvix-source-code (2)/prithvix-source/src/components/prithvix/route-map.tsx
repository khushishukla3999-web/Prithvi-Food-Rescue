import { MapPin, Navigation, Store } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Local, dependency-free "map-style" route visualisation.
 * Purely illustrative geometry — no external map service.
 */
export function RouteMap({
  from,
  to,
  distanceKm,
  etaMin,
  progress = 0,
  legs,
  className,
}: {
  from: string;
  to: string;
  distanceKm: number;
  etaMin: number;
  progress?: number;
  legs?: string[];
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  const path = "M 40 190 C 110 150, 90 90, 170 88 S 280 120, 360 46";
  const dash = 420;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="relative surface-grid bg-secondary/40">
        <svg viewBox="0 0 400 220" className="h-56 w-full sm:h-64" role="img" aria-label={`Illustrative route from ${from} to ${to}`}>
          <path d="M0 160 H400" stroke="var(--color-border)" strokeWidth="10" opacity="0.5" />
          <path d="M240 0 V220" stroke="var(--color-border)" strokeWidth="8" opacity="0.5" />
          <path d="M0 60 H400" stroke="var(--color-border)" strokeWidth="6" opacity="0.35" />
          <circle cx="80" cy="60" r="26" fill="var(--color-primary-soft)" opacity="0.7" />
          <circle cx="320" cy="170" r="34" fill="var(--color-accent)" opacity="0.6" />

          <path d={path} stroke="var(--color-border)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path
            d={path}
            stroke="var(--color-primary)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={dash}
            strokeDashoffset={dash * (1 - clamped)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />

          <g>
            <circle cx="40" cy="190" r="9" fill="var(--color-primary)" />
            <circle cx="40" cy="190" r="15" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.35" />
          </g>
          <g>
            <circle cx="360" cy="46" r="9" fill="var(--color-harvest)" />
            <circle cx="360" cy="46" r="15" fill="none" stroke="var(--color-harvest)" strokeWidth="2" opacity="0.4" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-card/95 px-2.5 py-1 font-medium shadow-sm">
            {distanceKm} km road distance
          </span>
          <span className="rounded-full bg-card/95 px-2.5 py-1 font-medium shadow-sm">ETA {etaMin} min</span>
          <span className="rounded-full bg-card/95 px-2.5 py-1 font-medium shadow-sm">
            Illustrative route · not a live map
          </span>
        </div>
      </div>

      <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <Store className="mt-0.5 size-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">Food provider</p>
            <p className="text-sm font-medium">{from}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 text-harvest" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">Recipient</p>
            <p className="text-sm font-medium">{to}</p>
          </div>
        </div>
        {legs && (
          <div className="sm:col-span-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Navigation className="size-3.5" aria-hidden="true" />
            {legs.map((leg, i) => (
              <span key={leg} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">→</span>}
                <span>{leg}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
