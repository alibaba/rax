import { resolve } from 'path';
import { renderSFCModule } from 'utils';

describe('CSS style', () => {
  it('style with object stynax', () => {
    const container = renderSFCModule(require('./style-object-stynax.html'));
    const testCaseDOM1 = container.querySelector('#style1');
    const testCaseDOM2 = container.querySelector('#style2');
    const computedStyle1 = getComputedStyle(testCaseDOM1);
    const computedStyle2 = getComputedStyle(testCaseDOM2);
    computedStyle1.color.should.be.colored('red');
    computedStyle1.fontSize.should.equal('30px');
    computedStyle2.color.should.be.colored('red');
    computedStyle2.fontSize.should.equal('30px');
  });

  it('style with array stynax', () => {
    const container = renderSFCModule(require('./style-array-stynax.html'));
    const testCaseDOM = container.querySelector('#style1');
    const computedStyle = getComputedStyle(testCaseDOM);

    computedStyle.color.should.be.colored('red');
    computedStyle.fontSize.should.equal('30px');
  });
});

