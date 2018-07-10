const store = {};

export function set(key, val) {
  store[key] = val;
}

export function get(key) {
  return store[key];
}
