export default function(object) {
  return object
    && typeof object === 'object'
    && Object.prototype.toString.call(object) === '[object Object]';
};
