import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { GROUPS } from '../data/groups';
import { calculatePoints } from '../lib/calculator';
import { getThirdPlaceMapping } from '../data/thirdPlaceMatrix';
import { TEAM_PINYIN_INITIAL } from '../data/teamSortKeys';
import type { Match } from '../types/worldcup';

// ── Types ──────────────────────────────────────────────
interface MatchSlot { id: string; teamA: string; teamB: string; quad?: string }
type Tier = 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'third';
interface HalfData { r32: MatchSlot[]; r16: MatchSlot[]; qf: MatchSlot[]; sf: MatchSlot[] }
interface Conn { from: string; to: string; side: 'L' | 'R' }
type ConnMap = Conn[];

// ── Vibrant quadrant styles ──────────────────────────
const QS: Record<string, { bg: string; border: string; shadow: string }> = {
  blue:  { bg: 'bg-gradient-to-b from-blue-500 to-blue-700', border: 'border-blue-400/60', shadow: 'shadow-blue-500/25' },
  teal:  { bg: 'bg-gradient-to-b from-teal-500 to-teal-700', border: 'border-teal-400/60',  shadow: 'shadow-teal-500/25' },
  green: { bg: 'bg-gradient-to-b from-emerald-500 to-emerald-700', border: 'border-emerald-400/60', shadow: 'shadow-emerald-500/25' },
  red:   { bg: 'bg-gradient-to-b from-rose-500 to-rose-700',  border: 'border-rose-400/60',  shadow: 'shadow-rose-500/25' },
};
const RS: Record<Tier, { bg: string; border: string; shadow: string }> = {
  r32:   { bg: '', border: '', shadow: '' },
  r16:   { bg: 'bg-gradient-to-b from-purple-500 to-purple-700', border: 'border-purple-400/60',  shadow: 'shadow-purple-500/25' },
  qf:    { bg: 'bg-gradient-to-b from-sky-500 to-sky-700',      border: 'border-sky-400/60',     shadow: 'shadow-sky-500/25' },
  sf:    { bg: 'bg-gradient-to-b from-orange-500 to-orange-700', border: 'border-orange-400/60', shadow: 'shadow-orange-500/25' },
  final: { bg: 'bg-gradient-to-b from-amber-400 to-amber-600',  border: 'border-amber-300/60',  shadow: 'shadow-amber-400/30' },
  third: { bg: 'bg-gradient-to-b from-slate-500 to-slate-700',  border: 'border-slate-400/60',  shadow: 'shadow-slate-500/20' },
};

// ── Knockout winners state (persisted) ────────────────
type WinnerMap = Record<string, string>; // matchId → winner team name

function useKnockoutWinners(): [WinnerMap, (matchId: string, team: string) => void, () => void] {
  const [winners, setWinners] = useState<WinnerMap>(() => {
    try { return JSON.parse(localStorage.getItem('wc_ko_winners') || '{}'); } catch { return {}; }
  });
  const setWinner = useCallback((matchId: string, team: string) => {
    setWinners(prev => {
      const next = { ...prev };
      if (next[matchId] === team) delete next[matchId]; // toggle off
      else next[matchId] = team;
      localStorage.setItem('wc_ko_winners', JSON.stringify(next));
      return next;
    });
  }, []);
  const clearWinners = useCallback(() => {
    setWinners({});
    localStorage.removeItem('wc_ko_winners');
  }, []);
  return [winners, setWinner, clearWinners];
}

// ── Propagate winners to downstream match slots ────────
function propagateWinners(
  half: HalfData, r32: MatchSlot[], r16: MatchSlot[], winners: WinnerMap,
): { r32: MatchSlot[]; r16: MatchSlot[]; qf: MatchSlot[]; sf: MatchSlot[] } {
  // Apply winners to R32 → display which team advanced
  const resolvedR32 = r32.map(m => ({
    ...m,
    teamA: m.teamA, teamB: m.teamB, // keep original teams
  }));

  // Propagate R32 winners → R16
  const resolvedR16 = half.r16.map((m, i) => {
    const a = winners[r32[i * 2]?.id] || '';
    const b = winners[r32[i * 2 + 1]?.id] || '';
    return { ...m, teamA: a, teamB: b };
  });

  // Propagate R16 winners → QF
  const resolvedQF = half.qf.map((m, i) => {
    const a = winners[resolvedR16[i * 2]?.id] || '';
    const b = winners[resolvedR16[i * 2 + 1]?.id] || '';
    return { ...m, teamA: a, teamB: b };
  });

  // Propagate QF winners → SF
  const resolvedSF = half.sf.map((m, i) => {
    const a = winners[resolvedQF[i * 2]?.id] || '';
    const b = winners[resolvedQF[i * 2 + 1]?.id] || '';
    return { ...m, teamA: a, teamB: b };
  });

  return { r32: resolvedR32, r16: resolvedR16, qf: resolvedQF, sf: resolvedSF };
}

// ── Reactive group‑standings hook (event‑driven, no polling) ──
function parsePredictions(): Record<string, Match[]> {
  try {
    const raw = localStorage.getItem('wc_predictions');
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    const byGroup: Record<string, Match[]> = {};
    for (const g of GROUPS) {
      byGroup[g.id] = g.matches.map(m => ({ ...m, result: (map[m.id] as Match['result']) ?? null }));
    }
    return byGroup;
  } catch { return {}; }
}

function usePredictions(): Record<string, Match[]> {
  const [preds, setPreds] = useState<Record<string, Match[]>>(parsePredictions);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === 'wc_predictions') setPreds(parsePredictions()); };
    const onCustom = () => setPreds(parsePredictions());
    const onFocus  = () => setPreds(parsePredictions());
    window.addEventListener('storage', onStorage);
    window.addEventListener('wc-predictions-changed', onCustom);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wc-predictions-changed', onCustom);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
  return preds;
}

// ── Derived knockout data (reactive) ───────────────────
function useKnockoutData(preds: Record<string, Match[]>) {
  return useMemo(() => {
    function top2(gid: string) {
      const g = GROUPS.find(x => x.id === gid)!;
      const matches = preds[gid] ?? g.matches;
      const hasResults = matches.some(m => m.result !== null);
      if (hasResults) {
        const s = calculatePoints(matches, g.teams);
        return { first: s[0]?.name ?? g.teams[0].name, second: s[1]?.name ?? g.teams[1].name };
      }
      return { first: g.teams[0].name, second: g.teams[1].name };
    }
    const T = '待定(TBD)';
    const A=top2('A'),B=top2('B'),C=top2('C'),D=top2('D'),E=top2('E'),F=top2('F'),
          G=top2('G'),H=top2('H'),I=top2('I'),J=top2('J'),K=top2('K'),L=top2('L');

    // ── Best 8 third‑placed teams → slot mapping ──
    const allThirds = GROUPS.map(g => {
      const matches = preds[g.id] ?? g.matches;
      const s = calculatePoints(matches, g.teams);
      const t = s[2];
      return { group: g.id, name: t?.name ?? g.teams[2].name, pts: t?.points ?? 0, tid: t?.id ?? g.teams[2].id };
    }).sort((a, b) => b.pts - a.pts || (TEAM_PINYIN_INITIAL[a.tid] ?? 'z').localeCompare(TEAM_PINYIN_INITIAL[b.tid] ?? 'z') || a.tid.localeCompare(b.tid));
    const top8 = allThirds.slice(0, 8).map(t => t.group);
    const thirdMap: Record<string, string> = top8.length === 8 ? getThirdPlaceMapping(top8) : {};
    const third = (slot: string) => {
      const g = (thirdMap[slot] ?? '').replace('3', '');
      const t = allThirds.find(x => x.group === g);
      return t?.name ?? T;
    };

    // Cascade reset: downstream rounds always start empty
    const empty16 = (id: string) => ({ id, teamA: '', teamB: '' });
    const left: HalfData = {
      r32: [
        { id:'M74', teamA: E.first,  teamB: third('M74'), quad:'blue' },
        { id:'M77', teamA: I.first,  teamB: third('M77'), quad:'blue' },
        { id:'M73', teamA: A.second, teamB: B.second, quad:'blue' },
        { id:'M75', teamA: F.first,  teamB: C.second, quad:'blue' },
        { id:'M83', teamA: K.second, teamB: L.second, quad:'teal' },
        { id:'M84', teamA: H.first,  teamB: J.second, quad:'teal' },
        { id:'M81', teamA: D.first,  teamB: third('M81'), quad:'teal' },
        { id:'M82', teamA: G.first,  teamB: third('M82'), quad:'teal' },
      ],
      r16: [empty16('L16a'),empty16('L16b'),empty16('L16c'),empty16('L16d')],
      qf:  [empty16('LQa'),empty16('LQb')],
      sf:  [empty16('LSF')],
    };
    const right: HalfData = {
      r32: [
        { id:'M76', teamA: C.first,  teamB: F.second, quad:'green' },
        { id:'M78', teamA: E.second, teamB: I.second, quad:'green' },
        { id:'M79', teamA: A.first,  teamB: third('M79'), quad:'green' },
        { id:'M80', teamA: L.first,  teamB: third('M80'), quad:'green' },
        { id:'M86', teamA: J.first,  teamB: H.second, quad:'red' },
        { id:'M88', teamA: D.second, teamB: G.second, quad:'red' },
        { id:'M85', teamA: B.first,  teamB: third('M85'), quad:'red' },
        { id:'M87', teamA: K.first,  teamB: third('M87'), quad:'red' },
      ],
      r16: [empty16('R16a'),empty16('R16b'),empty16('R16c'),empty16('R16d')],
      qf:  [empty16('RQa'),empty16('RQb')],
      sf:  [empty16('RSF')],
    };
    return { left, right, finalM: { id:'FINAL', teamA:'', teamB:'' } as MatchSlot, thirdM: { id:'3RD', teamA:'', teamB:'' } as MatchSlot };
  }, [preds]);
}

// ── Connection graph: source → target for each half ────
function buildConnMap(L: HalfData, R: HalfData): { left: ConnMap; right: ConnMap } {
  const l: ConnMap = [];
  // R32 → R16
  for (let i = 0; i < 4; i++) {
    l.push({ from: L.r32[i*2].id, to: L.r16[i].id, side:'L' });
    l.push({ from: L.r32[i*2+1].id, to: L.r16[i].id, side:'L' });
  }
  // R16 → QF
  for (let i = 0; i < 2; i++) {
    l.push({ from: L.r16[i*2].id, to: L.qf[i].id, side:'L' });
    l.push({ from: L.r16[i*2+1].id, to: L.qf[i].id, side:'L' });
  }
  // QF → SF
  l.push({ from: L.qf[0].id, to: L.sf[0].id, side:'L' });
  l.push({ from: L.qf[1].id, to: L.sf[0].id, side:'L' });
  // SF → Final
  l.push({ from: L.sf[0].id, to: 'FINAL', side:'L' });
  // SF → 3RD
  l.push({ from: L.sf[0].id, to: '3RD', side:'L' });

  const r: ConnMap = [];
  for (let i = 0; i < 4; i++) {
    r.push({ from: R.r32[i*2].id, to: R.r16[i].id, side:'R' });
    r.push({ from: R.r32[i*2+1].id, to: R.r16[i].id, side:'R' });
  }
  for (let i = 0; i < 2; i++) {
    r.push({ from: R.r16[i*2].id, to: R.qf[i].id, side:'R' });
    r.push({ from: R.r16[i*2+1].id, to: R.qf[i].id, side:'R' });
  }
  r.push({ from: R.qf[0].id, to: R.sf[0].id, side:'R' });
  r.push({ from: R.qf[1].id, to: R.sf[0].id, side:'R' });
  r.push({ from: R.sf[0].id, to: 'FINAL', side:'R' });
  r.push({ from: R.sf[0].id, to: '3RD', side:'R' });

  return { left: l, right: r };
}

// ══════════════════════════════════════════════════════
function MatchCard({ m, tier, winner, onPick }: {
  m: MatchSlot; tier: Tier;
  winner: string | null;
  onPick: (team: string) => void;
}) {
  const s = m.quad ? QS[m.quad] : RS[tier];
  const hasTeams = !!(m.teamA || m.teamB);
  const teamAWinner = hasTeams && winner === m.teamA;
  const teamBWinner = hasTeams && winner === m.teamB;
  const anyWinner = teamAWinner || teamBWinner;

  return (
    <div data-match-id={m.id}
      style={{ width: '104px', height: '56px' }}
      className={`flex-shrink-0 rounded-xl border ${s.border} shadow-lg ${s.shadow}
      flex flex-col items-center justify-center gap-[1px]
      transition-all duration-300 ease-out
      ${anyWinner ? 'scale-105 ring-1 ring-white/30' : 'hover:scale-[1.03]'}
      ${s.bg || 'bg-slate-600/80 backdrop-blur-sm'}`}>
      <div className="text-white font-semibold truncate text-[10px] leading-tight w-full text-center px-0.5 cursor-pointer"
           onClick={() => hasTeams && onPick(m.teamA)}>
        {teamAWinner
          ? <span className="inline-block rounded-md px-1.5 py-px ring-1 ring-white/80 bg-white/20 animate-pulse">{m.teamA}</span>
          : <span className="opacity-90 hover:opacity-100 hover:scale-105 inline-block transition-transform">{m.teamA||'—'}</span>}
      </div>
      <div className="text-white/50 text-[8px] leading-none select-none font-bold tracking-widest">VS</div>
      <div className="text-white font-semibold truncate text-[10px] leading-tight w-full text-center px-0.5 cursor-pointer"
           onClick={() => hasTeams && onPick(m.teamB)}>
        {teamBWinner
          ? <span className="inline-block rounded-md px-1.5 py-px ring-1 ring-white/80 bg-white/20 animate-pulse">{m.teamB}</span>
          : <span className="opacity-90 hover:opacity-100 hover:scale-105 inline-block transition-transform">{m.teamB||'—'}</span>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
function Col({ matches, tier, winners, onPick }: {
  matches: MatchSlot[]; tier: Tier;
  winners: WinnerMap; onPick: (id: string, team: string) => void;
}) {
  const card = (m: MatchSlot) => (
    <MatchCard key={m.id} m={m} tier={tier}
      winner={winners[m.id] ?? null}
      onPick={(team) => onPick(m.id, team)} />
  );
  const n = matches.length;
  if (n === 1) return <div className="h-full flex flex-col justify-center items-center">{card(matches[0])}</div>;
  if (n === 8) {
    const pairs = [];
    for (let i = 0; i < 8; i += 2) {
      pairs.push(<div key={i} className="flex flex-col items-center gap-1">{card(matches[i])}{card(matches[i+1])}</div>);
    }
    return <div className="h-full flex flex-col justify-around items-center">{pairs}</div>;
  }
  return <div className="h-full flex flex-col justify-around items-center">{matches.map(m => card(m))}</div>;
}

const STAGE_COLORS: Record<Tier, string> = {
  r32:'text-slate-400', r16:'text-purple-500', qf:'text-sky-600', sf:'text-orange-500', final:'text-amber-500', third:'text-slate-500',
};
function StageLabel({ tier }: { tier: Tier }) {
  const L: Record<Tier,string> = { r32:'1/16决赛', r16:'1/8决赛', qf:'1/4决赛', sf:'半决赛', final:'决赛', third:'三四名' };
  return <span className={`text-[10px] sm:text-xs font-bold tracking-widest whitespace-nowrap ${STAGE_COLORS[tier]}`}>{L[tier]}</span>;
}

// ══════════════════════════════════════════════════════
//  SVG connector overlay
// ══════════════════════════════════════════════════════
const BracketLines = memo(function BracketLines({ connMap }: { connMap: { left: ConnMap; right: ConnMap } }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ d: string; side: 'L' | 'R' }[]>([]);

  const calc = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const all: { d: string; side: 'L' | 'R' }[] = [];

    for (const c of [...connMap.left, ...connMap.right]) {
      const fromEl = document.querySelector(`[data-match-id="${c.from}"]`) as HTMLElement;
      const toEl   = document.querySelector(`[data-match-id="${c.to}"]`)   as HTMLElement;
      if (!fromEl || !toEl) continue;
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();

      if (c.side === 'L') {
        // Left half: source (left) → target (right). Arrow auto‑points right.
        const x1 = fr.right - r.left;
        const y1 = fr.top + fr.height/2 - r.top;
        const x2 = tr.left  - r.left;
        const y2 = tr.top + tr.height/2 - r.top;
        const mx = (x1 + x2) / 2;
        all.push({ d: `M${x1},${y1} H${mx} V${y2} H${x2}`, side:'L' });
      } else {
        // Right half: source (right) → target (left). Arrow auto‑points left.
        const x1 = fr.left  - r.left;
        const y1 = fr.top + fr.height/2 - r.top;
        const x2 = tr.right - r.left;
        const y2 = tr.top + tr.height/2 - r.top;
        const mx = (x1 + x2) / 2;
        all.push({ d: `M${x1},${y1} H${mx} V${y2} H${x2}`, side:'R' });
      }
    }
    setPaths(all);
  }, [connMap]);

  useEffect(() => {
    calc();
    const ro = new ResizeObserver(calc);
    const el = svgRef.current?.parentElement;
    if (el) ro.observe(el);
    window.addEventListener('resize', calc);
    return () => { ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [calc]);

  return (
    <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/>
        </marker>
      </defs>
      {paths.map((p, i) => (
        <path key={i} d={p.d} stroke="#94a3b8" fill="none" strokeWidth="2"
          strokeLinejoin="round" markerEnd="url(#arr)"/>
      ))}
    </svg>
  );
});

// ── Grid helpers ────────────────────────────────────
const COL = {
  M: 'minmax(104px, 1fr)',   // match column — matches card width
  G: 'minmax(8px, 0.3fr)',   // gap column
  C: 'minmax(140px, 1.4fr)', // centre
};
const HALF = [COL.M, COL.G,COL.G,COL.G,COL.G, COL.M, COL.G,COL.G, COL.M, COL.G, COL.M, COL.G];
const GRID_COLS = [...HALF, COL.C, ...[...HALF].reverse()].join(' ');

// ══════════════════════════════════════════════════════
export default function BracketView() {
  const preds = usePredictions();
  const base = useKnockoutData(preds);
  const [winners, setWinner, clearWinners] = useKnockoutWinners();

  // Propagate winners through all rounds
  const resolvedLeft  = useMemo(() => propagateWinners(base.left,  base.left.r32,  base.left.r16,  winners), [base.left,  winners]);
  const resolvedRight = useMemo(() => propagateWinners(base.right, base.right.r32, base.right.r16, winners), [base.right, winners]);

  // Build effective halves for rendering (use resolved data)
  const left  = { r32: resolvedLeft.r32,  r16: resolvedLeft.r16,  qf: resolvedLeft.qf,  sf: resolvedLeft.sf };
  const right = { r32: resolvedRight.r32, r16: resolvedRight.r16, qf: resolvedRight.qf, sf: resolvedRight.sf };

  // Final: SF winners
  const finalM = { id:'FINAL', teamA: winners[left.sf[0]?.id] || '', teamB: winners[right.sf[0]?.id] || '' } as MatchSlot;

  // Third-place: SF losers (auto‑filled when SF winner picked)
  const leftSF  = left.sf[0];
  const rightSF = right.sf[0];
  const leftLoser  = leftSF  && winners[leftSF.id]  ? (winners[leftSF.id] === leftSF.teamA   ? leftSF.teamB  : leftSF.teamA)  : '';
  const rightLoser = rightSF && winners[rightSF.id] ? (winners[rightSF.id] === rightSF.teamA ? rightSF.teamB : rightSF.teamA) : '';
  const thirdM = { id:'3RD', teamA: leftLoser, teamB: rightLoser } as MatchSlot;

  const connections = useMemo(() => buildConnMap(left, right), [left, right]);

  const onPick = useCallback((matchId: string, team: string) => setWinner(matchId, team), [setWinner]);

  return (
    <div className="w-full flex flex-col" style={{ height: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 30%, #fff7ed 70%, #fef2f2 100%)' }}>
      {/* ── Stage labels row ── */}
      <div className="grid items-end flex-shrink-0 px-2 pt-3 pb-1" style={{ gridTemplateColumns: GRID_COLS }}>
        <div className="text-center"><StageLabel tier="r32"/></div>
        <div/><div/><div/><div/>
        <div className="text-center"><StageLabel tier="r16"/></div><div/><div/>
        <div className="text-center"><StageLabel tier="qf"/></div><div/>
        <div className="text-center"><StageLabel tier="sf"/></div><div/>
        <div className="text-center"><StageLabel tier="final"/></div><div/>
        <div className="text-center"><StageLabel tier="sf"/></div><div/>
        <div className="text-center"><StageLabel tier="qf"/></div><div/><div/>
        <div className="text-center"><StageLabel tier="r16"/></div>
        <div/><div/><div/><div/>
        <div className="text-center"><StageLabel tier="r32"/></div>
      </div>

      {/* ── Bracket body — fills remaining height ── */}
      <div className="flex-1 grid items-stretch relative px-2 pb-2 overflow-hidden"
           style={{ gridTemplateColumns: GRID_COLS, minHeight: 0 }}>
        {/* Left half */}
        <Col matches={left.r32} tier="r32" winners={winners} onPick={onPick}/><div/><div/><div/><div/>
        <Col matches={left.r16} tier="r16" winners={winners} onPick={onPick}/><div/><div/>
        <Col matches={left.qf} tier="qf" winners={winners} onPick={onPick}/><div/>
        <Col matches={left.sf} tier="sf" winners={winners} onPick={onPick}/><div/>

        {/* Centre — final + 3rd place */}
        <div className="h-full flex flex-col items-center justify-center gap-3 py-2">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-amber-500 tracking-widest font-black mb-0.5 drop-shadow-sm">🏆 决赛</span>
            <MatchCard m={finalM} tier="final" winner={winners.FINAL ?? null}
              onPick={(t) => setWinner('FINAL', t)} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 tracking-wider font-bold mb-0.5">🥉 三四名</span>
            <MatchCard m={thirdM} tier="third" winner={winners['3RD'] ?? null}
              onPick={(t) => setWinner('3RD', t)} />
          </div>
        </div>

        {/* Right half */}
        <div/><Col matches={right.sf} tier="sf" winners={winners} onPick={onPick}/>
        <div/><Col matches={right.qf} tier="qf" winners={winners} onPick={onPick}/><div/><div/>
        <Col matches={right.r16} tier="r16" winners={winners} onPick={onPick}/>
        <div/><div/><div/><div/><Col matches={right.r32} tier="r32" winners={winners} onPick={onPick}/>

        {/* SVG connector overlay */}
        <BracketLines connMap={connections}/>
      </div>

      {/* 淘汰赛重置 — 固定位置，始终可见 */}
      <div className="flex justify-center pb-2 flex-shrink-0">
        <button
          onClick={() => {
            if (Object.keys(winners).length === 0) return;
            if (!window.confirm('确定重置淘汰赛吗？\n\n所有晋级选择将清空。\n小组赛数据不受影响。')) return;
            clearWinners();
          }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                       border border-slate-200 text-slate-400 text-[10px] font-semibold tracking-wider
                       hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            重置晋级
          </button>
        </div>
    </div>
  );
}
