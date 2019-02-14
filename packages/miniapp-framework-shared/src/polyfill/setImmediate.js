let resolved;

if (typeof Promise !== 'undefined') {
  resolved = Promise.resolve(true);
}

export default function setImmediate(cb) {
  if (resolved) {
    resolved.then(cb);
  } else {
    cb();
  }
}
