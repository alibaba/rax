import { resolve } from 'path';
import { renderSFCModule } from 'utils';

describe('v-for', () => {
  it('should render items', (done) => {
    const cont = renderSFCModule(require('./basic-for'));

    expect(cont.childNodes[0].childElementCount).equal(4);
    // 这里有个空格, 故意而为之, 与 vue 保持一致
    expect(cont.childNodes[0].childNodes[0].innerText).equal('Foo ');
    expect(cont.childNodes[0].childNodes[1].innerText).equal('Bar ');

    // 有一个空格
    expect(cont.childNodes[0].childNodes[3].innerText).equal('Parent-0-Foo ');
    expect(cont.childNodes[0].childNodes[4].innerText).equal('Parent-1-Bar');

    done();
  });

  it('itor for objects', () => {
    const cont = renderSFCModule(require('./object-for'));

    expect(cont.childNodes[0].childElementCount).equal(3);

    expect(cont.childNodes[0].childNodes[0].innerText).equal('0. firstName: John ');
    expect(cont.childNodes[0].childNodes[1].innerText).equal('1. lastName: Doe ');
    expect(cont.childNodes[0].childNodes[2].innerText).equal('2. age: 30');
  });

  it('for n', () => {
    const cont = renderSFCModule(require('./misc-for'));
    expect(cont.querySelector('[data-key="for-n"]').childElementCount).to.equal(10);
  });

  it('for with method', () => {
    const cont = renderSFCModule(require('./misc-for'));
    expect(
      cont.querySelector('[data-key="for-method"]').innerHTML
    ).to.equal('<text>2</text><text>4</text>');
  });

  it('for with template', () => {
    const cont = renderSFCModule(require('./template-for'));
    expect(cont.innerHTML).to
      .equal('<view><text>Foo</text> <text></text><text>Bar</text> <text></text></view>');
  });

  it('for with if', () => {
    const cont = renderSFCModule(require('./for-with-if.html'));
    expect(cont.childElementCount).to.equal(1);
  });
});

