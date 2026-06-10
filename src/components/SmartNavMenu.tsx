import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface Props {
  onGoHome: () => void;
  onGoGroup: () => void;
  onGoBracket: () => void;
  /** 'group' → 弹出：首页 + 淘汰赛；'bracket' → 弹出：首页 + 小组赛 */
  currentPage: 'group' | 'bracket';
}

const SPRING = { type: 'spring' as const, stiffness: 350, damping: 25 };
const STAGGER = 0.06;

export default function SmartNavMenu({ onGoHome, onGoGroup, onGoBracket, currentPage }: Props) {
  const [hovered, setHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const items: MenuItem[] =
    currentPage === 'group'
      ? [
          { label: '首页', onClick: onGoHome },
          { label: '淘汰赛', onClick: onGoBracket },
        ]
      : [
          { label: '首页', onClick: onGoHome },
          { label: '小组赛', onClick: onGoGroup },
        ];

  const handleEnter = () => {
    if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleLeave = () => {
    timeoutRef.current = window.setTimeout(() => setHovered(false), 120);
  };

  return (
    <div
      className="fixed top-6 right-8 md:top-8 md:right-12 z-50 flex items-center gap-2"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── 基础圆形箭头按钮 ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="order-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md
                   border border-black/5
                   shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)]
                   flex items-center justify-center
                   hover:bg-white/90 hover:shadow-md
                   transition-shadow duration-300"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
             className="text-gray-600">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </motion.button>

      {/* ── 展开菜单面板 (AnimatePresence + spring) ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0.3, scaleY: 0.6, originX: 1, originY: 0.5 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleX: 0.5, scaleY: 0.7, transition: { duration: 0.15 } }}
            transition={SPRING}
            style={{ transformOrigin: 'right center' }}
            className="order-1 flex items-center gap-1 px-2 py-1.5
                       bg-white/70 backdrop-blur-xl border border-white/40
                       rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]"
          >
            {items.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8, transition: { duration: 0.1 } }}
                transition={{ ...SPRING, delay: i * STAGGER }}
                onClick={() => {
                  item.onClick();
                  setHovered(false);
                }}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                whileTap={{ scale: 0.92 }}
                className="relative px-3 py-1.5 rounded-full text-sm font-medium
                           transition-colors duration-200 select-none"
                style={{
                  color: hoveredItem === item.label ? '#007AFF' : '#374151',
                  backgroundColor: hoveredItem === item.label
                    ? 'rgba(0,122,255,0.06)'
                    : 'transparent',
                }}
              >
                {item.label}
                {/* 选中指示点 */}
                {hoveredItem === item.label && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#007AFF]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
