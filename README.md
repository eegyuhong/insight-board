# InsightBoard 사용자 행동 분석 서비스

## 프로젝트 개요

InsightBoard는 여러 포트폴리오 프로젝트에 삽입 가능한 사용자 행동 추적 스크립트(`track.js`)를 제공하고, 수집된 데이터를 Supabase Edge Function을 통해 저장한 뒤, Next.js 기반 대시보드에서 시각화하는 사용자 행동 분석 서비스입니다.

---

## 주요 구성

insight-board/
├── public/
│ └── track.js ← 클라이언트 삽입용 정적 추적 스크립트
├── app/ ← Next.js App Router
│ └── dashboard/ ← 사용자 행동 데이터 시각화 페이지
│ └── page.tsx
├── supabase/
│ └── functions/
│ └── track/
│ └── index.ts ← Supabase Edge Function: 데이터 수신 및 DB 저장
├── lib/
│ └── supabase.ts ← Supabase 클라이언트 공용 설정
├── types/ ← 타입 정의 (선택)
├── .env.local ← 환경변수 (Supabase 키 등)
└── README.md

---

## 기능 및 역할

| 구성 요소                         | 역할                                                              |
|-----------------------------------|-------------------------------------------------------------------|
| `public/track.js`                 | 외부 프로젝트에 삽입하는 사용자 행동 추적용 정적 JS 파일          |
| Supabase Edge Function (`/track`) | `track.js`가 전송한 행동 데이터를 받아 `visit_logs` 테이블에 저장 |
| Next.js `/dashboard`              | 저장된 데이터를 시각화 (방문자 수, 체류 시간 등)                  |
| Supabase DB (`visit_logs`)        | 행동 데이터 저장용 테이블                                         |

---

## 사용 흐름

1. 외부 포트폴리오 프로젝트 HTML에 `<script src="https://insightboard.vercel.app/track.js?pid=프로젝트ID"></script>` 삽입  
2. 사용자가 해당 페이지 방문 시 `track.js`가 실행되어 방문 정보 수집  
3. 수집된 데이터는 Supabase Edge Function API (`POST /functions/v1/track`)로 전송  
4. Edge Function은 데이터를 `visit_logs` 테이블에 저장  
5. InsightBoard `/dashboard` 페이지에서 저장된 데이터 시각화

---

## 배포 및 개발 가이드

- **Edge Function 코드는 반드시 `supabase/functions` 폴더 내에 위치해야 합니다.**  
  Supabase CLI가 해당 위치를 기준으로 함수 관리 및 배포를 수행합니다.

- `track.js`는 Next.js 프로젝트의 `public` 폴더에 두어 정적 파일로 배포하며,  
  외부에서 `<script>` 태그로 자유롭게 로드 가능하도록 합니다.

- 환경 변수 (`.env.local`)에 Supabase 프로젝트 URL 및 키를 설정해 사용합니다.

---

## 다음 작업 추천

- `track.js` 최종 코드 완성 및 정적 배포  
- Supabase Edge Function `/functions/track/index.ts` 구현 및 배포  
- `visit_logs` 테이블 생성 및 RLS 정책 설정  
- 대시보드 UI 구현 및 데이터 시각화  
- 외부 프로젝트에 `track.js` 삽입 테스트

---

## 참고

- Supabase CLI 공식 문서: https://supabase.com/docs/guides/functions  
- Next.js 공식 문서: https://nextjs.org/docs  
- `track.js` 삽입 시 `pid` 쿼리 파라미터로 프로젝트 식별 가능

---
