import { error } from 'core/debugger';

let windmill = null;
const callbacks = [];

export function setWindmill(wm) {
  windmill = wm;
  for (let i = 0, l = callbacks.length; i < l; i++) {
    callbacks[i](wm);
  }
}

export function getWindmill() {
  if (!windmill) {
    error('get windmill but not exists');
  }
  return windmill;
}

export function windmillReady(cb) {
  if (windmill) {
    cb(windmill);
  } else {
    callbacks.push(cb);
  }
}
