import { createClient } from '@/lib/supabase/server';
import ProjectSummaryGrid from './project-summary-grid';
import VisitChart from './visit-chart';

export default async function Main() {
  const supabase = createClient();
  const { data } = await supabase.from('visit_logs').select('*');

  return (
    <div className="space-y-8 py-8 px-4">
      <ProjectSummaryGrid data={data!} />
      <VisitChart data={data!} />
    </div>
  );
}
