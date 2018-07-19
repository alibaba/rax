import { renderSFCModule } from 'utils';

describe('array', () => {
  let cont;

  function getCount() {
    return parseInt(cont.querySelector('[data-for="count"]').innerText, 10);
  }
  function getList() {
    return ''.trim.call(cont.querySelector('[data-for="list"]').innerText);
  }

  beforeEach(() => {
    cont = renderSFCModule(require('./array.html'));
  });

  it('push()', done => {
    cont.querySelector('[data-for="push"]').click();
    setTimeout(() => {
      expect(getCount()).to.equal(4);
      done();
    }, 0);
  });

  it('pop()', done => {
    cont.querySelector('[data-for="pop"]').click();
    setTimeout(() => {
      expect(getCount()).to.equal(2);
      done();
    }, 0);
  });

  it('shift()', done => {
    cont.querySelector('[data-for="shift"]').click();
    setTimeout(() => {
      expect(getCount()).to.equal(2);
      done();
    }, 0);
  });

  it('unshift()', done => {
    cont.querySelector('[data-for="unshift"]').click();
    setTimeout(() => {
      expect(getCount()).to.equal(4);
      expect(getList()).to.equal('[ -1, 0, 2, 8 ]');
      done();
    }, 0);
  });

  it('splice()', done => {
    cont.querySelector('[data-for="splice"]').click();
    setTimeout(() => {
      expect(getList()).to.equal('[ 0, 9, 8 ]');
      done();
    }, 0);
  });

  it('sort()', done => {
    cont.querySelector('[data-for="sort"]').click();
    setTimeout(() => {
      expect(getList()).to.equal('[ 0, 2, 8 ]');
      done();
    }, 0);
  });

  it('reverse(done)', done => {
    cont.querySelector('[data-for="reverse"]').click();
    setTimeout(() => {
      expect(getList()).to.equal('[ 8, 2, 0 ]');
      done();
    }, 0);
  });
});
