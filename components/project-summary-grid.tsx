import { IProjectSummary, IVisitLog } from '@/types';
import ProjectSummaryCard from './project-summary-card';

function summarizeProjects(data: IVisitLog[]): IProjectSummary[] {
  const grouped = new Map<string, IVisitLog[]>();

  // 1. 프로젝트별 그룹화
  for (const row of data) {
    if (!grouped.has(row.project)) grouped.set(row.project, []);
    grouped.get(row.project)!.push(row);
  }

  // 2. 프로젝트별 요약 계산
  const summaries: IProjectSummary[] = [];

  for (const [project, visits] of grouped.entries()) {
    // 고유한 세션 ID 수 계산
    const uniqueSessions = new Set(visits.map((v) => v.session_id));
    const totalVisits = uniqueSessions.size;
    
    const totalDuration = visits.reduce((sum, v) => sum + v.stay_duration, 0);
    const avgDuration = totalDuration / totalVisits;

    // 방문 날짜 수 계산
    const dateSet = new Set(visits.map((v) => v.created_date_kst)); // 'YYYY-MM-DD'
    const dailyAvg = totalVisits / dateSet.size;

    // url은 첫 번째 방문 기록의 url을 사용
    const url = visits[0]?.url || '';

    summaries.push({
      project,
      totalVisits,
      avgDuration,
      dailyAvg,
      url,
    });
  }

  return summaries;
}

export default function ProjectSummaryGrid({ data }: { data: IVisitLog[] }) {
  const summaries = summarizeProjects(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaries.map((summary) => (
        <ProjectSummaryCard key={summary.project} summary={summary} />
      ))}
    </div>
  );
}
