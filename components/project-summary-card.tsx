import { IProjectSummary } from '@/types';
import { Card, CardContent, CardHeader } from './ui/card';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

import crawlerImg from '@/assets/crawler.png';
import portfolioImg from '@/assets/portfolio.png';
import disneyImg from '@/assets/disney.png';
import tictctoeImg from '@/assets/tictctoe.png';
import movieImg from '@/assets/movie.png';
import starbucksImg from '@/assets/starbucks.png';
import appleImg from '@/assets/apple.png';

const imgMap = {
  Crawler: crawlerImg,
  Portfolio: portfolioImg,
  Disney: disneyImg,
  Tictactoe: tictctoeImg,
  Movie: movieImg,
  Starbucks: starbucksImg,
  Apple: appleImg,
} as const;

export default function ProjectSummaryCard({ summary }: { summary: IProjectSummary }) {
  const { project, totalVisits, avgDuration, dailyAvg, url } = summary;
  
  return (
    <Card className="relative overflow-hidden group">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imgMap[project as keyof typeof imgMap] || imgMap.Portfolio}
          alt={project}
          fill
          className="object-cover opacity-20"
          priority
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
      </div>
      
      {/* 카드 콘텐츠 */}
      <CardHeader className="relative z-10 flex flex-row items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">{project}</h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-md hover:bg-white/20 transition-colors text-white"
        >
          <ExternalLink size={16} />
          <span>방문하기</span>
        </a>
      </CardHeader>
      <CardContent className="relative z-10 text-sm space-y-1 text-white">
        <p><span className="text-gray-300 ">방문자 수: </span><span className='ml-2 font-bold text-xl'>{totalVisits}</span></p>
        <p><span className="text-gray-300">일 평균 방문자: </span><span className='ml-2 font-bold text-xl'>{dailyAvg.toFixed(1)}</span>명</p>
        <p><span className="text-gray-300">평균 체류시간: </span><span className='ml-2 font-bold text-xl'>{avgDuration.toFixed(1)}</span>초</p>
      </CardContent>
    </Card>
  );
}
