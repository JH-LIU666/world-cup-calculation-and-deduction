import type { EnrichedScenario } from '../lib/scenarioStats';

const RESULT_LABEL: Record<string, string> = { W: '胜', D: '平', L: '负' };
const RESULT_COLOR: Record<string, string> = {
  W: 'text-emerald-600',
  D: 'text-amber-500',
  L: 'text-rose-600',
};

function getRound(matchId: string): number {
  return Math.ceil(parseInt(matchId.split('-M')[1], 10) / 2) - 1;
}

interface Props {
  scenario: EnrichedScenario;
  targetTeam: string;
  teamNames: Map<string, string>;
}

export default function PathCard({ scenario, targetTeam, teamNames }: Props) {
  const nam = (id: string) => teamNames.get(id) ?? id;

  const rounds: typeof scenario.outcomes[] = [[], [], []];
  for (const m of scenario.outcomes) {
    const r = getRound(m.id);
    if (r >= 0 && r < 3) rounds[r].push(m);
  }

  return (
    <div className="grid grid-cols-[80px_1fr_1fr_1fr_1.5fr] gap-2 px-4 py-2 border-b border-gray-50/70">
      {/* ID */}
      <span className="text-[11px] font-mono text-gray-400 tabular-nums pt-0.5">
        #{String(scenario.scenarioId).padStart(4, '0')}
      </span>

      {/* Rounds 1–3 */}
      {rounds.map((matches, ri) => (
        <div key={ri} className="min-w-0">
          {matches.map((m, mi) => {
            const r = m.result ?? '?';
            const t = m.teamA === targetTeam || m.teamB === targetTeam;
            return (
              <div key={mi} className="text-[11px] leading-snug truncate">
                <span className={t ? 'font-semibold text-gray-800' : 'text-gray-500'}>[</span>
                <span className={t ? 'font-semibold text-gray-800' : 'text-gray-500'}>{nam(m.teamA)}</span>{' '}
                <span className={(RESULT_COLOR[r] ?? 'text-gray-400') + ' font-bold'}>
                  {RESULT_LABEL[r] ?? r}
                </span>{' '}
                <span className={t ? 'font-semibold text-gray-800' : 'text-gray-500'}>{nam(m.teamB)}</span>
                <span className={t ? 'font-semibold text-gray-800' : 'text-gray-500'}>]</span>
              </div>
            );
          })}
        </div>
      ))}

      {/* Standings — sorted by rank (points desc = rank asc) */}
      <div className="flex flex-col text-[0.75rem] leading-snug min-w-0 -mx-1">
        {scenario.finalStandings.map((t, i) => {
          const isTarget = t.id === targetTeam;
          return (
            <span
              key={t.id}
              className={
                'px-1 rounded ' +
                (isTarget
                  ? 'font-semibold text-gray-900 bg-blue-50 border-l-2 border-blue-400'
                  : 'text-gray-500')
              }
            >
              {i + 1}. {nam(t.id)} {t.points}
            </span>
          );
        })}
      </div>
    </div>
  );
}
