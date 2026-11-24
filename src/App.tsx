import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Copy, Menu, X } from 'lucide-react';

type SectionId = 'hero' | 'intro' | 'info' | 'contact';

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: '첫 화면' },
  { id: 'intro', label: '행사 소개' },
  { id: 'info', label: '핵심 정보' },
  { id: 'contact', label: '문의' },
];

const EVENT_SUMMARY_TEXT = [
  "2027 봄 워크숍 '함께 걷는 하루'",
  '주최: 온담컴퍼니 경영지원팀',
  '일시: 2027년 4월 16일(금) 09:30~16:00',
  '장소: 광교호수공원',
  '대상: 온담컴퍼니 전 직원',
  '문의: 경영지원팀 (연락처 미정)',
].join('\n');

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: SectionId) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    setActiveSection(id);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(EVENT_SUMMARY_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EVENT_SUMMARY_TEXT;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f8] text-[#13221a]">
      {/* 상단 고정 메뉴 (3영역 구성) */}
      <header className="sticky top-0 z-30 bg-[#f7f9f8]/95 backdrop-blur-sm border-b border-[#dde5e0]">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="font-display text-lg font-bold tracking-tight text-[#13221a] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1b5e3a]"
          >
            온담컴퍼니
          </a>

          <nav aria-label="행사 안내 주요 메뉴" className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  aria-current={isActive ? 'location' : undefined}
                  className={`py-1 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1b5e3a] ${
                    isActive
                      ? 'border-[#1b5e3a] text-[#13221a]'
                      : 'border-transparent text-[#4a5d52] hover:text-[#13221a]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('info')}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-lg bg-[#1b5e3a] text-white text-sm font-medium whitespace-nowrap shrink-0 hover:bg-[#154b2e] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e3a]"
            >
              핵심 정보 보기
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className="md:hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#cfd9d3] bg-white text-sm font-medium text-[#13221a] whitespace-nowrap shrink-0 hover:bg-[#eef2ef] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e3a]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
              <span>{mobileMenuOpen ? '닫기' : '메뉴'}</span>
            </button>
          </div>
        </div>

        {/* 모바일 펼침 메뉴 */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-panel"
            aria-label="모바일 행사 안내 메뉴"
            className="md:hidden border-t border-[#dde5e0] bg-white px-5 py-3"
          >
            <ul className="divide-y divide-[#eef2ef]">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className={`flex items-center justify-between min-h-[44px] py-2.5 text-base font-medium transition-colors ${
                        isActive ? 'text-[#1b5e3a]' : 'text-[#2c3f34]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="text-xs font-normal text-[#1b5e3a]">현재 위치</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* 1. 첫 화면 */}
        <section
          id="hero"
          className="scroll-mt-16 py-14 sm:py-20 lg:py-28"
        >
          <div className="max-w-[1120px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-8">
              <p className="text-sm font-medium text-[#1b5e3a] mb-4">
                온담컴퍼니 경영지원팀 주최
              </p>

              <h1
                className="font-display font-bold text-[#13221a] tracking-tight leading-[1.22] mb-6"
                style={{
                  fontSize: 'clamp(2.125rem, 4.4vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                2027 봄 워크숍
                <br />
                ‘함께 걷는 하루’
              </h1>

              <p className="text-base sm:text-lg text-[#3b4e43] leading-[1.75] max-w-2xl mb-10">
                봄날, 동료와 나란히 걷는 하루
              </p>

              {/* 날짜 · 장소 핵심 요약 스트립 */}
              <div className="border-y border-[#dde5e0] py-5 mb-9 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 max-w-2xl">
                <div>
                  <p className="text-xs font-medium text-[#5a6d62] mb-1">날짜</p>
                  <p className="text-base sm:text-lg font-semibold text-[#13221a] tabular-nums">
                    2027년 4월 16일(금) 09:30~16:00
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5a6d62] mb-1">장소</p>
                  <p className="text-base sm:text-lg font-semibold text-[#13221a]">
                    광교호수공원
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('info')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-[#1b5e3a] text-white text-sm font-medium whitespace-nowrap hover:bg-[#154b2e] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e3a]"
                >
                  <span>핵심 정보 확인하기</span>
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('intro')}
                  className="inline-flex items-center justify-center px-4 py-3 min-h-[44px] text-sm font-medium text-[#2f4539] hover:text-[#13221a] underline underline-offset-4 decoration-[#b8c6be] hover:decoration-[#13221a] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e3a]"
                >
                  행사 소개 읽기
                </button>
              </div>
            </div>

            {/* 외부 이미지 없이 호수 산책로를 상징하는 순수 기하학 선형 그래픽 */}
            <div className="hidden lg:flex lg:col-span-4 justify-end" aria-hidden="true">
              <div className="w-full max-w-[320px] border border-[#dde5e0] rounded-xl bg-white p-8">
                <svg
                  viewBox="0 0 240 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect x="0.5" y="0.5" width="239" height="279" rx="8" stroke="#eef2ef" />
                  <path
                    d="M28 214C62 184 96 196 126 168C156 140 166 98 212 72"
                    stroke="#1b5e3a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 232C70 202 104 214 136 184C168 154 180 116 212 94"
                    stroke="#8fb59f"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 194C58 168 92 178 118 152C144 126 156 80 212 52"
                    stroke="#c6d8cd"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                  <circle cx="64" cy="193" r="4" fill="#1b5e3a" />
                  <circle cx="176" cy="100" r="4" fill="#1b5e3a" />
                  <line x1="28" y1="252" x2="212" y2="252" stroke="#dde5e0" strokeWidth="1" />
                </svg>
                <div className="mt-5 pt-4 border-t border-[#eef2ef] flex items-center justify-between text-xs text-[#5a6d62] tabular-nums">
                  <span>2027.04.16</span>
                  <span>광교호수공원</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 행사 소개 (정확히 2문장) */}
        <section
          id="intro"
          className="scroll-mt-16 border-t border-[#dde5e0] py-16 sm:py-24"
        >
          <div className="max-w-[1120px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-medium text-[#5a6d62] mb-2">01. 안내</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#13221a] tracking-tight">
                행사 소개
              </h2>
            </div>

            <div className="lg:col-span-8 max-w-2xl">
              <p className="text-base sm:text-lg text-[#1f3127] leading-[1.85]">
                2027 봄 워크숍 ‘함께 걷는 하루’는 온담컴퍼니 전 직원이 광교호수공원을 함께 걸으며 소통하는 사내 행사입니다. 온담컴퍼니 경영지원팀이 주최하는 이번 워크숍은 2027년 4월 16일 금요일 오전 9시 30분부터 오후 4시까지 진행됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 핵심 정보 (일시, 장소, 대상) */}
        <section
          id="info"
          className="scroll-mt-16 border-t border-[#dde5e0] py-16 sm:py-24"
        >
          <div className="max-w-[1120px] mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-medium text-[#5a6d62] mb-2">02. 주요 사항</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#13221a] tracking-tight">
                  핵심 정보
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#cfd9d3] bg-white text-sm font-medium text-[#13221a] whitespace-nowrap self-start sm:self-auto hover:bg-[#eef2ef] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e3a]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#1b5e3a]" aria-hidden="true" />
                    <span>행사 정보 복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#4a5d52]" aria-hidden="true" />
                    <span>행사 정보 복사</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white border border-[#dde5e0] rounded-xl p-6 sm:p-8">
                <p className="text-xs font-medium text-[#5a6d62] mb-3">일시</p>
                <p className="text-lg sm:text-xl font-semibold text-[#13221a] tabular-nums leading-snug">
                  2027년 4월 16일(금)
                </p>
                <p className="text-base font-medium text-[#1b5e3a] tabular-nums mt-1.5">
                  09:30~16:00
                </p>
              </div>

              <div className="bg-white border border-[#dde5e0] rounded-xl p-6 sm:p-8">
                <p className="text-xs font-medium text-[#5a6d62] mb-3">장소</p>
                <p className="text-lg sm:text-xl font-semibold text-[#13221a] leading-snug">
                  광교호수공원
                </p>
              </div>

              <div className="bg-white border border-[#dde5e0] rounded-xl p-6 sm:p-8">
                <p className="text-xs font-medium text-[#5a6d62] mb-3">대상</p>
                <p className="text-lg sm:text-xl font-semibold text-[#13221a] leading-snug">
                  온담컴퍼니 전 직원
                </p>
              </div>
            </div>

            <div className="mt-4 bg-[#fafcfb] border border-[#dde5e0] rounded-xl px-6 py-4 sm:px-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#4a5d52]">
              <span>주최: 온담컴퍼니 경영지원팀</span>
              <span aria-hidden="true">·</span>
              <span>행사명: 2027 봄 워크숍 ‘함께 걷는 하루’</span>
            </div>
          </div>
        </section>

        {/* 4. 문의 */}
        <section
          id="contact"
          className="scroll-mt-16 border-t border-[#dde5e0] py-16 sm:py-24"
        >
          <div className="max-w-[1120px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-medium text-[#5a6d62] mb-2">03. 담당 부서</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#13221a] tracking-tight mb-3">
                문의
              </h2>
              <p className="text-sm sm:text-base text-[#4a5d52] leading-relaxed">
                행사 관련 문의 담당 부서 및 연락처 안내입니다.
              </p>
            </div>

            <div className="lg:col-span-8">
              <dl className="bg-white border border-[#dde5e0] rounded-xl divide-y divide-[#dde5e0]">
                <div className="px-6 py-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-baseline">
                  <dt className="text-sm font-medium text-[#5a6d62]">담당 부서</dt>
                  <dd className="sm:col-span-2 text-base font-semibold text-[#13221a]">
                    온담컴퍼니 경영지원팀
                  </dd>
                </div>

                <div className="px-6 py-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-baseline">
                  <dt className="text-sm font-medium text-[#5a6d62]">연락처</dt>
                  <dd className="sm:col-span-2 text-base font-semibold text-[#4a5d52]">
                    미정
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 안내 */}
      <footer className="border-t border-[#dde5e0] bg-[#eef2ef]">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-[#13221a]">
              온담컴퍼니 경영지원팀 · 2027 봄 워크숍 ‘함께 걷는 하루’
            </p>
            <p className="text-sm text-[#4a5d52]">
              교육용 가상 행사입니다
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg border border-[#cfd9d3] bg-white text-sm font-medium text-[#13221a] whitespace-nowrap hover:bg-[#f7f9f8] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e3a]"
          >
            <span>맨 위로</span>
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>
  );
}
