'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-accent bg-opacity-20 rounded-lg">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-fg mb-1">{value}</h3>
        <p className="text-sm text-muted">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
