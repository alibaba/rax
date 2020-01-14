import MiniAppHistory from './History';

let history;

export function createMiniAppHistory(routes) {
  if (history) return history;
  return history = new MiniAppHistory(routes);
}

