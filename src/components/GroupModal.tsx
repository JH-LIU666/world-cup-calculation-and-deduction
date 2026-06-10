import { useMemo } from 'react';
import type { Group } from '../data/groups';
import type { Team, Match } from '../types/worldcup';
import { calculatePoints } from '../lib/calculator';
import StandingsTable from './StandingsTable';
import MatchPredictor from './MatchPredictor';

type Result = 'W' | 'D' | 'L';

interface Props {
  group: Group;
  predictions: Record<string, Result>;
  onChange: (matchId: string, result: Result | null) => void;
  onClose: () => void;
}

export default function GroupModal({ group, predictions, onChange, onClose }: Props) {
  const nameMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of group.teams) m.set(t.id, t.name);
    return m;
  }, [group]);

  const standings = useMemo<Team[]>(() => {
    const played: Match[] = group.matches.map((m) =>
      predictions[m.id] ? { ...m, result: predictions[m.id] } : m,
    );
    const withResults = played.filter((m) => m.result !== null);
    return calculatePoints(withResults, group.teams);
  }, [group, predictions]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-6 pt-[5vh]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto self-start
                      bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md
                        rounded-t-2xl border-b border-slate-100
                        px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-widest">{group.name}</h2>
            <p className="text-xs text-slate-400 mt-1 tracking-wide font-medium">
              {group.teams.map((t) => t.name).join(' · ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          <StandingsTable standings={standings} />
          <MatchPredictor
            matches={group.matches}
            predictions={predictions}
            onChange={onChange}
            teamNames={nameMap}
          />
        </div>
      </div>
    </div>
  );
}
