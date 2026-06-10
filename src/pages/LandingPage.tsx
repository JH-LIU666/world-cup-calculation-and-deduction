import type { FC } from 'react';
import WebsiteIntro from '../components/WebsiteIntro';

interface Props {
  onEnterGroup: () => void;
  onEnterBracket: () => void;
}

const LandingPage: FC<Props> = ({ onEnterGroup, onEnterBracket }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{
        background: '#F5F5F7',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
      }}
    >
      {/* ═══════════ Hero ═══════════ */}
      <header className="text-center max-w-2xl md:max-w-3xl mb-10 md:mb-12 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-[-0.02em] leading-[1.1]
                       bg-clip-text text-transparent
                       bg-gradient-to-br from-gray-900 via-gray-700 to-gray-400">
          世界杯
          <br />
          小组赛积分计算与淘汰赛晋级推演
        </h1>
        <p className="mt-4 text-sm md:text-base text-gray-400 font-normal tracking-[0.05em]">
          39 天 · 48 个国家 · 104 场比赛
        </p>
      </header>

      {/* ═══════════ Cards ═══════════ */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 flex-shrink-0">
        {/* ── Card 1: 小组赛 ── */}
        <button
          onClick={onEnterGroup}
          className="group relative bg-white/80 backdrop-blur-2xl rounded-[2rem] p-10 text-left
                     border border-white/80
                     shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04),0_8px_40px_-16px_rgba(0,0,0,0.06)]
                     hover:-translate-y-2 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08),0_16px_56px_-24px_rgba(0,0,0,0.10)]
                     active:scale-[0.98]
                     transition-all duration-500 ease-[cubic-bezier(0.22,0.1,0,1)]
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-4 focus:ring-offset-[#F5F5F7]"
        >
          {/* Top gloss */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50
                          flex items-center justify-center mb-7
                          shadow-[0_4px_16px_-4px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]
                          group-hover:shadow-[0_8px_24px_-6px_rgba(16,185,129,0.18)]
                          transition-shadow duration-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-3 group-hover:text-emerald-700 transition-colors duration-300">
            小组赛积分计算
          </h2>
          <p className="text-[15px] text-gray-400 font-normal leading-relaxed">
            手动录入输赢，自动计算积分，晋级一目了然。
          </p>

          <div className="mt-6 flex items-center gap-2 text-gray-300 opacity-0 group-hover:opacity-100
                          group-hover:text-emerald-500 translate-x-0 group-hover:translate-x-1
                          transition-all duration-400 ease-out">
            <span className="text-sm font-semibold">进入</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* ── Card 2: 淘汰赛 ── */}
        <button
          onClick={onEnterBracket}
          className="group relative bg-white/80 backdrop-blur-2xl rounded-[2rem] p-10 text-left
                     border border-white/80
                     shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04),0_8px_40px_-16px_rgba(0,0,0,0.06)]
                     hover:-translate-y-2 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08),0_16px_56px_-24px_rgba(0,0,0,0.10)]
                     active:scale-[0.98]
                     transition-all duration-500 ease-[cubic-bezier(0.22,0.1,0,1)]
                     focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-4 focus:ring-offset-[#F5F5F7]"
        >
          {/* Top gloss */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50
                          flex items-center justify-center mb-7
                          shadow-[0_4px_16px_-4px_rgba(139,92,246,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]
                          group-hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.18)]
                          transition-shadow duration-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="2" x2="9" y2="8" /><line x1="9" y1="10" x2="9" y2="16" />
              <line x1="9" y1="18" x2="9" y2="22" /><line x1="3" y1="5" x2="9" y2="5" />
              <line x1="3" y1="13" x2="9" y2="13" /><line x1="3" y1="21" x2="9" y2="21" />
              <line x1="15" y1="3" x2="21" y2="3" /><line x1="15" y1="5.5" x2="18" y2="5.5" />
              <line x1="15" y1="8" x2="21" y2="8" /><line x1="15" y1="11" x2="21" y2="11" />
              <line x1="15" y1="13.5" x2="18" y2="13.5" /><line x1="15" y1="16" x2="21" y2="16" />
              <line x1="15" y1="19" x2="21" y2="19" /><line x1="15" y1="21.5" x2="18" y2="21.5" />
              <line x1="15" y1="23" x2="21" y2="23" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-3 group-hover:text-purple-700 transition-colors duration-300">
            淘汰赛晋级推演
          </h2>
          <p className="text-[15px] text-gray-400 font-normal leading-relaxed">
            基于官方规则生成 32 强至决赛的完整对阵树状图，一键晋级推演。
          </p>

          <div className="mt-6 flex items-center gap-2 text-gray-300 opacity-0 group-hover:opacity-100
                          group-hover:text-purple-500 translate-x-0 group-hover:translate-x-1
                          transition-all duration-400 ease-out">
            <span className="text-sm font-semibold">进入</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* ═══════════ Footer ═══════════ */}
      <footer className="mt-10 text-center flex-shrink-0">
        <p className="text-[10px] text-gray-300 font-medium tracking-normal">
          2026 FIFA World Cup™ Simulator · 仅供娱乐
        </p>
      </footer>

      <WebsiteIntro />
    </div>
  );
};

export default LandingPage;
