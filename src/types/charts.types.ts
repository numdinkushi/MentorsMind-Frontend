import type { AssetCode } from './index';
import type { ReactNode } from 'react';

export interface ChartDatum {
  date: string;
  value: number;
  asset?: AssetCode;
  category?: string;
  learner?: string;
}

export interface EarningsMetrics {
  avgDuration: number; // minutes
  totalSessions: number;
  platformFees: number;
  currentPeriodTotal: number;
  previousPeriodTotal: number;
  periodChange: number; // percentage
}

export interface AggregatedData {
  monthlyEarnings: ChartDatum[];
  weeklySessions: ChartDatum[];
  topLearners: ChartDatum[];
  skillBreakdown: ChartDatum[];
  metrics: EarningsMetrics;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: string;
}

/** Row data for multi-series line/bar charts (dynamic keys + optional labels) */
export type MultiSeriesDataPoint = Record<string, string | number | string[] | undefined> & {
  labels?: string[];
};

export interface ChartSeries {
  key: string;
  name: string;
  color?: string;
}

export interface ChartExportOptions {
  format: 'png' | 'svg';
  filename?: string;
}

export interface DataPoint {
  label: string;
  value: number;
}
