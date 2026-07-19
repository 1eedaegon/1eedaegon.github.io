# Improvements Tracker

> 2026-07-20 전체 감사(25-agent audit)에서 나온 피드백을 추적하는 문서.
> 반영 시 체크(`[x]`)하고 날짜를 남긴다. 새 피드백은 섹션에 맞춰 추가한다.
> UI 라이브러리(@monochrome-edge/ui) 피드백은 `monochrome-edge` 저장소의 `IMPROVEMENTS.md`에서 별도 추적.

## Critical — 배포 시 실제로 깨지는 것

- [x] **프로덕션 placeholder 배포** (2026-07-20): `deploy.yml`이 `SITE_URL`/`BASE_PATH`만 주입해 "Your Name"이 배포됨.
  → 해결: `${{ vars.* || github.repository_owner }}` 패턴으로 빌드 env 주입. 템플릿 복사 사용자는 **아무 설정 없이 저장소 소유자명이 자동 반영**되고, repo variables로 덮어쓰기 가능.
- [x] **og:image / logo.png 404** (2026-07-20): `public/og-image.png`, `public/logo.png` 실물 추가. `BaseLayout.astro` 기본 og:image와 `[slug].astro` JSON-LD logo를 BASE_PATH 반영 URL로 수정.
  - [ ] 후속: satori/astro-og-canvas로 per-post OG 이미지 빌드타임 생성 (M)
- [x] **404 페이지 부재** (2026-07-20): `src/pages/404.astro` 추가 (검색 유도 + 홈/목록 링크 + `track404` 배선).
- [x] **robots.txt 부재** (2026-07-20): `src/pages/robots.txt.ts` 동적 생성 (BASE_PATH 반영, Sitemap 지시자 포함).
- [x] **draft 글 sitemap 노출** (2026-07-20): draft 상세 페이지는 "unlisted 프리뷰 채널"로 유지하되, `astro.config.mjs` `sitemap({ filter })`로 sitemap 제외 + draft 페이지에 `noindex` 메타 추가. draft 픽스처(`_draft-example.md`)와 e2e 회귀 테스트 추가.
- [x] **CI가 배포를 게이트하지 않음** (2026-07-20): `deploy.yml`에 test job 추가, `deploy`는 `needs: [build, test]`. `ci.yml`은 PR 전용 + 주간 schedule(링크 부패 감시)로 전환. Playwright는 CI에서 기존 dist 재사용(이중 빌드 제거).

## High — 있는데 안 켜져 있던 기능

- [x] **TOC 미배선** (2026-07-20): `TOC.astro`를 `[slug].astro` 사이드바(>1200px) / 본문 상단(이하)으로 렌더.
- [x] **View Transitions 무동작** (2026-07-20): `<ClientRouter />` 장착, 테마 인라인 스크립트 `data-astro-rerun`, `theme-toggle.ts`에 `astro:after-swap` 재적용 추가. (기존 after-swap 리스너들이 이제 실제로 발화)
- [x] **가짜 i18n** (2026-07-20): `LanguageSwitcher` 제거, `src/i18n/` 삭제. 실제 다국어는 Astro i18n 라우팅으로 재도입 예정 (L, 보류).
- [x] **Fuse.js 전 페이지 eager 로드** (2026-07-20): 모달 최초 오픈 시 dynamic import + 인덱스 지연 fetch로 전환.
- [ ] **Lighthouse CI 미연결**: `lighthouserc.cjs` 커밋 + `@lhci/cli` + ci.yml 스텝. collect URL에 실제 article 페이지 추가 필요. (S, 보류 — 성능 예산 위반이 남아있어 red CI 방지 위해 CSS 슬림화 후 활성화)

## High — 성능

- [x] **Pretendard @import 렌더 블로킹 체인** (2026-07-20): `global.css`의 `@import` 제거 → head `<link>` + dynamic-subset(static) 전환. unicode-range 서브셋으로 사용 글리프만 다운로드.
- [ ] **@monochrome-edge/ui 전체 CSS 226KB(34.5KB gz) 적재**: UILIB에 core-only CSS 엔트리 필요 (UILIB 저장소 과제, 릴리스 동반) 또는 PurgeCSS. (M)
- [ ] **Stepper 메인 번들 import**: UILIB exports에 `./ui/components/stepper` 서브패스 추가 후 딥 임포트 전환. (S, UILIB 릴리스 필요)

## High — 접근성

- [x] **skip link 타깃 부재** (2026-07-20): 모든 페이지 `<main>`에 `id="main-content"` 추가.
- [x] **h1 구조** (2026-07-20): 홈에 sr-only h1 추가. article의 이중 h1은 `rehype-strip-h1`로 md h1을 DOM에서 제거(display:none 핵 삭제).
- [x] **prefers-reduced-motion 전무** (2026-07-20): `global.css`에 전역 reduce 블록 추가.
- [x] **미세 ARIA** (2026-07-20): Toast `role="status" aria-live="polite"`, Header `role="list"` 제거, Footer 로고 img 치수 명시.
- [ ] **axe-core 자동 a11y 테스트 + Firefox/WebKit/모바일 뷰포트 프로젝트** (M)
- [ ] SearchModal focus trap + combobox 패턴 정리 (S-M)
- [ ] ReadingProgress `width` 애니메이션 → `transform: scaleX` (S)

## Medium — 코드 품질

- [x] **죽은 코드 삭제** (2026-07-20): `src/scripts/article-filter.ts`(이중 구현), `src/content/config.ts`(중복), `config.ts` legacy `ANALYTICS`/`COMMENTS` exports, `LanguageSwitcher.astro`, `src/i18n/`.
- [x] **JSON-LD 하드코딩** (2026-07-20): author/publisher/inLanguage/URL fallback을 `SITE.*` / `post.data.lang` 참조로 교체.
- [x] **featured 미배선** (2026-07-20): `articles.astro`가 `featured` prop 전달.
- [x] **theme-toggle 기본값 이중 소스** (2026-07-20): 클라이언트 폴백이 서버 렌더된 `data-theme-variant`를 읽도록 수정.
- [ ] **@ts-ignore 11개 + as any** (about.astro/code.astro profile-sections): discriminated union narrowing으로 교체 (S)
- [ ] **유닛 테스트 러너 부재**: vitest 도입, url/relationships/reading-time/search/git-dates부터 (M)
- [ ] e2e soft-pass(`isVisible().catch(() => false)`) 제거 — 고정 픽스처 전제 무조건 assert (S)
- [ ] git-dates 메모이제이션(빌드당 O(4×N×git) → 1회) + `formatDate`에 `timeZone: 'Asia/Seoul'` + `execFileSync` 전환 (S)
- [ ] `(window as any)` 전역 계약 → `env.d.ts`에 `Window` 인터페이스 + `ImportMetaEnv` 정의 (S-M)
- [ ] meta CSP + 외부 스크립트 SRI + Google favicon 서비스 제거(References) (M)

## Medium — 구조적 리스크 (완결성 검증 발견)

- [ ] **콘텐츠 백업 이식성**: 발행일이 git 히스토리에만 존재. 날짜를 frontmatter로 bake하는 `npm run bake-dates` 스크립트 (S)
- [ ] **댓글 pathname 결합**: BASE_PATH/도메인 변경 시 스레드 고아화 — giscus `og:title` 매핑 검토 (S)
- [x] **링크 부패 감시** (2026-07-20): `ci.yml`에 주간 schedule 트리거 추가.
- [ ] **consent 부재**: GA4/Sentry 활성 시 무고지 추적 — Consent Mode 또는 쿠키리스(Plausible) 우선 검토 (M)
- [ ] 미래 날짜 예약 발행: 문서(`git-based-dates.md`)와 실동작 불일치 — 문서 수정 또는 cron 재빌드 구현 (S/M)

## CMS 일원화 로드맵 (UX: 로컬 md 작성 → 배포 → 반영)

- **Stage 1 (S)** — 스캐폴드 CLI(`npm run new -- "제목"`), draft 프리뷰 채널 공식화(✅ 2026-07-20 sitemap 제외+noindex), GitHub Mobile Actions 알림, 이미지 규약(글 옆 상대경로) 문서화
  - [ ] `scripts/new-post.mjs` 스캐폴드
  - [ ] 이미지 규약 README 문서화
- **Stage 2 (M)** — Sveltia CMS를 `public/admin/`에 탑재 (PAT 로그인, OAuth proxy 불필요). `media_folder: public/images`, date 필드 생략으로 git-dates와 호환. schema.ts ↔ config.yml 동기화 주석.
- **Stage 3 (L, 선택)** — @monochrome-edge/ui 에디터의 markdown 왕복 수리 + frontmatter 폼 + GitHub contents API 어댑터 후 `/admin` 편집 화면 교체. Sveltia를 fallback으로 유지.

## Template UX

- [x] **템플릿 복사 시 사용자 자동 주입** (2026-07-20): `deploy.yml`이 `github.repository_owner`를 기본값으로 주입. README에 repo variables 개인화 표 추가.
- [ ] 템플릿 복사본은 git 히스토리가 없어 데모 글 날짜가 복사일이 됨 — README에 명시 (S)
- [ ] 데모 글을 실제 글로 교체 또는 draft 처리 (콘텐츠 작업)
