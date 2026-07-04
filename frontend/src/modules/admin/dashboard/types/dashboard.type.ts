import { LucideIcon } from "lucide-react";

export type DashboardStat = {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: LucideIcon;
  accentClass: string;
  iconColor: string;
  link?: string;
};

export type RecentOrder = {
  id: string;
  customer: string;
  total: string;
  status: string;
};
