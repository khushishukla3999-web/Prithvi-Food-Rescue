import * as React from "react";
import {
  MENU_OPTIONS,
  PROVIDER_SNAPSHOT,
  RECIPIENTS,
  ROLES,
  type Recipient,
  type RoleId,
} from "./demo-data";

export type SurplusRecord = {
  id: string;
  item: string;
  quantityKg: number;
  meals: number;
  preparedAt: string;
  currentTime: string;
  storage: string;
  notes: string;
  createdAt: number;
};

export type PredictionState = {
  attendance: number;
  menu: string;
  weekday: string;
  holiday: boolean;
  event: string;
  predicted: number;
  recommended: number;
  confidence: number;
};

const WEEKDAY_FACTOR: Record<string, number> = {
  Monday: 0.96,
  Tuesday: 0.99,
  Wednesday: 0.94,
  Thursday: 1.02,
  Friday: 1.09,
  Saturday: 0.76,
  Sunday: 1,
};

const EVENT_FACTOR: Record<string, number> = {
  none: 1,
  seminar: 1.08,
  sports: 1.14,
  exam: 0.88,
};

export function computePrediction(input: {
  attendance: number;
  menu: string;
  weekday: string;
  holiday: boolean;
  event: string;
}) {
  const menuFactor = MENU_OPTIONS.find((m) => m.id === input.menu)?.factor ?? 1;
  const weekdayFactor = WEEKDAY_FACTOR[input.weekday] ?? 1;
  const eventFactor = EVENT_FACTOR[input.event] ?? 1;
  const holidayFactor = input.holiday ? 0.72 : 1;
  const predicted = Math.round(
    input.attendance * 0.8632 * menuFactor * weekdayFactor * eventFactor * holidayFactor,
  );
  const recommended = Math.round(predicted * 0.9634);
  const spread = Math.abs(1 - menuFactor) + Math.abs(1 - eventFactor) + (input.holiday ? 0.1 : 0);
  const confidence = Math.max(74, Math.min(94, Math.round(91 - spread * 42)));
  return { predicted, recommended, confidence };
}

const DEFAULT_PREDICTION_INPUT = {
  attendance: 950,
  menu: "standard",
  weekday: "Sunday",
  holiday: false,
  event: "none",
};

const defaultPrediction: PredictionState = {
  ...DEFAULT_PREDICTION_INPUT,
  ...computePrediction(DEFAULT_PREDICTION_INPUT),
};

type Ctx = {
  role: RoleId | null;
  roleMeta: (typeof ROLES)[number] | null;
  setRole: (r: RoleId | null) => void;
  prediction: PredictionState;
  updatePrediction: (p: Partial<PredictionState>) => void;
  recalculate: (input: Omit<PredictionState, "predicted" | "recommended" | "confidence">) => void;
  surplus: SurplusRecord | null;
  recordSurplus: (s: Omit<SurplusRecord, "id" | "createdAt" | "meals">) => void;
  matchedRecipient: Recipient | null;
  selectRecipient: (id: string) => void;
  trackingStage: number;
  setTrackingStage: (n: number) => void;
  advanceTracking: () => void;
  resetFlow: () => void;
  snapshot: typeof PROVIDER_SNAPSHOT;
};

const DemoContext = React.createContext<Ctx | null>(null);

const DEFAULT_SURPLUS: SurplusRecord = {
  id: "s-demo",
  item: "Veg pulao & dal tadka",
  quantityKg: 18,
  meals: 72,
  preparedAt: "12:15 PM",
  currentTime: "6:40 PM",
  storage: "Hot holding, 65°C",
  notes: "Sealed trays, unserved from counter 2.",
  createdAt: Date.now(),
};

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<RoleId | null>(null);
  const [prediction, setPrediction] = React.useState<PredictionState>(defaultPrediction);
  const [surplus, setSurplus] = React.useState<SurplusRecord | null>(DEFAULT_SURPLUS);
  const [matchedId, setMatchedId] = React.useState<string | null>(null);
  const [trackingStage, setTrackingStage] = React.useState(1);

  React.useEffect(() => {
    const stored = window.localStorage.getItem("prithvix-role") as RoleId | null;
    if (stored && ROLES.some((r) => r.id === stored)) setRoleState(stored);
  }, []);

  const setRole = React.useCallback((r: RoleId | null) => {
    setRoleState(r);
    if (r) window.localStorage.setItem("prithvix-role", r);
    else window.localStorage.removeItem("prithvix-role");
  }, []);

  const value: Ctx = {
    role,
    roleMeta: ROLES.find((r) => r.id === role) ?? null,
    setRole,
    prediction,
    updatePrediction: (p) => setPrediction((prev) => ({ ...prev, ...p })),
    recalculate: (input) => setPrediction({ ...input, ...computePrediction(input) }),
    surplus,
    recordSurplus: (s) =>
      setSurplus({
        ...s,
        meals: Math.round(s.quantityKg * 4),
        id: `s-${Date.now()}`,
        createdAt: Date.now(),
      }),
    matchedRecipient: RECIPIENTS.find((r) => r.id === matchedId) ?? null,
    selectRecipient: (id) => {
      setMatchedId(id);
      setTrackingStage(3);
    },
    trackingStage,
    setTrackingStage,
    advanceTracking: () => setTrackingStage((s) => Math.min(5, s + 1)),
    resetFlow: () => {
      setSurplus(DEFAULT_SURPLUS);
      setMatchedId(null);
      setTrackingStage(1);
    },
    snapshot: PROVIDER_SNAPSHOT,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
