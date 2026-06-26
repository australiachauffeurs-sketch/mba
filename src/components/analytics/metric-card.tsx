import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: React.ElementType;
  iconColor?: string;
  description?: string;
}

export function MetricCard({ label, value, change, changeType, icon: Icon, iconColor = "text-indigo-600", description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
              <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
          )}
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            {changeType === "increase" ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            ) : changeType === "decrease" ? (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                changeType === "increase" ? "text-green-600" : changeType === "decrease" ? "text-red-600" : "text-slate-500"
              )}
            >
              {change > 0 ? "+" : ""}{change}% vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
