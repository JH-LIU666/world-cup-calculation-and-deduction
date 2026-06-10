import type { GroupTeam } from '../data/groups';
import type { Team } from '../types/worldcup';

interface Props {
  groupId: string;
  groupName: string;
  teams: GroupTeam[];
  top2: Team[];
  onClick: () => void;
}

const STYLES: Record<string, { bg: string; border: string; shadow: string; badge: string }> = {
  A: { bg: 'from-emerald-400 to-green-600',   border: 'border-emerald-300/30', shadow: 'shadow-emerald-500/15', badge: 'bg-emerald-400/25' },
  B: { bg: 'from-blue-400 to-indigo-600',     border: 'border-blue-300/30',   shadow: 'shadow-blue-500/15',   badge: 'bg-blue-400/25' },
  C: { bg: 'from-violet-400 to-purple-600',   border: 'border-violet-300/30', shadow: 'shadow-violet-500/15', badge: 'bg-violet-400/25' },
  D: { bg: 'from-rose-400 to-pink-600',       border: 'border-rose-300/30',   shadow: 'shadow-rose-500/15',   badge: 'bg-rose-400/25' },
  E: { bg: 'from-amber-400 to-orange-600',    border: 'border-amber-300/30',  shadow: 'shadow-amber-500/15',  badge: 'bg-amber-400/25' },
  F: { bg: 'from-cyan-400 to-teal-600',       border: 'border-cyan-300/30',   shadow: 'shadow-cyan-500/15',   badge: 'bg-cyan-400/25' },
  G: { bg: 'from-sky-400 to-blue-600',        border: 'border-sky-300/30',    shadow: 'shadow-sky-500/15',    badge: 'bg-sky-400/25' },
  H: { bg: 'from-fuchsia-400 to-purple-600',  border: 'border-fuchsia-300/30',shadow: 'shadow-fuchsia-500/15',badge: 'bg-fuchsia-400/25' },
  I: { bg: 'from-lime-400 to-emerald-600',    border: 'border-lime-300/30',   shadow: 'shadow-lime-500/15',   badge: 'bg-lime-400/25' },
  J: { bg: 'from-red-400 to-rose-600',        border: 'border-red-300/30',    shadow: 'shadow-red-500/15',    badge: 'bg-red-400/25' },
  K: { bg: 'from-teal-400 to-cyan-600',       border: 'border-teal-300/30',   shadow: 'shadow-teal-500/15',   badge: 'bg-teal-400/25' },
  L: { bg: 'from-orange-400 to-amber-600',    border: 'border-orange-300/30', shadow: 'shadow-orange-500/15', badge: 'bg-orange-400/25' },
};

export default function GroupCard({ groupId, groupName, teams, top2, onClick }: Props) {
  const s = STYLES[groupId] ?? STYLES.A;

  return (
    <button
      onClick={onClick}
      className={`relative bg-gradient-to-br ${s.bg} rounded-[2rem] p-6 text-left w-full h-full
                 border ${s.border} shadow-[0_10px_40px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.2)] ${s.shadow}
                 before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none
                 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                 hover:scale-[1.02] hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1.5
                 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50`}
    >
      <h3 className="text-center text-xs font-black tracking-widest text-white/80 mb-4">
        {groupName}
      </h3>

      <div className="space-y-2.5">
        {(top2.length > 0 ? top2 : teams.slice(0, 2)).map((t, i) => (
          <div key={t.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${s.badge} text-xs font-bold text-white`}>
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-white">{t.name}</span>
            </div>
            {top2.length > 0 && <span className="text-sm font-extrabold text-white/70 tabular-nums">{(t as Team).points}分</span>}
          </div>
        ))}
      </div>
    </button>
  );
}
