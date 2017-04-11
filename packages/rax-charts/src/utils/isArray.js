export default function(arr) {
  if (Array.isArray) {
    return Array.isArray(arr);
  } else {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }
};
