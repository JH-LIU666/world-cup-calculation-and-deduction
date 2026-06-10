import type { Match, Team } from '../types/worldcup';

// ── Types ──────────────────────────────────────────────

type Result = 'W' | 'D' | 'L';

export interface MatchData {
  id: string;
  teamA: string;
  teamB: string;
  status: 'pending' | 'played';
  result: Result | null;
  scoreA?: number;
  scoreB?: number;
  date?: string;
  time?: string;
}

export interface NecessaryCondition {
  description: string;
  matchIds: string[];
  requiredResults: Result[];
}

export interface ValidScenario {
  outcomes: MatchData[];
  finalStandings: Team[];
  targetRank: number;
}

export interface AnalysisResult {
  targetTeam: string;
  targetRank: number;
  totalScenarios: number;
  qualifyingScenarios: number;
  qualifyingProbability: number;
  necessaryConditions: NecessaryCondition[];
  validScenarios: ValidScenario[];
  scenariosTruncated: boolean;
}

// ── Module-level data store ────────────────────────────

let _matches: MatchData[] = [];
let _teamList: { id: string; name: string }[] = [];

export function setMatchData(matches: Match[], teamList: { id: string; name: string }[]): void {
  _matches = matches.map((m) => ({
    ...m,
    status: m.result !== null ? 'played' : 'pending',
  }));
  _teamList = teamList;
}

export function getMatchData(): MatchData[] {
  return _matches;
}

// ── Standings ──────────────────────────────────────────

export function calculateStandings(
  matches: MatchData[],
  teamList?: { id: string; name: string }[],
): Team[] {
  const map = new Map<string, number>();
  const nameMap = new Map<string, string>();

  for (const t of teamList ?? _teamList) {
    map.set(t.id, 0);
    nameMap.set(t.id, t.name);
  }

  for (const m of matches) {
    if (m.result === null) continue;
    if (m.result === 'W') {
      map.set(m.teamA, (map.get(m.teamA) ?? 0) + 3);
    } else if (m.result === 'D') {
      map.set(m.teamA, (map.get(m.teamA) ?? 0) + 1);
      map.set(m.teamB, (map.get(m.teamB) ?? 0) + 1);
    } else {
      map.set(m.teamB, (map.get(m.teamB) ?? 0) + 3);
    }
  }

  return Array.from(map.entries())
    .map(([id, points]) => ({ id, name: nameMap.get(id) ?? id, points }))
    .sort((a, b) => b.points - a.points);
}

// ── Constants ──────────────────────────────────────────

const RESULTS: Result[] = ['W', 'D', 'L'];
const MAX_SCENARIOS = 5000;
const MAX_PENDING = 15;

// ── apply / rollback helpers ───────────────────────────

function applyDelta(map: Map<string, number>, m: MatchData, r: Result): void {
  if (r === 'W') {
    map.set(m.teamA, (map.get(m.teamA) ?? 0) + 3);
  } else if (r === 'D') {
    map.set(m.teamA, (map.get(m.teamA) ?? 0) + 1);
    map.set(m.teamB, (map.get(m.teamB) ?? 0) + 1);
  } else {
    map.set(m.teamB, (map.get(m.teamB) ?? 0) + 3);
  }
}

function rollbackDelta(map: Map<string, number>, m: MatchData, r: Result): void {
  if (r === 'W') {
    map.set(m.teamA, (map.get(m.teamA) ?? 0) - 3);
  } else if (r === 'D') {
    map.set(m.teamA, (map.get(m.teamA) ?? 0) - 1);
    map.set(m.teamB, (map.get(m.teamB) ?? 0) - 1);
  } else {
    map.set(m.teamB, (map.get(m.teamB) ?? 0) - 3);
  }
}

// ── Pruning (correct but conservative) ─────────────────

/**
 * 剪枝判断：即使 target 赢下所有剩余比赛，是否仍有 targetRank 支队伍积分更高？
 * 如果是 → 该分支不可能达成目标，可以剪掉。
 *
 * 此剪枝是保守的（safe pruning）——只剪掉数学上不可能的分支。
 */
function canStillQualify(
  points: Map<string, number>,
  pending: MatchData[],
  startIdx: number,
  targetTeam: string,
  targetRank: number,
): boolean {
  let targetMax = points.get(targetTeam) ?? 0;
  for (let i = startIdx; i < pending.length; i++) {
    const m = pending[i];
    if (m.teamA === targetTeam || m.teamB === targetTeam) {
      targetMax += 3;
    }
  }

  let ahead = 0;
  for (const [id, pts] of points) {
    if (id === targetTeam) continue;
    if (pts > targetMax) ahead++;
    if (ahead >= targetRank) return false;
  }

  return true;
}

// ── Core: recursive generator ──────────────────────────

function* generateScenarios(
  pending: MatchData[],
  points: Map<string, number>,
  targetTeam: string,
  targetRank: number,
  nameMap: Map<string, string>,
  resultMasks: Map<string, number>,
  prune: boolean,
): Generator<{ outcomes: MatchData[]; standings: Team[]; rank: number }> {
  const currentResults: Result[] = new Array(pending.length);
  let leafCount = 0;

  function* recurse(idx: number): Generator<{ outcomes: MatchData[]; standings: Team[]; rank: number }> {
    if (idx === pending.length) {
      leafCount++;

      const resolved: MatchData[] = pending.map((m, i) => ({
        ...m,
        result: currentResults[i],
        status: 'played' as const,
      }));

      const entries = Array.from(points.entries())
        .map(([id, pts]) => ({ id, name: nameMap.get(id) ?? id, points: pts }))
        .sort((a, b) => b.points - a.points);

      const rank = entries.findIndex((t) => t.id === targetTeam) + 1;

      if (rank === targetRank) {
        for (let i = 0; i < pending.length; i++) {
          const mask = resultMasks.get(pending[i].id) ?? 0;
          const bit = currentResults[i] === 'W' ? 1 : currentResults[i] === 'D' ? 2 : 4;
          resultMasks.set(pending[i].id, mask | bit);
        }
        yield { outcomes: resolved, standings: entries, rank };
      }
      return;
    }

    const match = pending[idx];

    for (const r of RESULTS) {
      currentResults[idx] = r;
      applyDelta(points, match, r);

      const canProceed = !prune || canStillQualify(points, pending, idx + 1, targetTeam, targetRank);

      if (canProceed) {
        yield* recurse(idx + 1);
      }

      rollbackDelta(points, match, r);
    }
  }

  yield* recurse(0);

  console.log(
    `[analysisEngine] Leaves visited: ${leafCount} | ` +
    `Pending matches: ${pending.length} | ` +
    `Theoretical max (3^${pending.length}): ${Math.pow(3, pending.length)} | ` +
    `Pruning: ${prune ? 'ON' : 'OFF'}`,
  );
}

// ── Core: analyzePaths ─────────────────────────────────

export function analyzePaths(
  targetTeam: string,
  targetRank: number,
): AnalysisResult {
  const pending = _matches.filter((m) => m.status === 'pending');
  const played = _matches.filter((m) => m.status === 'played');

  console.log(
    `[analysisEngine] Input: ${_matches.length} matches total | ` +
    `${played.length} played | ${pending.length} pending | ` +
    `target=${targetTeam} rank<=${targetRank}`,
  );

  if (pending.length === 0) {
    console.warn('[analysisEngine] No pending matches — returning empty result');
    return {
      targetTeam,
      targetRank,
      totalScenarios: 1,
      qualifyingScenarios: 0,
      qualifyingProbability: 0,
      necessaryConditions: [],
      validScenarios: [],
      scenariosTruncated: false,
    };
  }

  if (pending.length > MAX_PENDING) {
    throw new Error(
      `Too many pending matches (${pending.length}). Maximum is ${MAX_PENDING}. ` +
      `Scope analysis to a single group (6 matches = 729 scenarios).`,
    );
  }

  const totalScenarios = Math.pow(3, pending.length);
  console.log(`[analysisEngine] Theoretical total scenarios: 3^${pending.length} = ${totalScenarios}`);

  const nameMap = new Map(_teamList.map((t) => [t.id, t.name]));

  // Build base points from played matches
  const basePoints = new Map<string, number>();
  for (const t of _teamList) basePoints.set(t.id, 0);
  for (const m of played) {
    if (m.result !== null) applyDelta(basePoints, m, m.result);
  }

  const resultMasks = new Map<string, number>();
  const validScenarios: ValidScenario[] = [];
  let scenariosTruncated = false;

  const workPoints = new Map(basePoints);

  const gen = generateScenarios(
    pending, workPoints, targetTeam, targetRank, nameMap, resultMasks, false,
  );

  for (const sc of gen) {
    if (validScenarios.length >= MAX_SCENARIOS) {
      scenariosTruncated = true;
      break;
    }
    validScenarios.push({
      outcomes: sc.outcomes,
      finalStandings: sc.standings,
      targetRank: sc.rank,
    });
  }

  console.log(
    `[analysisEngine] Qualifying scenarios: ${validScenarios.length} / ${totalScenarios} ` +
    `(${(totalScenarios > 0 ? (validScenarios.length / totalScenarios * 100).toFixed(1) : 0)}%)`,
  );

  const necessaryConditions = buildNecessaryConditions(
    resultMasks, pending, targetTeam, nameMap,
  );

  return {
    targetTeam,
    targetRank,
    totalScenarios,
    qualifyingScenarios: validScenarios.length,
    qualifyingProbability:
      totalScenarios > 0 ? validScenarios.length / totalScenarios : 0,
    necessaryConditions,
    validScenarios,
    scenariosTruncated,
  };
}

// ── Necessary condition extraction ─────────────────────

function buildNecessaryConditions(
  resultMasks: Map<string, number>,
  pendingMatches: MatchData[],
  targetTeam: string,
  nameMap: Map<string, string>,
): NecessaryCondition[] {
  if (resultMasks.size === 0) return [];

  const nam = (id: string) => nameMap.get(id) ?? id;
  const conditions: NecessaryCondition[] = [];

  for (const match of pendingMatches) {
    const mask = resultMasks.get(match.id);
    if (mask === undefined) continue;

    const required = maskToResult(mask);
    if (required === null) continue;

    const aName = nam(match.teamA);
    const bName = nam(match.teamB);
    const involvesTarget =
      match.teamA === targetTeam || match.teamB === targetTeam;

    let description: string;

    if (involvesTarget) {
      const targetIsHome = match.teamA === targetTeam;
      const opponent = targetIsHome ? bName : aName;

      if (targetIsHome) {
        description =
          required === 'W'
            ? `必须战胜 ${opponent}`
            : required === 'D'
              ? `必须战平 ${opponent}`
              : `必须输给 ${opponent}`;
      } else {
        description =
          required === 'L'
            ? `必须战胜 ${opponent}`
            : required === 'D'
              ? `必须战平 ${opponent}`
              : `必须输给 ${opponent}`;
      }
    } else {
      description =
        required === 'W'
          ? `${aName} 必须战胜 ${bName}`
          : required === 'D'
            ? `${aName} 必须战平 ${bName}`
            : `${bName} 必须战胜 ${aName}`;
    }

    conditions.push({
      description,
      matchIds: [match.id],
      requiredResults: [required],
    });
  }

  return conditions;
}

function maskToResult(mask: number): Result | null {
  if (mask === 1) return 'W';
  if (mask === 2) return 'D';
  if (mask === 4) return 'L';
  return null;
}
