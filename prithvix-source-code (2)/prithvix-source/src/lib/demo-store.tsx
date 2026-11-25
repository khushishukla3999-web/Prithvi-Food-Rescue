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

export type DonationItem = {
  id: string;
  foodName: string;
  quantityKg: number;
  meals: number;
  category: string;
  pickupLocation: string;
  preparedAt: string;
  expiresAt: string;
  storage: string;
  donorName: string;
  donorContact?: string;
  notes?: string;
  status: "Available" | "Requested" | "Collected";
  distanceKm?: number;
  createdAt: number;
};

export type NewDonationInput = {
  foodName: string;
  quantityKg: number;
  category: string;
  pickupLocation: string;
  preparedAt: string;
  expiresAt: string;
  storage?: string;
  donorName?: string;
  donorContact?: string;
  notes?: string;
};

export const INITIAL_DONATIONS: DonationItem[] = [
  {
    id: "d1",
    foodName: "Veg pulao & dal",
    quantityKg: 18,
    meals: 72,
    category: "Cooked Meals",
    pickupLocation: "Sunrise Campus Kitchen, Sector 4, Pune",
    preparedAt: "12:15 PM",
    expiresAt: "8:30 PM",
    storage: "Hot holding, 65°C",
    donorName: "Sunrise Campus Kitchen",
    donorContact: "+91 98230 11223",
    notes: "Freshly prepared lunch batch, packed in insulated warm containers.",
    status: "Available",
    distanceKm: 2.1,
    createdAt: 1709400000000,
  },
  {
    id: "d2",
    foodName: "Assorted sandwiches",
    quantityKg: 9,
    meals: 36,
    category: "Bakery & Snacks",
    pickupLocation: "Metro Tech Park Cafeteria, Hinjawadi Phase 1",
    preparedAt: "1:00 PM",
    expiresAt: "7:00 PM",
    storage: "Chilled, 4°C",
    donorName: "Metro Tech Park Cafeteria",
    donorContact: "+91 97654 33210",
    notes: "Individually wrapped vegetarian sandwiches from lunch buffet.",
    status: "Available",
    distanceKm: 3.9,
    createdAt: 1709400000000,
  },
  {
    id: "d3",
    foodName: "Paneer curry & rotis",
    quantityKg: 26,
    meals: 104,
    category: "Cooked Meals",
    pickupLocation: "Hotel Vaishnavi Banquets, Shivajinagar",
    preparedAt: "2:30 PM",
    expiresAt: "10:00 PM",
    storage: "Hot holding, 70°C",
    donorName: "Hotel Vaishnavi Banquets",
    donorContact: "+91 98901 44556",
    notes: "Unserved banquet food, pristine condition in stainless steel containers.",
    status: "Available",
    distanceKm: 5.6,
    createdAt: 1709400000000,
  },
];

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

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  org: string;
  createdAt: number;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
  role: RoleId;
  org?: string;
};

export const DEFAULT_DEMO_USERS: Record<RoleId, AuthUser & { password: string }> = {
  provider: {
    id: "u-provider",
    name: "Ananya Rao",
    email: "ananya@sunrisekitchen.org",
    role: "provider",
    org: "Sunrise Campus Kitchen",
    password: "password123",
    createdAt: 1709400000000,
  },
  recipient: {
    id: "u-recipient",
    name: "Ravi Menon",
    email: "ravi@annapurnatrust.org",
    role: "recipient",
    org: "Annapurna Seva Trust",
    password: "password123",
    createdAt: 1709400000000,
  },
  volunteer: {
    id: "u-volunteer",
    name: "Kabir Shah",
    email: "kabir@prithvixfleet.org",
    role: "volunteer",
    org: "PrithviX Rescue Fleet",
    password: "password123",
    createdAt: 1709400000000,
  },
  admin: {
    id: "u-admin",
    name: "Meera Iyer",
    email: "meera@prithvix.org",
    role: "admin",
    org: "PrithviX Network Ops",
    password: "password123",
    createdAt: 1709400000000,
  },
};

type Ctx = {
  currentUser: AuthUser | null;
  role: RoleId | null;
  roleMeta: (typeof ROLES)[number] | null;
  setRole: (r: RoleId | null) => void;
  login: (email: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  signup: (data: SignupInput) => { success: boolean; error?: string; user?: AuthUser };
  loginAsDemoRole: (role: RoleId) => void;
  logout: () => void;
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
  donations: DonationItem[];
  addDonation: (
    input: NewDonationInput,
  ) => Promise<{ success: boolean; error?: string; donation?: DonationItem }>;
  requestDonation: (id: string) => void;
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
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);
  const [role, setRoleState] = React.useState<RoleId | null>(null);
  const [prediction, setPrediction] = React.useState<PredictionState>(defaultPrediction);
  const [surplus, setSurplus] = React.useState<SurplusRecord | null>(DEFAULT_SURPLUS);
  const [matchedId, setMatchedId] = React.useState<string | null>(null);
  const [trackingStage, setTrackingStage] = React.useState(1);
  const [donations, setDonations] = React.useState<DonationItem[]>(INITIAL_DONATIONS);

  React.useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("prithvix-current-user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as AuthUser;
        if (parsed && parsed.role) {
          setCurrentUser(parsed);
          setRoleState(parsed.role);
          return;
        }
      }

      const storedRole = window.localStorage.getItem("prithvix-role") as RoleId | null;
      if (storedRole && ROLES.some((r) => r.id === storedRole)) {
        setRoleState(storedRole);
        const demoUser = DEFAULT_DEMO_USERS[storedRole];
        if (demoUser) {
          setCurrentUser({
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            org: demoUser.org,
            createdAt: demoUser.createdAt,
          });
        }
      }
    } catch (e) {
      console.warn("Could not read auth from localStorage:", e);
    }
  }, []);

  const setRole = React.useCallback((r: RoleId | null) => {
    setRoleState(r);
    if (r) {
      window.localStorage.setItem("prithvix-role", r);
      setCurrentUser((prev) => {
        if (prev && prev.role === r) return prev;
        const demo = DEFAULT_DEMO_USERS[r];
        const nextUser: AuthUser = {
          id: demo?.id ?? `u-${r}`,
          name: demo?.name ?? "Demo User",
          email: demo?.email ?? `${r}@prithvifoodrescue.org`,
          role: r,
          org: demo?.org ?? "Demo Organisation",
          createdAt: Date.now(),
        };
        try {
          window.localStorage.setItem("prithvix-current-user", JSON.stringify(nextUser));
        } catch (_e) {
          // ignore storage error
        }
        return nextUser;
      });
    } else {
      window.localStorage.removeItem("prithvix-role");
      window.localStorage.removeItem("prithvix-current-user");
      setCurrentUser(null);
    }
  }, []);

  const loginAsDemoRole = React.useCallback((targetRole: RoleId) => {
    const demo = DEFAULT_DEMO_USERS[targetRole];
    const user: AuthUser = {
      id: demo.id,
      name: demo.name,
      email: demo.email,
      role: demo.role,
      org: demo.org,
      createdAt: demo.createdAt,
    };
    setCurrentUser(user);
    setRoleState(targetRole);
    try {
      window.localStorage.setItem("prithvix-role", targetRole);
      window.localStorage.setItem("prithvix-current-user", JSON.stringify(user));
    } catch (_e) {
      // ignore storage error
    }
  }, []);

  const login = React.useCallback(
    (email: string, password: string): { success: boolean; error?: string; user?: AuthUser } => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanEmail || !cleanPass) {
        return { success: false, error: "Please enter both email and password." };
      }

      // Check default demo users
      const demoMatch = (
        Object.values(DEFAULT_DEMO_USERS) as (AuthUser & { password: string })[]
      ).find((u) => u.email.toLowerCase() === cleanEmail);
      if (demoMatch) {
        if (
          cleanPass === demoMatch.password ||
          cleanPass === "demo123" ||
          cleanPass === "password123"
        ) {
          const user: AuthUser = {
            id: demoMatch.id,
            name: demoMatch.name,
            email: demoMatch.email,
            role: demoMatch.role,
            org: demoMatch.org,
            createdAt: demoMatch.createdAt,
          };
          setCurrentUser(user);
          setRoleState(user.role);
          try {
            window.localStorage.setItem("prithvix-role", user.role);
            window.localStorage.setItem("prithvix-current-user", JSON.stringify(user));
          } catch (_e) {
            // ignore storage error
          }
          return { success: true, user };
        }
        return { success: false, error: "Incorrect password for demo user. Hint: password123" };
      }

      // Check registered users in localStorage
      try {
        const storedUsersRaw = window.localStorage.getItem("prithvix-registered-users");
        const storedUsers = storedUsersRaw
          ? (JSON.parse(storedUsersRaw) as (AuthUser & { password: string })[])
          : [];
        const match = storedUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (match) {
          if (match.password === cleanPass) {
            const user: AuthUser = {
              id: match.id,
              name: match.name,
              email: match.email,
              role: match.role,
              org: match.org,
              createdAt: match.createdAt,
            };
            setCurrentUser(user);
            setRoleState(user.role);
            window.localStorage.setItem("prithvix-role", user.role);
            window.localStorage.setItem("prithvix-current-user", JSON.stringify(user));
            return { success: true, user };
          }
          return { success: false, error: "Incorrect password. Please try again." };
        }
      } catch (err) {
        console.error("Error checking registered users:", err);
      }

      return {
        success: false,
        error:
          "No account found with this email. Please check your credentials or create a new account.",
      };
    },
    [],
  );

  const signup = React.useCallback(
    (input: SignupInput): { success: boolean; error?: string; user?: AuthUser } => {
      const cleanEmail = input.email.trim().toLowerCase();
      const cleanName = input.name.trim();
      const cleanPass = input.password.trim();

      if (!cleanName || cleanName.length < 2) {
        return { success: false, error: "Please enter your full name." };
      }
      if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
        return { success: false, error: "Please provide a valid email address." };
      }
      if (!cleanPass || cleanPass.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      if (!ROLES.some((r) => r.id === input.role)) {
        return { success: false, error: "Please select an account role." };
      }

      // Check if email already exists
      const demoExists = (Object.values(DEFAULT_DEMO_USERS) as AuthUser[]).some(
        (u) => u.email.toLowerCase() === cleanEmail,
      );
      if (demoExists) {
        return {
          success: false,
          error: "An account with this email already exists. Try logging in.",
        };
      }

      try {
        const storedUsersRaw = window.localStorage.getItem("prithvix-registered-users");
        const storedUsers = storedUsersRaw
          ? (JSON.parse(storedUsersRaw) as (AuthUser & { password: string })[])
          : [];
        if (storedUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
          return { success: false, error: "An account with this email is already registered." };
        }

        const newUserRecord: AuthUser & { password: string } = {
          id: `u-${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          password: cleanPass,
          role: input.role,
          org: input.org?.trim() || `${cleanName}'s Organisation`,
          createdAt: Date.now(),
        };

        storedUsers.push(newUserRecord);
        window.localStorage.setItem("prithvix-registered-users", JSON.stringify(storedUsers));

        const user: AuthUser = {
          id: newUserRecord.id,
          name: newUserRecord.name,
          email: newUserRecord.email,
          role: newUserRecord.role,
          org: newUserRecord.org,
          createdAt: newUserRecord.createdAt,
        };

        setCurrentUser(user);
        setRoleState(user.role);
        window.localStorage.setItem("prithvix-role", user.role);
        window.localStorage.setItem("prithvix-current-user", JSON.stringify(user));

        return { success: true, user };
      } catch (err) {
        console.error("Error creating user:", err);
        return { success: false, error: "Failed to create account. Please try again." };
      }
    },
    [],
  );

  const logout = React.useCallback(() => {
    setCurrentUser(null);
    setRoleState(null);
    try {
      window.localStorage.removeItem("prithvix-role");
      window.localStorage.removeItem("prithvix-current-user");
    } catch (_e) {
      // ignore storage error
    }
  }, []);

  const addDonation = React.useCallback(
    async (
      input: NewDonationInput,
    ): Promise<{ success: boolean; error?: string; donation?: DonationItem }> => {
      const meals = Math.round(input.quantityKg * 4);
      const newDonation: DonationItem = {
        id: `don-${Date.now()}`,
        foodName: input.foodName.trim(),
        quantityKg: Number(input.quantityKg),
        meals,
        category: input.category || "Cooked Meals",
        pickupLocation: input.pickupLocation.trim(),
        preparedAt: input.preparedAt,
        expiresAt: input.expiresAt,
        storage: input.storage || "Ambient, covered trays",
        donorName:
          input.donorName?.trim() ||
          currentUser?.org ||
          currentUser?.name ||
          "Community Food Donor",
        donorContact: input.donorContact?.trim() || "",
        notes: input.notes?.trim() || "",
        status: "Available",
        distanceKm: 1.8,
        createdAt: Date.now(),
      };

      // Connect to existing backend if configured; do not create fake data persistence
      const backendUrl =
        typeof import.meta !== "undefined" && import.meta.env
          ? ((import.meta.env["VITE_API_URL"] || import.meta.env["VITE_BACKEND_URL"]) as
              string | undefined)
          : undefined;

      if (backendUrl) {
        try {
          const res = await fetch(`${backendUrl}/api/donations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDonation),
          });
          if (!res.ok) {
            console.warn("Backend API responded with status:", res.status);
          }
        } catch (err) {
          console.warn("Backend API endpoint unreachable:", err);
        }
      }

      setDonations((prev) => [newDonation, ...prev]);
      return { success: true, donation: newDonation };
    },
    [currentUser],
  );

  const requestDonation = React.useCallback((id: string) => {
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, status: "Requested" } : d)));
  }, []);

  const value: Ctx = {
    currentUser,
    role,
    roleMeta: ROLES.find((r) => r.id === role) ?? null,
    setRole,
    login,
    signup,
    loginAsDemoRole,
    logout,
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
      setDonations(INITIAL_DONATIONS);
    },
    snapshot: PROVIDER_SNAPSHOT,
    donations,
    addDonation,
    requestDonation,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
