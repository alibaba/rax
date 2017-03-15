import moment from '../moment.js';

describe('moment', () => {
  it('isValid', () => {
    expect(moment('2017-3-14 tt:tt:tt').isValid()).toBeFalsy();
  });

  it('date', () => {
    expect(moment('2017-3-14').date()).toEqual(14);
  });

  it('month', () => {
    expect(moment('2017-3-14').month()).toEqual(2);
  });

  it('year', () => {
    expect(moment('2017-3-14').year()).toEqual(2017);
  });

  it('hour', () => {
    expect(moment('2017-3-14 09:18:07').hour()).toEqual(9);
  });

  it('minute', () => {
    expect(moment('2017-3-14 09:18:07').minute()).toEqual(18);
  });

  it('second', () => {
    expect(moment('2017-3-14 09:18:07').second()).toEqual(7);
  });

  it('format: default', () => {
    expect(moment('2017-3-14').format()).toEqual('2017-03-14 00:00:00');
  });

  it('format: YY-MM-DD', () => {
    expect(moment('2017-3-14').format('YY-MM-DD')).toEqual('17-03-14');
  });

  it('start of month', () => {
    expect(moment('2017-3-14').startOfMonth().format()).toEqual('2017-03-01 00:00:00');
  });

  it('days in month', () => {
    expect(moment('2017-3-14').daysInMonth()).toEqual(31);
  });

  it('add month', () => {
    expect(moment('2017-12-14').addMonth(1).format('YYYY-MM-DD')).toEqual('2018-01-14');
  });

  it('ios week day', () => {
    expect(moment('2017-03-14').isoWeekday()).toEqual(2);
  });

  it('is same month', () => {
    var date = moment('2017-3-18');
    expect(moment('2017-3-14').isSameMonth(date)).toBeTruthy();
  });

  it('set date', () => {
    expect(moment('2017-3-14').setDate(24).format('YYYY-MM-DD')).toEqual('2017-03-24');
  });

  it('get time', () => {
    expect(moment('2017-03-14').getTime()).toEqual(1489449600000);
  });

  it('moment input is date', () => {
    var date = new Date('2017-3-18');
    expect(moment(date).format('YYYY-MM-DD')).toEqual('2017-03-18');
  });
});
