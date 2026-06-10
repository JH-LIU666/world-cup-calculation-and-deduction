import type { Team } from '../types/worldcup';

interface Props {
  standings: Team[];
}

const RANK_COLORS: Record<number, { bg: string; text: string; badge: string; circle: string }> = {
  1: { bg: 'bg-amber-50/80', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', circle: 'bg-amber-400 text-white shadow-sm' },
  2: { bg: 'bg-amber-50/80', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', circle: 'bg-amber-400 text-white shadow-sm' },
};

export default function StandingsTable({ standings }: Props) {
  return (
    <div className="w-full rounded-3xl overflow-hidden border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <table className="w-full">
        <thead>
          <tr className="text-[10px] tracking-widest text-slate-400 uppercase bg-slate-50/50">
            <th className="py-2.5 pl-5 text-left w-10 font-semibold">#</th>
            <th className="py-2.5 text-left font-semibold">球队</th>
            <th className="py-2.5 pr-5 text-right font-semibold">积分</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((t, i) => {
            const isTop2 = i < 2;
            const rankStyle = RANK_COLORS[i + 1];
            return (
              <tr
                key={t.id}
                className={`border-t border-slate-50 transition-colors duration-200 h-[52px] ${rankStyle?.bg ?? ''}`}
              >
                <td className="py-3 pl-5">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    rankStyle?.circle ?? 'text-slate-300'
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="py-3 text-sm text-slate-600 tracking-wide font-medium">
                  {t.name}
                  {isTop2 && (
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold ${rankStyle?.badge}`}>
                      晋级
                    </span>
                  )}
                </td>
                <td className="py-3 pr-5 text-right tabular-nums">
                  <span className={`text-lg font-extrabold tracking-tight ${isTop2 ? rankStyle?.text : 'text-slate-300'}`}>
                    {t.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
