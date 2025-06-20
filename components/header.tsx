import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle2Icon } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-8 px-4">
      <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance font-[family-name:var(--font-gmarket)]">
        <strong>InsightBoard</strong><span className="text-gray-500"> - 포트폴리오 방문자 현황</span>
      </h1>
      <Alert className="mt-10">
        <CheckCircle2Icon />
        <AlertTitle>정적 JS 파일을 활용하여 포트폴리오 방문자 현황을 확인할 수 있습니다.</AlertTitle>
        <AlertDescription>
          <pre className='text-xs'><code>&lt;script src=&quot;https://insight-board-omega.vercel.app/track.js&quot; data-project-id=&quot;test1234&quot;&gt;&lt;/script&gt;</code></pre>  
        </AlertDescription>
      </Alert>
      
    </header>
  );
}
