import invokeCycle from './invokeCycle';

export const pageCycles = {};

export function usePageEffect(cycle, callback) {
  const cycles = pageCycles[cycle] = pageCycles[cycle] || [];
  cycles.push(callback);
}

export function invokePageCycle(cycle) {
  invokeCycle(pageCycles, cycle);
}
