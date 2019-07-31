import invokeCycle from './invokeCycle';

export const appCycles = {};

export function useAppEffect(cycle, callback) {
  const cycles = appCycles[cycle] = appCycles[cycle] || [];
  cycles.push(callback);
}

export function invokeAppCycle(cycle) {
  invokeCycle(appCycles, cycle);
}
