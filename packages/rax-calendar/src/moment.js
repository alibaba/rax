import {formatMoment} from './format';

var hookCallback;

function hooks() {
  return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback(callback) {
  hookCallback = callback;
}

function isUndefined(input) {
  return input === void 0;
}

function isDate(input) {
  return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function isMoment(obj) {
  return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
}

function copyConfig(to, from) {
  if (!isUndefined(from._isAMomentObject)) {
    to._isAMomentObject = from._isAMomentObject;
  }
  if (!isUndefined(from._i)) {
    to._i = from._i;
  }

  return to;
}

function startOfMonth() {
  this._d.setDate(1);
  return this;
}

function format(key) {
  return formatMoment(this, key);
}

function daysInMonth() {
  const year = this._d.getFullYear();
  const month = this._d.getMonth() + 1;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function Moment(config) {
  copyConfig(this, config);
  this._d = new Date(config._d != null ? config._d.getTime() : NaN);
}

function year() {
  return this._d.getFullYear();
}

function month() {
  return this._d.getMonth();
}

function date() {
  return this._d.getDate();
}

function hour() {
  return this._d.getHours();
}

function minute() {
  return this._d.getMinutes();
}

function second() {
  return this._d.getSeconds();
}

function addMonth(value) {
  var currentMonth = this.month();
  this._d.setMonth(currentMonth + value);
  return this;
}

function isoWeekday() {
  return this._d.getUTCDay();
}

function isSameMonth(argMoment) {
  return this.year() === argMoment.year() && this.month() === argMoment.month();
}

function setDate(dayIndex) {
  this._d.setDate(dayIndex);
  return this;
}

function getTime() {
  return this._d.getTime();
}

function isValid() {
  return !isNaN(this._d.getTime());
}

var proto = Moment.prototype;

proto.isValid = isValid;

proto.year = year;
proto.month = month;
proto.date = date;
proto.hour = hour;
proto.second = second;
proto.minute = minute;

proto.format = format;
proto.daysInMonth = daysInMonth;
proto.startOfMonth = startOfMonth;
proto.addMonth = addMonth;
proto.isoWeekday = isoWeekday;
proto.isSameMonth = isSameMonth;
proto.setDate = setDate;
proto.getTime = getTime;

function createFromConfig(config) {
  var input = config._i;

  if (isMoment(input)) {
    return new Moment(input);
  } else if (isDate(input)) {
    config._d = input;
  } else if (input) {
    config._d = new Date(input);
  } else {
    config._d = new Date();
  }

  var res = new Moment(config);
  return res;
}

function createLocal(input) {
  var c = {};

  c._isAMomentObject = true;
  c._i = input;

  return createFromConfig(c);
}

setHookCallback(createLocal);

var moment = hooks;
moment.prototype = proto;

export default moment;
