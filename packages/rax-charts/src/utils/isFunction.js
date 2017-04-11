export default function(func) {
  return func
    && typeof func === 'function'
    && Object.prototype.toString.call(func) === '[object Function]';
};
