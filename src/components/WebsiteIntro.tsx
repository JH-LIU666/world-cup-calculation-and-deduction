import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEEN_KEY = 'wc_intro_seen';

export default function WebsiteIntro() {
  const [open, setOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);

  // 首次访问才弹出，后续不再自动弹出
  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
    }
  }, []);

  const close = useCallback(() => { setOpen(false); localStorage.setItem(SEEN_KEY, '1'); }, []);
  const toggle = useCallback(() => setOpen(v => !v), []);

  return (
    <>
      {/* ── Triggers ── */}
      <div className="fixed top-6 right-6 md:top-8 md:right-10 z-40 flex flex-col items-end gap-2">
        <button
          onClick={toggle}
          className="px-3.5 py-2 rounded-full
                     bg-white/80 backdrop-blur-md border border-black/5
                     shadow-sm text-gray-500 text-xs font-medium tracking-wide
                     hover:scale-105 hover:bg-white hover:text-gray-800
                     active:scale-95 transition-all duration-200"
        >
          功能介绍
        </button>

        <button
          onClick={() => setIsLinksOpen(true)}
          className="px-3.5 py-2 rounded-full
                     bg-white/80 backdrop-blur-md border border-black/5
                     shadow-sm text-gray-500 text-xs font-medium tracking-wide
                     hover:scale-105 hover:bg-white hover:text-gray-800
                     active:scale-95 transition-all duration-200"
        >
          足球网站
        </button>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={close}
            />

            {/* Card */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative bg-white/90 backdrop-blur-2xl rounded-[28px] shadow-2xl
                         border border-white/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto
                         p-6 md:p-8"
            >
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center
                           rounded-full bg-black/5 text-gray-400 hover:bg-black/10 hover:text-gray-700
                           transition-colors z-10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* ═══════════ Title ═══════════ */}
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">
                世界杯比赛计算器
              </h2>

              {/* ═══════════ Hero — Two Columns ═══════════ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left: 小组赛 */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <span>⚽</span> 小组赛积分计算
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    在充满悬念的 12 个小组中，掌控每一场对决：
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>
                      <span><b className="text-gray-900 font-semibold">自由模拟</b>：任意点选各场次的胜平负，积分与排名即时动态刷新。</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>
                      <span><b className="text-gray-900 font-semibold">逆向推演</b>：锁定特定球队与目标排名，智能穷举出所有可能的比赛走向。</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>
                      <span><b className="text-gray-900 font-semibold">出线判定</b>：严格遵循官方规则，跨小组精准筛选"最佳小组第三"的 8 个晋级名额。</span>
                    </li>
                  </ul>
                </div>

                {/* Right: 淘汰赛 */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <span>🏆</span> 淘汰赛晋级推演
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    见证 32 强热血集结，亲手绘制您的冠军之路：
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>
                      <span><b className="text-gray-900 font-semibold">联动生成</b>：基于小组赛推演结果，完美还原官方规则，自动编排 32 强上下半区对阵。</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>
                      <span><b className="text-gray-900 font-semibold">一键晋级</b>：轻点球队名称即可模拟胜出，纵览从 1/16 决赛直达大力神杯的完整轨迹。</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ═══════════ Divider ═══════════ */}
              <div className="h-[1px] bg-gray-200/60 my-6" />

              {/* ═══════════ Footer Notes ═══════════ */}
              <div className="bg-gray-50/75 border border-gray-100 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2.5">
                  <span>💡</span> 说明与规则附注
                </h4>
                <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-0.5 flex-shrink-0 text-[10px]">1.</span>
                    <span><b className="text-gray-600 font-semibold">纯粹的推演乐趣</b>：本项目仅供娱乐演示。在判定"最佳小组第三"时，算法采用极简的"积分优先，同分则按首字母先后排序"逻辑，暂不计入总净胜球、进球数及公平竞赛积分等官方次级权重因素。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-0.5 flex-shrink-0 text-[10px]">2.</span>
                    <span><b className="text-gray-600 font-semibold">绝对严密的穷举</b>：球队排名目标的"逆向推演"功能基于全量穷举算法驱动，覆盖 100% 的赛果可能性，确保每一条出线路径都不被遗漏。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-0.5 flex-shrink-0 text-[10px]">3.</span>
                    <span><b className="text-gray-600 font-semibold">权威的对阵落位</b>：淘汰赛的阵型编排（包含 24 支直通球队与 8 支成绩最好的小组第三的淘汰赛位置）严格遵照国际足联《FWC26_regulations_EN》官方规程执行。</span>
                  </li>
                </ul>
              </div>

              {/* Close button */}
              <button
                onClick={close}
                className="mt-6 w-full py-2.5 rounded-xl bg-gray-100/80 text-sm font-medium text-gray-600
                           hover:bg-gray-200/80 active:scale-[0.98] transition-all duration-200"
              >
                开始使用
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ Quick Links Modal ═══════════ */}
      <AnimatePresence>
        {isLinksOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsLinksOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative bg-white/90 backdrop-blur-2xl rounded-[28px] shadow-2xl
                         border border-white/50 w-full max-w-md p-6"
            >
              <button
                onClick={() => setIsLinksOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center
                           rounded-full bg-black/5 text-gray-400 hover:bg-black/10 hover:text-gray-700
                           transition-colors z-10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <h3 className="text-base font-bold text-gray-900 mb-1">官方与实用资源直达</h3>
              <p className="text-xs text-gray-400 mb-5">🔗 点击直达官方或权威第三方赛事平台</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '📺 官方转播', url: 'plus.fifa.com', href: 'https://plus.fifa.com/' },
                  { label: '🇨🇳 央视直播', url: 'tv.cctv.com', href: 'https://tv.cctv.com/live/cctv5/' },
                  { label: '⚽ 实时比分', url: 'fifa.com/match-centre', href: 'https://www.fifa.com/en/match-centre' },
                  { label: '📜 官方规程', url: 'fifa.com/articles', href: 'https://ppr-www.fifa.com/en/articles/groups-how-teams-qualify-tie-breakers' },
                  { label: '🎫 官方售票', url: 'fifa.com/tickets', href: 'https://www.fifa.com/tickets' },
                  { label: '📰 球迷社区', url: 'dongqiudi.com', href: 'https://www.dongqiudi.com/' },
                ].map(({ label, url, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-gray-700 border border-gray-100 shadow-sm
                               hover:shadow-md hover:border-gray-300 hover:text-gray-950
                               px-3.5 py-2.5 rounded-xl
                               flex flex-col gap-0.5
                               transition-all active:scale-95"
                  >
                    <span className="text-xs font-medium flex items-center justify-between">
                      {label}
                      <span className="text-gray-300 flex-shrink-0 ml-1">↗</span>
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">{url}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
