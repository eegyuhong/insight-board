export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import Header from '@/components/header';
import Main from '@/components/main';
import Footer from '@/components/footer';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase
    .from('visit_logs')
    .select('*')
    .abortSignal(new AbortController().signal);

  return (
    <div>
      <Header />
      <Separator />
      <Main data={data!} />
      <Footer />
    </div>
  );
}
