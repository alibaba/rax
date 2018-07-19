import { renderSFCModule } from 'utils';

describe('declear data', () => {
  it('data declear works', () => {
    const container = renderSFCModule(require('./declear-data'));

    expect(container.innerText).to.equal('233');
  });
});
