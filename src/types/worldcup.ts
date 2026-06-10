export interface Team {
  id: string;
  name: string;
  points: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  result: 'W' | 'D' | 'L' | null;
  date?: string;
  time?: string;
}

/** teamId -> Team 的映射表 */
export type TeamMap = Record<string, Team>;
