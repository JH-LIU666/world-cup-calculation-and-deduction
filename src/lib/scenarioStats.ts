import type { ValidScenario } from '../logic/analysisEngine';

export interface EnrichedScenario extends ValidScenario {
  scenarioId: number;
}

export function enrichScenarios(
  scenarios: ValidScenario[],
  _targetTeam: string,
): EnrichedScenario[] {
  return scenarios.map((sc, i) => ({
    ...sc,
    scenarioId: i + 1,
  }));
}
