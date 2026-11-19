/**
 * PrithviX — seeded DEMO DATA.
 * Every number in this file is illustrative sample data for a prototype.
 * Nothing here comes from a live model, live verification, or an external API.
 */

export type RoleId = "provider" | "recipient" | "volunteer" | "admin";

export const BRAND = {
  name: "PrithviX",
  tagline: "Predict. Prevent. Rescue. Redistribute.",
  message: "Prepare what is needed. Rescue what remains.",
};

export const ROLES: {
  id: RoleId;
  label: string;
  blurb: string;
  demoUser: string;
  org: string;
  home: string;
}[] = [
  {
    id: "provider",
    label: "Food Provider",
    blurb: "Campus kitchens, canteens, caterers and cloud kitchens.",
    demoUser: "Ananya Rao",
    org: "Sunrise Campus Kitchen",
    home: "/provider",
  },
  {
    id: "recipient",
    label: "Recipient / NGO",
    blurb: "Verified shelters and community kitchens receiving surplus.",
    demoUser: "Ravi Menon",
    org: "Annapurna Seva Trust",
    home: "/recipient",
  },
  {
    id: "volunteer",
    label: "Volunteer / Delivery Partner",
    blurb: "Riders and volunteers running pickups and drops.",
    demoUser: "Kabir Shah",
    org: "PrithviX Rescue Fleet",
    home: "/volunteer",
  },
  {
    id: "admin",
    label: "Admin",
    blurb: "Network oversight, verification and user management.",
    demoUser: "Meera Iyer",
    org: "PrithviX Network Ops",
    home: "/admin",
  },
];

export const PROVIDER_SNAPSHOT = {
  expectedDemand: 820,
  recommendedPrep: 790,
  actualServed: 775,
  surplusMeals: 15,
  wastePreventedKg: 42.5,
  confidence: 91,
};

export const DEMAND_7DAY = [
  { day: "Mon", predicted: 780, actual: 764, prepared: 770 },
  { day: "Tue", predicted: 805, actual: 792, prepared: 800 },
  { day: "Wed", predicted: 760, actual: 741, prepared: 755 },
  { day: "Thu", predicted: 838, actual: 826, prepared: 830 },
  { day: "Fri", predicted: 902, actual: 889, prepared: 900 },
  { day: "Sat", predicted: 610, actual: 588, prepared: 605 },
  { day: "Sun", predicted: 820, actual: 775, prepared: 790 },
];

export const WASTE_TREND = [
  { month: "Feb", waste: 128, rescued: 210 },
  { month: "Mar", waste: 112, rescued: 265 },
  { month: "Apr", waste: 96, rescued: 312 },
  { month: "May", waste: 84, rescued: 358 },
  { month: "Jun", waste: 71, rescued: 402 },
  { month: "Jul", waste: 58, rescued: 466 },
  { month: "Aug", waste: 47, rescued: 528 },
];

export const IMPACT_CARDS = [
  { label: "Food waste prevented", value: "1,284 kg", delta: "+12.4% vs last month" },
  { label: "Meals rescued", value: "5,140", delta: "+8.1% vs last month" },
  { label: "Food recovered", value: "1,072 kg", delta: "+9.6% vs last month" },
  { label: "Estimated cost saved", value: "₹3,86,400", delta: "+11.2% vs last month" },
  { label: "Average rescue time", value: "38 min", delta: "-6 min vs last month" },
  { label: "Prediction accuracy", value: "91%", delta: "sample model score" },
];

export type Recipient = {
  id: string;
  org: string;
  type: string;
  distanceKm: number;
  capacityKg: number;
  availability: string;
  available: boolean;
  matchScore: number;
  etaMin: number;
  urgency: "High" | "Medium" | "Low";
  contact: string;
  verifiedSince: string;
};

export const RECIPIENTS: Recipient[] = [
  {
    id: "r1",
    org: "Annapurna Seva Trust",
    type: "Community kitchen",
    distanceKm: 2.1,
    capacityKg: 20,
    availability: "Available now",
    available: true,
    matchScore: 94,
    etaMin: 18,
    urgency: "High",
    contact: "Ravi Menon",
    verifiedSince: "Mar 2024",
  },
  {
    id: "r2",
    org: "Sahara Night Shelter",
    type: "Night shelter",
    distanceKm: 3.4,
    capacityKg: 35,
    availability: "Available now",
    available: true,
    matchScore: 88,
    etaMin: 24,
    urgency: "High",
    contact: "Farida Khan",
    verifiedSince: "Aug 2023",
  },
  {
    id: "r3",
    org: "Roti Bank Collective",
    type: "Redistribution hub",
    distanceKm: 5.2,
    capacityKg: 60,
    availability: "Available in 30 min",
    available: true,
    matchScore: 81,
    etaMin: 33,
    urgency: "Medium",
    contact: "Imran Qureshi",
    verifiedSince: "Jan 2025",
  },
  {
    id: "r4",
    org: "Bal Asha Children's Home",
    type: "Children's home",
    distanceKm: 6.8,
    capacityKg: 15,
    availability: "Available after 8:00 PM",
    available: false,
    matchScore: 67,
    etaMin: 41,
    urgency: "Low",
    contact: "Sneha Patil",
    verifiedSince: "Nov 2024",
  },
];

export const RECENT_ACTIVITY = [
  { time: "12 min ago", text: "Surplus of 15 meals recorded after lunch service", tone: "info" },
  { time: "48 min ago", text: "Annapurna Seva Trust confirmed pickup of 18 kg", tone: "good" },
  { time: "2 h ago", text: "Preparation recommendation lowered by 30 meals for Sunday", tone: "info" },
  { time: "Yesterday", text: "Sahara Night Shelter received 22 kg — 88 meals served", tone: "good" },
  { time: "2 days ago", text: "Waste prevented crossed 1,200 kg for this kitchen", tone: "good" },
];

export const NEARBY_DONATIONS = [
  {
    id: "d1",
    provider: "Sunrise Campus Kitchen",
    item: "Veg pulao & dal",
    qtyKg: 18,
    deadline: "Today, 8:30 PM",
    distanceKm: 2.1,
    storage: "Hot holding, 65°C",
  },
  {
    id: "d2",
    provider: "Metro Tech Park Cafeteria",
    item: "Assorted sandwiches",
    qtyKg: 9,
    deadline: "Today, 7:00 PM",
    distanceKm: 3.9,
    storage: "Chilled, 4°C",
  },
  {
    id: "d3",
    provider: "Hotel Vaishnavi Banquets",
    item: "Paneer curry & rotis",
    qtyKg: 26,
    deadline: "Today, 10:00 PM",
    distanceKm: 5.6,
    storage: "Hot holding, 70°C",
  },
];

export const RECIPIENT_REQUESTS = [
  { id: "q1", item: "Veg biryani", qtyKg: 22, provider: "Green Leaf Caterers", status: "In transit", eta: "16 min" },
  { id: "q2", item: "Khichdi", qtyKg: 12, provider: "Sunrise Campus Kitchen", status: "Pickup requested", eta: "34 min" },
];

export const RECIPIENT_COMPLETED = [
  { id: "c1", date: "30 Aug", item: "Mixed thali", qtyKg: 24, meals: 96, provider: "Sunrise Campus Kitchen" },
  { id: "c2", date: "29 Aug", item: "Vegetable curry", qtyKg: 17, meals: 68, provider: "Metro Tech Park Cafeteria" },
  { id: "c3", date: "27 Aug", item: "Rice & sambar", qtyKg: 31, meals: 124, provider: "Hotel Vaishnavi Banquets" },
];

export const VOLUNTEER_ASSIGNMENTS = [
  {
    id: "a1",
    pickup: "Sunrise Campus Kitchen",
    drop: "Annapurna Seva Trust",
    qtyKg: 18,
    distanceKm: 2.1,
    etaMin: 18,
    status: "In progress",
    window: "6:40 PM – 7:10 PM",
    legs: ["Kitchen gate B", "Ring Road", "Lake Junction", "Trust community hall"],
  },
  {
    id: "a2",
    pickup: "Metro Tech Park Cafeteria",
    drop: "Sahara Night Shelter",
    qtyKg: 9,
    distanceKm: 3.4,
    etaMin: 24,
    status: "Assigned",
    window: "7:30 PM – 8:05 PM",
    legs: ["Tower C loading bay", "Outer Ring Road", "Sector 4", "Shelter entrance"],
  },
  {
    id: "a3",
    pickup: "Hotel Vaishnavi Banquets",
    drop: "Roti Bank Collective",
    qtyKg: 26,
    distanceKm: 5.2,
    etaMin: 33,
    status: "Completed",
    window: "4:10 PM – 4:52 PM",
    legs: ["Banquet service road", "MG Road", "Old Market", "Roti Bank hub"],
  },
];

export const ADMIN_STATS = [
  { label: "Registered providers", value: "148" },
  { label: "Verified recipients", value: "96" },
  { label: "Active redistributions", value: "12" },
  { label: "Completed redistributions", value: "3,472" },
  { label: "Waste prevented (network)", value: "18.4 t" },
  { label: "Volunteers on duty", value: "37" },
];

export const ADMIN_USERS = [
  { id: "u1", name: "Sunrise Campus Kitchen", role: "Provider", city: "Pune", status: "Verified", joined: "12 Mar 2024" },
  { id: "u2", name: "Annapurna Seva Trust", role: "Recipient", city: "Pune", status: "Verified", joined: "04 Mar 2024" },
  { id: "u3", name: "Roti Bank Collective", role: "Recipient", city: "Pune", status: "Pending", joined: "22 Aug 2026" },
  { id: "u4", name: "Kabir Shah", role: "Volunteer", city: "Pune", status: "Verified", joined: "18 Jan 2025" },
  { id: "u5", name: "Metro Tech Park Cafeteria", role: "Provider", city: "Pune", status: "Pending", joined: "27 Aug 2026" },
  { id: "u6", name: "Bal Asha Children's Home", role: "Recipient", city: "Pune", status: "Suspended", joined: "09 Nov 2024" },
];

export const MENU_OPTIONS = [
  { id: "standard", label: "Standard veg thali", factor: 1 },
  { id: "festive", label: "Festive special menu", factor: 1.12 },
  { id: "light", label: "Light / snack service", factor: 0.82 },
  { id: "premium", label: "Premium buffet", factor: 1.05 },
];

export const TRACKING_STEPS = [
  { key: "reported", label: "Surplus Reported", detail: "Provider logged surplus with handling details." },
  { key: "matched", label: "Recipient Matched", detail: "Best-fit verified recipient selected by match score." },
  { key: "requested", label: "Pickup Requested", detail: "Recipient accepted; volunteer assigned." },
  { key: "progress", label: "Pickup In Progress", detail: "Volunteer en route with insulated carrier." },
  { key: "delivered", label: "Delivered", detail: "Handover confirmed and meals logged." },
];
