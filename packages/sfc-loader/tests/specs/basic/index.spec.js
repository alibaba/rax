import { resolve } from 'path';
import { renderSFCModule } from 'utils';

describe('basic test', () => {
  beforeEach(() => {
    // document.body.innerHTML = '';
  });

  it('empty file', () => {
    renderSFCModule(require('./empty.html'));
  });

  it('only template tag', () => {
    renderSFCModule(require('./template.html'));
  });

  it('template with view', () => {
    renderSFCModule(require('./view.html'));
    // expect(document.querySelector('#aaa')).equal('1')
  });

  it('proxy', () => {
    const cont = renderSFCModule(require('./proxy.html'));
    expect(cont.innerText).to.equal('Hello World');
  });
});

