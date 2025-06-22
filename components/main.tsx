import { createClient } from '@/lib/supabase/server';
import ProjectSummaryGrid from './project-summary-grid';
import VisitChart from './visit-chart';

export default async function Main() {
  const supabase = createClient();
  const { data } = await supabase
    .from('visit_logs')
    .select('*')
    .abortSignal(new AbortController().signal);

  const formatted = data?.map((log) => ({
    ...log,
    created_date_kst: new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(log.created_at)),
  }));

  return (
    <div className="space-y-8 py-8 px-4">
      <ProjectSummaryGrid data={formatted!} />
      <VisitChart data={formatted!} />
    </div>
  );
}
