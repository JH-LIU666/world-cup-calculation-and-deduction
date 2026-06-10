import type { Match } from '../types/worldcup';

type Result = 'W' | 'D' | 'L';

interface Props {
  matches: Match[];
  predictions: Record<string, Result>;
  onChange: (matchId: string, result: Result | null) => void;
  teamNames?: Map<string, string>;
}

const LABEL: Record<Result, string> = { W: '主胜', D: '平局', L: '客胜' };
const SELECTED: Record<Result, string> = {
  W: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-400 shadow-emerald-500/20',
  D: 'bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-400 shadow-blue-500/20',
  L: 'bg-gradient-to-b from-rose-400 to-rose-600 text-white border-rose-400 shadow-rose-500/20',
};
const UNSELECTED = 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:shadow-sm';

const ROUND_COLORS: Record<number, string> = {
  0: 'text-emerald-500',
  1: 'text-blue-500',
  2: 'text-purple-500',
};
const ROUND_LABELS = ['第一轮', '第二轮', '第三轮'];

function groupByRound(matches: Match[]): Match[][] {
  const rounds: Match[][] = [[], [], []];
  for (const m of matches) {
    const num = parseInt(m.id.split('-M')[1], 10);
    const idx = Math.ceil(num / 2) - 1;
    if (rounds[idx]) rounds[idx].push(m);
  }
  return rounds;
}

export default function MatchPredictor({ matches, predictions, onChange, teamNames }: Props) {
  const name = (id: string) => teamNames?.get(id) ?? id;
  const rounds = groupByRound(matches);

  return (
    <div className="space-y-8">
      {rounds.map((round, ri) => (
        <div key={ri}>
          <h3 className={`text-xs font-black tracking-widest mb-4 ${ROUND_COLORS[ri]}`}>
            ── {ROUND_LABELS[ri]} ──
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {round.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {(m.date || m.time) && (
                  <div className="text-center mb-3">
                    <span className="text-[10px] text-slate-400 tracking-wide">
                      {m.date}  {m.time}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-sm font-bold text-slate-800 tracking-wide">{name(m.teamA)}</span>
                  <span className="text-[9px] text-slate-300 font-black tracking-widest">VS</span>
                  <span className="text-sm font-bold text-slate-800 tracking-wide">{name(m.teamB)}</span>
                </div>
                <div className="flex gap-2">
                  {(Object.keys(LABEL) as Result[]).map((r) => {
                    const selected = predictions[m.id] === r;
                    return (
                      <button
                        key={r}
                        onClick={() => onChange(m.id, selected ? null : r)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wide border transition-all duration-200 ${
                          selected
                            ? SELECTED[r] + ' shadow-lg'
                            : UNSELECTED
                        }`}
                      >
                        {LABEL[r]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
