export interface DashboardSummaryStat {
  label: string;
  value: string | number;
  emoji?: string;
}

export interface DashboardColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface DashboardData {
  title: string;
  generatedAt: string;
  summary: DashboardSummaryStat[];
  columns: DashboardColumn[];
  rows: Array<Record<string, string | number>>;
  severityLegend?: Record<string, string>;
  reviewerNote?: string;
}
