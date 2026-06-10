import type { Match, Team } from '../types/worldcup';
import { TEAM_PINYIN_INITIAL } from '../data/teamSortKeys';

type Result = 'W' | 'D' | 'L';

/** 单种可能情形：剩余比赛的结果 + 最终排名 */
export interface Scenario {
  outcomes: Match[];
  standings: Team[];
  targetRank: number;
}

/**
 * 根据比赛结果计算各队积分。result 以 teamA 视角：
 *  'W' → teamA 胜，teamA +3
 *  'D' → 平局，双方各 +1
 *  'L' → teamB 胜，teamB +3
 *  null → 未进行，不计分
 *
 * @param matches  比赛列表
 * @param teamList 可选：确保这些球队出现在积分榜中（即使无比赛记录，计 0 分），同时提供中文名
 */
export function calculatePoints(
  matches: Match[],
  teamList?: { id: string; name: string }[],
): Team[] {
  const map = pointsMap(matches);

  if (teamList) {
    for (const t of teamList) {
      if (!map.has(t.id)) map.set(t.id, 0);
    }
  }

  const nameMap = new Map<string, string>();
  if (teamList) {
    for (const t of teamList) nameMap.set(t.id, t.name);
  }

  return mapToStandings(map, nameMap);
}

/** 从比赛列表构建 teamId → 积分 映射 */
function pointsMap(matches: Match[]): Map<string, number> {
  const map = new Map<string, number>();

  const ensure = (id: string) => {
    if (!map.has(id)) map.set(id, 0);
  };

  for (const m of matches) {
    if (m.result === null) continue;

    ensure(m.teamA);
    ensure(m.teamB);

    if (m.result === 'W') {
      map.set(m.teamA, map.get(m.teamA)! + 3);
    } else if (m.result === 'D') {
      map.set(m.teamA, map.get(m.teamA)! + 1);
      map.set(m.teamB, map.get(m.teamB)! + 1);
    } else {
      map.set(m.teamB, map.get(m.teamB)! + 3);
    }
  }

  return map;
}

/** 将积分映射转为排序后的 Team[] */
function mapToStandings(map: Map<string, number>, nameMap?: Map<string, string>): Team[] {
  return Array.from(map.entries())
    .map(([id, points]) => ({ id, name: nameMap?.get(id) ?? id, points }))
    .sort((a, b) => b.points - a.points || (TEAM_PINYIN_INITIAL[a.id] ?? 'z').localeCompare(TEAM_PINYIN_INITIAL[b.id] ?? 'z') || a.id.localeCompare(b.id));
}

/**
 * 穷举所有剩余比赛的可能结果，筛选出目标球队排前两名的情形。
 *
 * @param currentStandings  当前已完成的积分榜
 * @param remainingMatches  剩余未赛的对阵（result 为 null）
 * @param targetTeamId      目标球队 ID
 * @returns 所有能让目标球队出线（排名 ≤ 2）的比赛结果组合
 */
export function findPossibleScenarios(
  currentStandings: Team[],
  remainingMatches: Match[],
  targetTeamId: string,
): Scenario[] {
  // 将现有积分注入 map，同时构建 nameMap
  const basePoints = new Map<string, number>();
  const nameMap = new Map<string, string>();
  for (const t of currentStandings) {
    basePoints.set(t.id, t.points);
    nameMap.set(t.id, t.name);
  }

  // 确保剩余比赛中的球队也存在于 map 中
  for (const m of remainingMatches) {
    if (!basePoints.has(m.teamA)) basePoints.set(m.teamA, 0);
    if (!basePoints.has(m.teamB)) basePoints.set(m.teamB, 0);
  }

  const allOutcomes = generateOutcomes(remainingMatches);
  const scenarios: Scenario[] = [];

  for (const outcome of allOutcomes) {
    const resolvedMatches: Match[] = remainingMatches.map((m, i) => ({
      ...m,
      result: outcome[i],
    }));

    const finalMap = new Map(basePoints);
    for (const m of resolvedMatches) {
      applyResult(finalMap, m);
    }

    const standings = mapToStandings(finalMap, nameMap);
    const rank = standings.findIndex((t) => t.id === targetTeamId) + 1;

    if (rank <= 2) {
      scenarios.push({ outcomes: resolvedMatches, standings, targetRank: rank });
    }
  }

  return scenarios;
}

/** 将单场比赛的结果累加到积分 map 中 */
function applyResult(map: Map<string, number>, m: Match): void {
  if (m.result === 'W') {
    map.set(m.teamA, map.get(m.teamA)! + 3);
  } else if (m.result === 'D') {
    map.set(m.teamA, map.get(m.teamA)! + 1);
    map.set(m.teamB, map.get(m.teamB)! + 1);
  } else if (m.result === 'L') {
    map.set(m.teamB, map.get(m.teamB)! + 3);
  }
}

/** 递归生成所有结果组合：n 场比赛 → 3^n 种排列 */
function generateOutcomes(remaining: Match[]): Result[][] {
  if (remaining.length === 0) return [[]];
  const sub = generateOutcomes(remaining.slice(1));
  const results: Result[][] = [];
  for (const r of (['W', 'D', 'L'] as Result[])) {
    for (const s of sub) {
      results.push([r, ...s]);
    }
  }
  return results;
}
