import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../stores/analysisStore';
import { enrichScenarios } from '../lib/scenarioStats';
import PathListView from '../components/PathListView';

const RANK_LABEL: Record<number, string> = {
  1: '小组第一',
  2: '小组第二',
  3: '小组第三',
  4: '小组第四',
};

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { result, isLoading, error } = useAnalysisStore();

  const teamName =
    result
      ? result.validScenarios[0]?.finalStandings.find((t) => t.id === result.targetTeam)?.name ??
        result.targetTeam
      : null;

  const { enriched, teamNames } = useMemo(() => {
    if (!result) return { enriched: [], teamNames: new Map<string, string>() };
    const names = new Map<string, string>();
    for (const sc of result.validScenarios) {
      for (const t of sc.finalStandings) {
        if (!names.has(t.id)) names.set(t.id, t.name);
      }
    }
    return {
      enriched: enrichScenarios(result.validScenarios, result.targetTeam),
      teamNames: names,
    };
  }, [result]);

  return (
    <div className="min-h-screen w-full bg-white px-4 pt-2 pb-16 md:px-6 md:pt-3 lg:px-8 lg:pt-3">
      {/* Header — sticky */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8 py-2 mb-2 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 tracking-widest">推演分析结果</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-900 tracking-wider transition-colors duration-200 shrink-0"
          >
            ← 返回计算器
          </button>
        </div>
      </header>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!result && !isLoading && !error && (
        <div className="text-center py-20">
          <p className="text-gray-300 text-sm tracking-wider">暂无分析结果，请返回计算器执行推演。</p>
        </div>
      )}

      {/* Result */}
      {result && !isLoading && (
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Minimal summary */}
          <div className="text-center space-y-0.5">
            <p className="text-lg font-bold text-gray-900 tracking-wide">
              {teamName} 目标：{RANK_LABEL[result.targetRank]}
            </p>
            <p className="text-sm text-gray-400 tracking-wider">
              共 {result.qualifyingScenarios.toLocaleString()} 种可行方案
            </p>
          </div>

          {/* Path list */}
          <PathListView
            scenarios={enriched}
            targetTeam={result.targetTeam}
            teamNames={teamNames}
          />

          {result.scenariosTruncated && (
            <p className="text-center text-xs text-amber-500 tracking-wider">
              路径数超过上限。建议录入更多预测以减少剩余比赛组合。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
