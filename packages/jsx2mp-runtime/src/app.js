export const cycles = {};

export function useAppEffect(cycle, callback) {
  switch (cycle) {
    case 'launch':
      cycles[cycle] = cycles[cycle] || [];
      cycles[cycle].push(callback);
      break;
  }
}

export function useRouter(routerConfig) {
  return { Router: null }; // noop
}
