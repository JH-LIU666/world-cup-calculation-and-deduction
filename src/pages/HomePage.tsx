import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GROUPS } from '../data/groups';
import { TEAM_PINYIN_INITIAL } from '../data/teamSortKeys';
import { calculatePoints } from '../lib/calculator';
import { useAnalysisStore } from '../stores/analysisStore';
import GroupCard from '../components/GroupCard';
import GroupModal from '../components/GroupModal';

type Result = 'W' | 'D' | 'L';
type TargetRank = 1 | 2 | 3 | 4;

const ALL_TEAMS = GROUPS.flatMap((g) => g.teams);

const RANK_OPTIONS: { value: TargetRank; label: string }[] = [
  { value: 1, label: '小组第一' },
  { value: 2, label: '小组第二' },
  { value: 3, label: '小组第三' },
  { value: 4, label: '小组第四' },
];

function findGroupByTeam(teamId: string) {
  return GROUPS.find((g) => g.teams.some((t) => t.id === teamId)) ?? GROUPS[0];
}

/** 轻量 Toast */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                    bg-gray-900 text-white text-xs font-medium tracking-wider
                    px-5 py-3 rounded-xl shadow-lg animate-pulse">
      {message}
    </div>
  );
}

export default function HomePage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, Result>>(() => {
    try {
      const saved = localStorage.getItem('wc_predictions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [targetTeam, setTargetTeam] = useState<string>(() => {
    const saved = localStorage.getItem('wc_targetTeam');
    return saved && ALL_TEAMS.some((t) => t.id === saved) ? saved : (ALL_TEAMS[0]?.id ?? '');
  });
  const [targetRank, setTargetRank] = useState<TargetRank>(() => {
    const saved = localStorage.getItem('wc_targetRank');
    return saved && ['1','2','3','4'].includes(saved) ? (Number(saved) as TargetRank) : 2;
  });
  const [toast, setToast] = useState<string | null>(null);
  const [isThirdPlaceOpen, setIsThirdPlaceOpen] = useState(false);
  const toastKey = useRef(0);

  const navigate = useNavigate();
  const { runAnalysis, isLoading } = useAnalysisStore();

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('wc_targetTeam', targetTeam); }, [targetTeam]);
  useEffect(() => { localStorage.setItem('wc_targetRank', String(targetRank)); }, [targetRank]);
  useEffect(() => { localStorage.setItem('wc_predictions', JSON.stringify(predictions)); window.dispatchEvent(new Event('wc-predictions-changed')); }, [predictions]);

  const selectedGroup = useMemo(
    () => GROUPS.find((g) => g.id === selectedGroupId) ?? null,
    [selectedGroupId],
  );

  const handlePredictionChange = (matchId: string, result: Result | null) => {
    setPredictions((prev) => {
      if (result === null) {
        const next = { ...prev };
        delete next[matchId];
        return next;
      }
      return { ...prev, [matchId]: result };
    });
  };

  const showToast = useCallback((msg: string) => {
    toastKey.current += 1;
    setToast(msg);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!targetTeam) {
      showToast('请选择推演球队');
      return;
    }
    if (!targetRank) {
      showToast('请选择推演目标');
      return;
    }

    const group = findGroupByTeam(targetTeam);
    const teamList = group.teams.map((t) => ({ id: t.id, name: t.name }));
    const matches = group.matches.map((m) =>
      predictions[m.id] ? { ...m, result: predictions[m.id] } : m,
    );
    await runAnalysis(matches, teamList, targetTeam, targetRank);
    navigate('/analysis');
  }, [targetTeam, targetRank, predictions, runAnalysis, navigate, showToast]);

  return (
    <div className="min-h-screen w-full px-2 py-3 md:px-4 md:py-5 flex flex-col" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 40%, #fef3c7 100%)' }}>
      {/* Toast */}
      {toast && (
        <Toast
          key={toastKey.current}
          message={toast}
          onDone={() => setToast(null)}
        />
      )}

      {/* Header — 居中布局 */}
      <header className="w-full flex flex-col items-center mb-4 flex-shrink-0">
        {/* 标题 */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          小组赛积分计算
        </h1>
        <p className="text-sm text-gray-400 mt-1 mb-5 font-medium tracking-wide text-center">
          12 个小组 · 48 支球队 · 72 场比赛
        </p>

        {/* 工具栏 — 双药丸布局 */}
        <div className="flex items-center gap-2.5 flex-nowrap">

          {/* 药丸 1：输入设置 + 所有情况 */}
          <div className="flex items-center gap-0.5 bg-white/70 backdrop-blur-xl border border-white/60 rounded-full p-1 flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)] h-[42px]">
            <select
              value={targetTeam}
              onChange={(e) => setTargetTeam(e.target.value)}
              className="appearance-none text-sm font-medium text-gray-600 bg-transparent rounded-full pl-4 pr-8 py-2 outline-none cursor-pointer tracking-wide hover:bg-gray-100/60 transition-all duration-200 max-w-[110px] truncate"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {ALL_TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="w-px h-5 bg-gray-200/70" />
            <select
              value={targetRank}
              onChange={(e) => setTargetRank(Number(e.target.value) as TargetRank)}
              className="appearance-none text-sm font-medium text-gray-600 bg-transparent rounded-full pl-4 pr-8 py-2 outline-none cursor-pointer tracking-wide hover:bg-gray-100/60 transition-all duration-200"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {RANK_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <div className="w-px h-5 bg-gray-200" />
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-1 px-4 rounded-full
                         text-sm font-medium text-gray-600 whitespace-nowrap
                         hover:bg-gray-100/60
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 h-full"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  计算中
                </>
              ) : (
                '所有情况'
              )}
            </button>
          </div>

          {/* 药丸 2：小组第三排名 */}
          <button
            onClick={() => setIsThirdPlaceOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 rounded-full h-[42px]
                       bg-white/70 backdrop-blur-xl border border-white/60 text-gray-700 text-sm font-medium flex-shrink-0
                       shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]
                       hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:-translate-y-0.5
                       transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/>
            </svg>
            小组第三排名
          </button>

          {/* 重置 — 仅图标 */}
          <button
            onClick={() => {
              if (!window.confirm('确定重置小组赛吗？\n\n所有比分将清零，积分归零。\n淘汰赛数据不受影响。')) return;
              setPredictions({});
              localStorage.removeItem('wc_predictions');
              window.dispatchEvent(new Event('wc-predictions-changed'));
            }}
            className="w-[42px] h-[42px] flex items-center justify-center rounded-full
                       bg-white/70 backdrop-blur-xl border border-white/60 text-gray-400 flex-shrink-0
                       shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]
                       hover:text-red-500 hover:bg-red-50/80 hover:border-red-200
                       transition-all duration-300"
            title="重置"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>
      </header>

      {/* Group grid — 4 cols × 3 rows, fits viewport */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-fr min-h-0">
        {GROUPS.map((g) => {
          const played = g.matches
            .filter((m) => predictions[m.id])
            .map((m) => ({ ...m, result: predictions[m.id]! }));
          const top2 = calculatePoints(played, g.teams).slice(0, 2);

          return (
            <GroupCard
              key={g.id}
              groupId={g.id}
              groupName={g.name}
              teams={g.teams}
              top2={top2}
              onClick={() => setSelectedGroupId(g.id)}
            />
          );
        })}
      </div>

      {selectedGroup && (
        <GroupModal
          group={selectedGroup}
          predictions={predictions}
          onChange={handlePredictionChange}
          onClose={() => setSelectedGroupId(null)}
        />
      )}

      {/* 小组第三晋级弹窗 */}
      {isThirdPlaceOpen && (
        <ThirdPlaceModal predictions={predictions} onClose={() => setIsThirdPlaceOpen(false)} />
      )}

    </div>
  );
}

/* ── FIFA third‑place ranking (12→8) ── */
interface ThirdRow { group: string; team: string; pts: number; tid: string }

function getThirdPlacedTeams(predictions: Record<string, string>): ThirdRow[] {
  return GROUPS.map(g => {
    const matches = g.matches.map(m => ({ ...m, result: (predictions[m.id] as 'W'|'D'|'L'|null) ?? null }));
    const standings = calculatePoints(matches, g.teams);
    const third = standings[2];
    return { group: g.id, team: third?.name ?? g.teams[2].name, pts: third?.points ?? 0, tid: third?.id ?? g.teams[2].id };
  }).sort((a, b) => b.pts - a.pts || TEAM_PINYIN_INITIAL[a.tid]?.localeCompare(TEAM_PINYIN_INITIAL[b.tid] ?? 'z') || a.tid.localeCompare(b.tid));
}

function ThirdPlaceModal({ predictions, onClose }: { predictions: Record<string, string>; onClose: () => void }) {
  const rows = useMemo(() => getThirdPlacedTeams(predictions), [predictions]);
  const top8 = useMemo(() => rows.slice(0, 8).map(r => r.group), [rows]);

  // Auto-sync standings to local file via Vite API
  useEffect(() => {
    fetch('/api/third-place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ top8, all: rows }),
    }).catch(() => {}); // silent fail if server not ready
  }, [rows, top8]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-slate-800 tracking-widest">📊 小组第三积分榜<sup className="text-[10px] text-slate-400 ml-1">12选8</sup></h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors text-2xl leading-none">&times;</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-100 text-slate-400 text-[10px] tracking-widest uppercase">
              <th className="py-2.5 text-left w-10 font-bold">#</th>
              <th className="py-2.5 text-left w-10 font-bold">组</th>
              <th className="py-2.5 text-left font-bold">球队</th>
              <th className="py-2.5 text-center w-14 font-bold">积分</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.group}
                className={`border-b border-slate-50 transition-colors ${
                  i < 8 ? 'bg-gradient-to-r from-emerald-50/60 to-transparent' : 'bg-slate-50/30 text-slate-400'
                }`}>
                <td className={`py-3 font-black ${i < 8 ? 'text-emerald-500' : 'text-slate-300'}`}>{i + 1}</td>
                <td className={`py-3 font-bold ${i < 8 ? 'text-slate-700' : 'text-slate-400'}`}>{t.group}</td>
                <td className={`py-3 font-semibold ${i < 8 ? 'text-slate-800' : 'text-slate-400'}`}>{t.team}</td>
                <td className={`py-3 text-center font-extrabold text-lg ${i < 8 ? 'text-emerald-600' : 'text-slate-300'}`}>{t.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Cut‑off line */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-dashed border-red-300"/>
          <span className="text-[10px] font-black text-red-400 tracking-widest whitespace-nowrap">⬆ 晋级截止线 ⬇</span>
          <hr className="flex-1 border-dashed border-red-300"/>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold tracking-wide">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm inline-block"/>前8名晋级</span>
          <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-3 rounded-full bg-slate-300 inline-block"/>后4名淘汰</span>
        </div>
      </div>
    </div>
  );
}
