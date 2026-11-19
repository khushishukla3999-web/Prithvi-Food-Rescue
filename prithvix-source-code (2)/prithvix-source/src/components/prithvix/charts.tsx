import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "0.6rem",
    fontSize: "12px",
    color: "var(--color-card-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)", fontSize: "11px" },
};

export function DemandChart({
  data,
}: {
  data: { day: string; predicted: number; actual: number; prepared: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="gPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="predicted"
          name="Predicted demand"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          fill="url(#gPredicted)"
        />
        <Line type="monotone" dataKey="prepared" name="Recommended prep" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="actual" name="Actual served" stroke="var(--color-chart-4)" strokeWidth={2} dot={{ r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WasteTrendChart({ data }: { data: { month: string; waste: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="waste" name="Waste (kg)" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RescuedChart({ data }: { data: { month: string; rescued: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="gRescued" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="rescued"
          name="Meals rescued"
          stroke="var(--color-chart-2)"
          strokeWidth={2.5}
          fill="url(#gRescued)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PredictedVsActualChart({
  data,
}: {
  data: { day: string; predicted: number; actual: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="predicted" name="Predicted" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="actual" name="Actual consumption" stroke="var(--color-chart-5)" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
