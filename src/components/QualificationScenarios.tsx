import type { Scenario } from '../lib/calculator';

interface Props {
  scenarios: Scenario[];
  totalCombinations: number;
  targetTeamId: string;
  currentPredictionKey: string; // 如 "W|L"
}

export default function QualificationScenarios({
  scenarios,
  totalCombinations,
  targetTeamId,
  currentPredictionKey,
}: Props) {
  const qualified = scenarios.find(
    (s) => scenarioKey(s) === currentPredictionKey,
  );
  const rank = qualified?.targetRank ?? null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 当前预测结论 */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            当前预测 · <span className="font-semibold text-gray-800">{targetTeamId}</span>
          </span>
          {rank && rank <= 2 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              排名第 {rank} · 出线
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
              未出线
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {scenarios.length} / {totalCombinations} 种可能结果能让{targetTeamId}晋级
        </p>
      </div>

      {/* 所有情形网格 */}
      <div className="px-6 py-5">
        <p className="text-xs text-gray-400 mb-4">全部可能性一览</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {scenarios.map((s) => {
            const key = scenarioKey(s);
            const isCurrent = key === currentPredictionKey;
            return (
              <div
                key={key}
                className={
                  'rounded-lg px-2.5 py-3 text-center text-xs transition-all ' +
                  (isCurrent
                    ? 'ring-2 ring-violet-400 bg-violet-50 text-gray-800 font-semibold shadow-sm'
                    : 'bg-emerald-50 text-emerald-700')
                }
              >
                <div className="font-mono text-[10px] text-gray-400 mb-1">
                  {key.replace(/\|/g, ' / ')}
                </div>
                <div className="font-bold text-sm">
                  #{s.targetRank}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function scenarioKey(s: Scenario): string {
  return s.outcomes.map((m) => m.result).join('|');
}
