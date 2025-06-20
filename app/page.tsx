import Header from '@/components/header';
import Main from '@/components/main';
import Footer from '@/components/footer';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  

  return (
    <div>
      <Header />
      <Separator />
      <Main />
      <Footer />
    </div>
  );
}
