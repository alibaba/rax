import { renderSFCModule } from 'utils';

describe('component', function() {
  it('register component', () => {
    const container = renderSFCModule(require('./parent'));
    expect(container.innerText).to.equal("I'm son - bar I'm son - bar");
  });
});
