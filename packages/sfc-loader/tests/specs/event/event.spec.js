import { resolve } from 'path';
import { renderSFCModule } from 'utils';

describe('events', function() {
  it('basic events bind', (done) => {
    const cont = renderSFCModule(require('./basic-events.html'));

    cont.querySelector('[data-key="add"]').click();
    cont.querySelector('[data-key="add"]').click();

    setTimeout(() => {
      expect(
        cont.querySelector('[data-key="counter"]').innerText
      ).to.equal('2');
      done();
    }, 0);
  });

  it('method events', () => {
    const cont = renderSFCModule(require('./method-events.html'));
    cont.firstElementChild.click();
  });

  it('inline method', () => {
    const cont = renderSFCModule(require('./inline-method.html'));
    cont.firstElementChild.click();
  });
});
