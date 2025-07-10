import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        {icon && (
          <div className="p-2 bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-teal-900/20 dark:to-indigo-900/20 rounded-lg">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </p>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 text-sm">
            {trend && trendValue && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  trend === "up" && "bg-green-100 text-green-700",
                  trend === "down" && "bg-red-100 text-red-700",
                  trend === "neutral" && "bg-gray-100 text-gray-700",
                )}
              >
                {trend === "up" && "↗"}
                {trend === "down" && "↘"}
                {trend === "neutral" && "→"}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-gray-500 dark:text-gray-400">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
