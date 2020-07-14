import { isMiniAppPlatform } from './env';

let history;

export function setHistory(value) {
  history = value;
}

export function getHistory() {
  // Currently on MiniApp platform every single js file doesn't share the same runtime
  return isMiniAppPlatform ? window.history : history;
}
