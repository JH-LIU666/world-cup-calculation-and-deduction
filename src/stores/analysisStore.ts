import { create } from 'zustand';
import type { AnalysisResult } from '../logic/analysisEngine';
import { setMatchData, analyzePaths } from '../logic/analysisEngine';
import type { Match } from '../types/worldcup';

interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;

  /** 执行分析并将结果存入 Store */
  runAnalysis: (
    matches: Match[],
    teamList: { id: string; name: string }[],
    targetTeam: string,
    targetRank: number,
  ) => Promise<void>;

  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  result: null,
  isLoading: false,
  error: null,

  runAnalysis: async (matches, teamList, targetTeam, targetRank) => {
    const played = matches.filter((m) => m.result !== null).length;
    const pending = matches.filter((m) => m.result === null).length;
    console.log(
      `[AnalysisStore] runAnalysis called | team=${targetTeam} rank<=${targetRank} | ` +
      `matches=${matches.length} (${played} played / ${pending} pending) | ` +
      `teamList=${teamList.map((t) => t.id).join(',')}`,
    );

    set({ isLoading: true, error: null });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          setMatchData(matches, teamList);
          const result = analyzePaths(targetTeam, targetRank);
          set({ result, isLoading: false });
        } catch (e) {
          set({ error: String(e), isLoading: false });
        }
        resolve();
      }, 0);
    });
  },

  clearResult: () => set({ result: null, error: null }),
}));
