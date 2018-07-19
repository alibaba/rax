import { renderSFCModule } from 'utils';

describe('computed', () => {
  it('computed with set and get', (done) => {
    const container = renderSFCModule(require('./computed'));
    expect(container.innerText).to.equal('1 - 2');

    setTimeout(() => {
      expect(container.innerText).to.equal('50 - 100');
      done();
    });
  });
});
