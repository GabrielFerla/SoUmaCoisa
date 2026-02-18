export interface DailyEntry {
  id: string;
  date: string; // 'YYYY-MM-DD'
  intention: string | null;
  completed: boolean | null; // null = sem resposta
  skipped: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface HistoryResponse {
  month: string;
  entries: DailyEntry[];
  summary: {
    total_days: number;
    completed: number;
    not_completed: number;
    skipped: number;
  };
}
