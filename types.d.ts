export interface IVisitLog {
  id: string;
  created_at: string; // ISO 문자열 (timestamp with time zone)
  created_date_kst: string;
  project: string;
  url: string;
  referrer: string;
  user_agent: string;
  screen_width: number;
  screen_height: number;
  session_id: string;
  stay_duration: number;
}

export interface IProjectSummary {
  project: string;
  totalVisits: number;
  avgDuration: number;
  dailyAvg: number;
  url: string;
}
