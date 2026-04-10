"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Inputs = {
  monthlyRevenue: string;
  totalCustomers: string;
  newCustomers: string;
  churnedCustomers: string;
  salesMarketingSpend: string;
};

type Metric = {
  label: string;
  value: string;
  description: string;
  benchmark?: { low: string; mid: string; high: string };
  rating?: "poor" | "okay" | "good" | "great";
};

const INITIAL: Inputs = {
  monthlyRevenue: "",
  totalCustomers: "",
  newCustomers: "",
  churnedCustomers: "",
  salesMarketingSpend: "",
};

function num(s: string): number {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

function fmt(n: number, prefix = "$"): string {
  if (!isFinite(n) || isNaN(n)) return "N/A";
  if (Math.abs(n) >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`;
  return `${prefix}${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

function pct(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "N/A";
  return `${(n * 100).toFixed(2)}%`;
}

function rateChurn(monthly: number): "poor" | "okay" | "good" | "great" {
  if (monthly > 0.05) return "poor";
  if (monthly > 0.03) return "okay";
  if (monthly > 0.015) return "good";
  return "great";
}

function rateLtvCac(ratio: number): "poor" | "okay" | "good" | "great" {
  if (ratio < 1) return "poor";
  if (ratio < 3) return "okay";
  if (ratio < 5) return "good";
  return "great";
}

function ratePayback(months: number): "poor" | "okay" | "good" | "great" {
  if (months > 18) return "poor";
  if (months > 12) return "okay";
  if (months > 6) return "good";
  return "great";
}

function rateQuickRatio(qr: number): "poor" | "okay" | "good" | "great" {
  if (qr < 1) return "poor";
  if (qr < 2) return "okay";
  if (qr < 4) return "good";
  return "great";
}

const RATING_COLORS = {
  poor: "text-red-400",
  okay: "text-yellow-400",
  good: "text-green-400",
  great: "text-emerald-300",
};

const RATING_BG = {
  poor: "bg-red-400/10 border-red-400/20",
  okay: "bg-yellow-400/10 border-yellow-400/20",
  good: "bg-green-400/10 border-green-400/20",
  great: "bg-emerald-300/10 border-emerald-300/20",
};

const RATING_LABELS = {
  poor: "Needs Work",
  okay: "Okay",
  good: "Good",
  great: "Excellent",
};

export function SaasCalculator() {
  const [inputs, setInputs] = useState<Inputs>(INITIAL);

  const hasData = Object.values(inputs).some((v) => num(v) > 0);

  const metrics = useMemo((): Metric[] => {
    const rev = num(inputs.monthlyRevenue);
    const total = num(inputs.totalCustomers);
    const newCust = num(inputs.newCustomers);
    const churned = num(inputs.churnedCustomers);
    const spend = num(inputs.salesMarketingSpend);

    if (!rev && !total) return [];

    const mrr = rev;
    const arr = mrr * 12;
    const arpu = total > 0 ? mrr / total : 0;
    const monthlyChurn = total > 0 ? churned / total : 0;
    const annualChurn = 1 - Math.pow(1 - monthlyChurn, 12);
    const avgLifespan = monthlyChurn > 0 ? 1 / monthlyChurn : 0;
    const ltv = arpu * avgLifespan;
    const cac = newCust > 0 ? spend / newCust : 0;
    const ltvCac = cac > 0 ? ltv / cac : 0;
    const payback = arpu > 0 ? cac / arpu : 0;
    const netNew = newCust - churned;
    const quickRatio = churned > 0 ? newCust / churned : newCust > 0 ? Infinity : 0;

    return [
      {
        label: "MRR",
        value: fmt(mrr),
        description: "Monthly Recurring Revenue",
        benchmark: { low: "<$10K", mid: "$10K-$100K", high: ">$100K" },
      },
      {
        label: "ARR",
        value: fmt(arr),
        description: "Annual Recurring Revenue",
        benchmark: { low: "<$120K", mid: "$120K-$1.2M", high: ">$1.2M" },
      },
      {
        label: "ARPU",
        value: fmt(arpu),
        description: "Average Revenue Per User/month",
      },
      {
        label: "Monthly Churn",
        value: pct(monthlyChurn),
        description: "Percentage of customers lost per month",
        benchmark: { low: "<2%", mid: "2-5%", high: ">5%" },
        rating: total > 0 ? rateChurn(monthlyChurn) : undefined,
      },
      {
        label: "Annual Churn",
        value: pct(annualChurn),
        description: "Projected yearly customer loss",
      },
      {
        label: "Avg Lifespan",
        value: avgLifespan > 0 ? `${avgLifespan.toFixed(1)} mo` : "N/A",
        description: "Average customer lifetime in months",
      },
      {
        label: "LTV",
        value: ltv > 0 ? fmt(ltv) : "N/A",
        description: "Lifetime Value per customer",
        benchmark: { low: "<$500", mid: "$500-$5K", high: ">$5K" },
      },
      {
        label: "CAC",
        value: newCust > 0 ? fmt(cac) : "N/A",
        description: "Customer Acquisition Cost",
        benchmark: { low: "<$100", mid: "$100-$500", high: ">$500" },
      },
      {
        label: "LTV:CAC",
        value: ltvCac > 0 ? `${ltvCac.toFixed(1)}x` : "N/A",
        description: "Lifetime Value to Acquisition Cost ratio",
        benchmark: { low: "<1x", mid: "3x", high: ">5x" },
        rating: ltvCac > 0 ? rateLtvCac(ltvCac) : undefined,
      },
      {
        label: "CAC Payback",
        value: payback > 0 ? `${payback.toFixed(1)} mo` : "N/A",
        description: "Months to recoup acquisition cost",
        benchmark: { low: ">18 mo", mid: "12 mo", high: "<6 mo" },
        rating: payback > 0 ? ratePayback(payback) : undefined,
      },
      {
        label: "Net New MRR",
        value: fmt(netNew * arpu),
        description: "Revenue from new customers minus churned",
      },
      {
        label: "Quick Ratio",
        value: isFinite(quickRatio) ? quickRatio.toFixed(2) : newCust > 0 ? "∞" : "N/A",
        description: "New customers / churned customers",
        benchmark: { low: "<1", mid: "2-3", high: ">4" },
        rating: isFinite(quickRatio) ? rateQuickRatio(quickRatio) : newCust > 0 ? "great" : undefined,
      },
    ];
  }, [inputs]);

  function handleChange(key: keyof Inputs) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputs((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      {/* Input Panel */}
      <div className="space-y-1">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-6 font-display text-lg font-semibold text-foreground">
            Your Numbers
          </h2>
          <div className="space-y-5">
            <InputField
              label="Monthly Revenue"
              prefix="$"
              placeholder="10,000"
              value={inputs.monthlyRevenue}
              onChange={handleChange("monthlyRevenue")}
            />
            <InputField
              label="Total Customers"
              placeholder="200"
              value={inputs.totalCustomers}
              onChange={handleChange("totalCustomers")}
            />
            <InputField
              label="New Customers This Month"
              placeholder="25"
              value={inputs.newCustomers}
              onChange={handleChange("newCustomers")}
            />
            <InputField
              label="Churned Customers This Month"
              placeholder="5"
              value={inputs.churnedCustomers}
              onChange={handleChange("churnedCustomers")}
            />
            <InputField
              label="Sales & Marketing Spend"
              prefix="$"
              placeholder="5,000"
              value={inputs.salesMarketingSpend}
              onChange={handleChange("salesMarketingSpend")}
            />
          </div>

          <button
            onClick={() => setInputs(INITIAL)}
            className="mt-6 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset all fields
          </button>
        </div>

        {/* Example preset */}
        <button
          onClick={() =>
            setInputs({
              monthlyRevenue: "50000",
              totalCustomers: "500",
              newCustomers: "40",
              churnedCustomers: "10",
              salesMarketingSpend: "15000",
            })
          }
          className="w-full rounded-lg border border-dashed border-border/40 p-3 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/15 hover:text-foreground"
        >
          <span className="font-medium text-foreground/65">Try an example</span>
          <span className="ml-1">
            $50K MRR, 500 customers, $15K spend
          </span>
        </button>
      </div>

      {/* Results Panel */}
      <div>
        {!hasData ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <p className="font-display text-lg font-medium text-muted-foreground">
                Enter your numbers to see metrics
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                All calculations happen in your browser. Nothing is sent to a server.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            {metrics.map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  prefix,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  prefix?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10",
            prefix && "pl-7"
          )}
        />
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border p-4 transition-colors",
        metric.rating
          ? RATING_BG[metric.rating]
          : "border-border/50 bg-surface/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {metric.label}
        </p>
        {metric.rating && (
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-wider",
              RATING_COLORS[metric.rating]
            )}
          >
            {RATING_LABELS[metric.rating]}
          </span>
        )}
      </div>
      <p className="mt-1 font-display text-2xl font-bold text-foreground">
        {metric.value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground/60">
        {metric.description}
      </p>
      {metric.benchmark && (
        <div className="mt-3 flex gap-2 border-t border-border/20 pt-2">
          <span className="text-[10px] text-red-400/70">{metric.benchmark.low}</span>
          <span className="text-[10px] text-yellow-400/70">{metric.benchmark.mid}</span>
          <span className="text-[10px] text-green-400/70">{metric.benchmark.high}</span>
        </div>
      )}
    </motion.div>
  );
}
