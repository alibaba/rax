export default function(number) {
  return number
    && typeof number === 'number'
    && Object.prototype.toString.call(number) === '[object Number]';
};
