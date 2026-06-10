import { useMemo } from 'react';
import { List } from 'react-window';
import type { EnrichedScenario } from '../lib/scenarioStats';
import PathCard from './PathCard';

const COLUMNS = 'grid-cols-[80px_1fr_1fr_1fr_1.5fr]';
const MIN_WIDTH = 720;
const ROW_HEIGHT = 88;

interface Props {
  scenarios: EnrichedScenario[];
  targetTeam: string;
  teamNames: Map<string, string>;
}

interface RowData {
  scenarios: EnrichedScenario[];
  targetTeam: string;
  teamNames: Map<string, string>;
}

function Row({ index, style, scenarios, targetTeam, teamNames }: { index: number; style: React.CSSProperties } & RowData) {
  const sc = scenarios[index];
  return (
    <div style={{ ...style, height: ROW_HEIGHT }} className="path-row">
      <PathCard scenario={sc} targetTeam={targetTeam} teamNames={teamNames} />
    </div>
  );
}

export default function PathListView({ scenarios, targetTeam, teamNames }: Props) {
  const sorted = useMemo(() => {
    const list = [...scenarios];
    list.sort((a, b) => a.scenarioId - b.scenarioId);
    return list;
  }, [scenarios]);

  const rowData: RowData = useMemo(
    () => ({ scenarios: sorted, targetTeam, teamNames }),
    [sorted, targetTeam, teamNames],
  );

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Column headers */}
      <div
        className={`grid ${COLUMNS} gap-2 px-4 py-2 border-b border-gray-100
                    text-[10px] text-gray-400 tracking-wider bg-white`}
        style={{ minWidth: MIN_WIDTH }}
      >
        <span>ID</span>
        <span>第一轮</span>
        <span>第二轮</span>
        <span>第三轮</span>
        <span>最终积分榜</span>
      </div>

      {sorted.length > 0 ? (
        <List<RowData>
          className="path-list"
          rowComponent={Row}
          rowCount={sorted.length}
          rowHeight={ROW_HEIGHT}
          rowProps={rowData}
          defaultHeight={Math.min(700, sorted.length * ROW_HEIGHT)}
          style={{ width: '100%', minWidth: MIN_WIDTH, height: 'calc(100vh - 140px)' }}
          overscanCount={6}
        />
      ) : (
        <div className="py-12 text-center text-xs text-gray-300 tracking-wider">
          无可行方案
        </div>
      )}
    </div>
  );
}
