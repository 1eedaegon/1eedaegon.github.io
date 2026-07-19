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
- [x] **draft 글 sitemap 노출** (2026-07-20): draft 상세 페이지는 "unlisted 프리뷰 채널"로 유지하되, `astro.config.mjs` `sitemap({ filter })`로 sitemap 제외 + draft 페이지에 `noindex` 메타 추가. draft 픽스처(`draft-example.md`)와 e2e 회귀 테스트 추가. 한글 slug percent-encoding 누출도 필터에서 방어(2차 검증 발견).
- [x] **git 날짜가 프로덕션에서 전면 불발** (2026-07-20, 2차 검증 발견): glob 로더의 `post.id`에 확장자가 없어 6개 파일 전부 잘못된 경로로 git log 실행 → 라이브 전 글 날짜가 배포 시각으로 표시되던 실버그. `articleSourcePath()` 헬퍼(post.filePath 우선)로 일괄 수정 + `formatDate`에 `timeZone: Asia/Seoul`.
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
  - 2026-07-20 UILIB 재검증: 실측 `monochrome.min.css` 207KB raw/31.4KB gz(226KB는 editor+theme 포함 수치). core 서브셋 프로토타입 = **49KB raw/9.3KB gz(약 70%↓)**. UILIB `IMPROVEMENTS.md`에 `./css/core` 항목으로 등록됨(v1.15.0 예정).
- [ ] **Stepper 메인 번들 import**: UILIB exports에 `./ui/components/stepper` 서브패스 추가 후 딥 임포트 전환. (S, UILIB 릴리스 필요)
  - 2026-07-20 UILIB 재검증: `SeriesStepper.astro:38`이 메인 엔트리에서 import → 아티클 청크가 8.3KB gz(딥 임포트 시 절반). dist 산출물(esm/cjs/d.ts)은 **이미 전부 존재**, `package.json` exports 한 줄만 누락 → UILIB v1.14.0에서 해소 예정.
- [x] **UILIB 버전 추적 자동화** (2026-07-20): `.github/dependabot.yml` — @monochrome-edge/ui는 매일 단독 그룹으로 PR, 나머지는 minor/patch 그룹. PR CI(build+e2e)가 검증 → 머지 → 게이트된 배포.

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
- [x] **@ts-ignore 11개 제거** (2026-07-20): 전부 낡은 주석이었음 — 제거 후 astro check 0 에러 (as any는 no-explicit-any 완화와 함께 Window 타이핑 과제로 유지)
- [x] **Prettier + ESLint 도입·강제** (2026-07-20): prettier-plugin-astro + eslint flat config(astro/ts). 저장소 일괄 정규화(콘텐츠 md 제외), `format:check`+`lint`를 ci.yml build-and-check와 deploy.yml test 게이트 양쪽에 강제.
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
  - [x] `scripts/new-post.mjs` 스캐폴드 (2026-07-20, `npm run new`)
  - [ ] 이미지 규약 README 문서화
- [x] **Stage 2 (M)** — Sveltia CMS 탑재 (2026-07-20): `public/admin/index.html`(v0.172.1 고정) + `src/pages/admin/config.yml.ts`(repo/branch/base를 env에서 빌드타임 도출, schema.ts 전 필드 매핑, draft 기본 true). robots.txt에 /admin/ Disallow. PAT 로그인 — OAuth proxy 불필요.
  - [ ] Sveltia 버전 주기적 범프 (pre-1.0, 고정 핀)
  - [ ] schema.ts 필드 추가 시 config.yml.ts 동기화 (파일 상단 주석 참조)
- **Stage 3 (L, 선택)** — @monochrome-edge/ui 에디터의 markdown 왕복 수리 + frontmatter 폼 + GitHub contents API 어댑터 후 `/admin` 편집 화면 교체. Sveltia를 fallback으로 유지.

## Writer UX (2026-07-20 2차 검증 + 신규 기획 반영)

- [x] **`[[slug]]` 본문 렌더링** (2026-07-20): 원기획(README 문서화)이었으나 미구현 상태였음 — `remark-wikilinks.ts` 플러그인으로 본문에서 실제 링크 렌더(라벨 기본값=대상 글 제목, base path 반영). 죽은 `convertWikiLinksToMarkdown` 삭제. 검색 인덱스에서도 wikilink 원문 제거.
- [x] **`![[...]]` 임베드** (2026-07-20, 신규): `![[slug]]` → 임베드 카드(제목+설명+링크), `![[img.png]]` → 인라인 이미지. 미존재 대상은 `.wikilink-broken` span(링크 아님 — lychee 안전).
- [x] **코드박스 재디자인** (2026-07-20, 신규): 언어 라벨 chip 제거 → 박스 안 흐린 로고(simple-icons, 빌드타임 인라인)+흐린 텍스트 워터마크. 복사 버튼 상시 표시(ghost, hover 시 선명). 전부 rehype 빌드타임 렌더로 전환 — `code-language-label.ts` 삭제, `copy-code.ts`는 이벤트 위임 1개로 축소.
- [x] **draft DRAFT 배지** (2026-07-20): draft 프리뷰 페이지 제목 옆 시각 배지.
- [x] **빈 description 누출** (2026-07-20): 스캐폴드 기본값 `""`이 meta/og를 비우던 문제 — BaseLayout에서 빈 문자열도 사이트 기본값으로 폴백.
- [x] **og:type article + article:published_time/modified_time/tag 메타** (2026-07-20).
- [x] **relatedPosts frontmatter 배선** (2026-07-20): 수동 지정 글이 Related Posts 최상단에 병합.
- [x] **CMS↔CLI slug 일치** (2026-07-20): Sveltia slug encoding을 unicode로 변경(CLI의 한글 보존과 일치), `preview_path` 추가(저장 직후 프리뷰 링크), ogImage/canonical 위젯 pattern 검증.
- [x] **모바일 네이티브 공유** (2026-07-20): ShareButtons에 Web Share API(가능 시 공유 시트, 폴백 클립보드).
- [x] **문서 정정** (2026-07-20): README에 이미지 규약/배포 확인 방법/전체 frontmatter 필드/GA·giscus 올바른 레시피(`GA4_ENABLED`, `COMMENTS_PROVIDER`), git-based-dates.md의 허위 예약 발행 암시·과장된 휴리스틱 설명 정정.
- [ ] 데모 글 6편이 소유자 사이트에 색인됨 — 실글 교체 또는 draft 전환 (콘텐츠 결정 필요)
- [ ] sitemap `lastmod` 부재 (S-M)
- [ ] hasSubstantiveChanges를 마지막 substantive 커밋 탐색으로 개선 (M)
- [ ] profile-sections 컬렉션 CMS 미노출 (M)

## Template UX

- [x] **템플릿 복사 시 사용자 자동 주입** (2026-07-20): `deploy.yml`이 `github.repository_owner`를 기본값으로 주입. README에 repo variables 개인화 표 추가.
- [ ] 템플릿 복사본은 git 히스토리가 없어 데모 글 날짜가 복사일이 됨 — README에 명시 (S)
- [ ] 데모 글을 실제 글로 교체 또는 draft 처리 (콘텐츠 작업)
