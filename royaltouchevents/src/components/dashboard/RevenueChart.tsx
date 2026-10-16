import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  revenue: { label: "Revenue", color: "oklch(0.82 0.13 85)" },
  expenses: { label: "Expenses", color: "oklch(0.58 0.21 275)" },
};

type RevenueChartProps = {
  data: { month: string; revenue: number; expenses: number }[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    revenue: d.revenue / 1_000_000,
    expenses: d.expenses / 1_000_000,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}M`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.2} strokeWidth={2} />
        <Area type="monotone" dataKey="expenses" stroke="var(--color-expenses)" fill="var(--color-expenses)" fillOpacity={0.15} strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  );
}
