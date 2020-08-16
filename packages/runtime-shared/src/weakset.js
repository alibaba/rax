/* eslint no-extend-native: "off" */

var counter = Date.now() % 1e9;

var WeakSet = function WeakSet(data) {
  this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
  data && data.forEach && data.forEach(this.add, this);
};

WeakSet.prototype.add = function(obj) {
  var name = this.name;
  if (!obj[name]) Object.defineProperty(obj, name, {value: true, writable: true});
  return this;
};

WeakSet.prototype.delete = function(obj) {
  if (!obj[this.name]) return false;
  obj[this.name] = undefined;
  return true;
};

WeakSet.prototype.has = function(obj) {
  return !!obj[this.name];
};

module.exports = WeakSet;
