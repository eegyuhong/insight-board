'use client';

import { IVisitLog } from '@/types';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from './ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui/chart';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Settings2 } from 'lucide-react';

// 차트 색상 설정
const CHART_COLORS = [
  '#2D2D2D',
  '#4A4A4A',
  '#666666',
  '#808080',
  '#999999',
  '#B3B3B3',
  '#CCCCCC',
  '#595959',
  '#737373',
  '#A6A6A6',
];

interface ChartDataPoint {
  date: string;
  [key: string]: string | number | null;
}

interface ProjectData {
  sum: number;
  count: number;
}

// 데이터 가공 함수
function getChartData(logs: IVisitLog[]) {
  // Map<date, Map<project, Set<session_id>>>
  const visitorMap = new Map<string, Map<string, Set<string>>>();
  const stayMap = new Map<string, Map<string, ProjectData>>();

  logs.forEach((log) => {
    const date = log.created_date_kst;
    const project = log.project;
    const sessionId = log.session_id;

    // 방문자 맵 처리
    if (!visitorMap.has(date)) visitorMap.set(date, new Map());
    const visitorSubMap = visitorMap.get(date)!;
    if (!visitorSubMap.has(project)) visitorSubMap.set(project, new Set());
    visitorSubMap.get(project)!.add(sessionId);

    // 체류시간 맵 처리
    if (!stayMap.has(date)) stayMap.set(date, new Map());
    const staySubMap = stayMap.get(date)!;
    const entry = staySubMap.get(project) || { sum: 0, count: 0 };
    entry.sum += log.stay_duration;
    entry.count += 1;
    staySubMap.set(project, entry);
  });

  const allProjects = Array.from(new Set(logs.map((l) => l.project)));

  const buildData = (
    baseMap: Map<string, Map<string, Set<string> | ProjectData>>,
    isStayTime = false,
  ): ChartDataPoint[] => {
    return Array.from(baseMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, projectMap]) => {
        const row: ChartDataPoint = { date };
        for (const project of allProjects) {
          if (!projectMap.has(project)) {
            row[project] = null;
          } else {
            const value = projectMap.get(project);
            if (value !== undefined) {
              if (isStayTime && !(value instanceof Set)) {
                row[project] = Math.round(value.sum / value.count);
              } else if (!isStayTime && value instanceof Set) {
                row[project] = value.size; // Set의 크기로 고유 방문자 수 계산
              }
            }
          }
        }
        return row;
      });
  };

  return {
    visitors: buildData(visitorMap as Map<string, Map<string, Set<string> | ProjectData>>),
    avgStay: buildData(stayMap as Map<string, Map<string, Set<string> | ProjectData>>, true),
  };
}

// 방문자 수 차트 컴포넌트
export default function VisitChart({ data }: { data: IVisitLog[] }) {
  const { visitors, avgStay } = getChartData(data);

  const [chartType, setChartType] = useState<'visitors' | 'avgStay'>('visitors');
  const [visibleProjects, setVisibleProjects] = useState<Record<string, boolean>>(() => {
    const projects = Object.keys(visitors[0] ?? {}).filter((k) => k !== 'date');
    return projects.reduce((acc, project) => ({ ...acc, [project]: true }), {});
  });

  const chartData = chartType === 'visitors' ? visitors : avgStay;
  const projects = Object.keys(chartData[0] ?? {}).filter((k) => k !== 'date');

  // 동적으로 차트 설정 생성
  const dynamicChartConfig = projects.reduce((acc, project, index) => {
    acc[project] = {
      label: project,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  const handleProjectToggle = (project: string) => {
    setVisibleProjects((prev) => ({
      ...prev,
      [project]: !prev[project],
    }));
  };

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="!p-0">
        <div className='flex items-center border-b px-6'>
          <div className="flex flex-1 flex-col justify-center gap-1 py-5 sm:py-6">
            <CardTitle>일별 방문 현황</CardTitle>
            <CardDescription>
              {chartType === 'visitors' ? '프로젝트별 방문자 수' : '프로젝트별 평균 체류 시간'}
            </CardDescription>
          </div>
          
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  <Settings2 />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>차트 타입</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['visitors', 'avgStay'].map((type) => (
                  <DropdownMenuCheckboxItem key={type} checked={chartType === type} onCheckedChange={() => setChartType(type as 'visitors' | 'avgStay')}>
                    {type === 'visitors' ? '방문자 수' : '평균 체류 시간'}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>프로젝트 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={Object.values(visibleProjects).every(Boolean)}
                  onCheckedChange={() => setVisibleProjects(projects.reduce((acc, project) => ({ ...acc, [project]: true }), {}))}
                >
                  전체 선택
                </DropdownMenuCheckboxItem>
                {projects.map((project) => (
                  <DropdownMenuCheckboxItem key={project} checked={visibleProjects[project]} onCheckedChange={() => handleProjectToggle(project)}>
                    {project}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer className="w-full max-h-80" config={dynamicChartConfig}>
          <AreaChart data={chartData}>
            <defs>
              {projects.map((project, index) => (
                <linearGradient
                  key={project}
                  id={`gradient-${project}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => value.slice(5)}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return value.slice(5);
                  }}
                  indicator="dot"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {projects.map(
              (project, index) =>
                visibleProjects[project] && (
                  <Area
                    key={project}
                    type="monotone"
                    dataKey={project}
                    name={project}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    fill={`url(#gradient-${project})`}
                    strokeWidth={2}
                  />
                ),
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
