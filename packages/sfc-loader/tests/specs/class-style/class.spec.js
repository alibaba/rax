import { resolve } from 'path';
import { renderSFCModule } from 'utils';

function checkColors(nodeList) {
  for (let i = 0, l = nodeList.length; i < l; i ++ ) {
    const computedStyle = getComputedStyle(nodeList[i]);
    computedStyle.color.should.be.colored(nodeList[i].dataset.color);
  }
}

describe('CSS class', () => {
  it('class with identifier', () => {
    const container = renderSFCModule(require('./class-with-identifier.html'));
    const testCaseDOM = container.querySelector('#klass');
    const computedStyle = getComputedStyle(testCaseDOM);

    computedStyle.color.should.be.colored('red');
    computedStyle.backgroundColor.should.be.colored('green');
    computedStyle.fontSize.should.equal('30px');
  });

  it('class with object stynax', () => {
    const container = renderSFCModule(require('./class-object-stynax.html'));
    const colorfulDOMs = container.querySelectorAll('[data-color]');
    checkColors(colorfulDOMs);
  });

  it('class with array stynax', () => {
    const container = renderSFCModule(require('./class-array-stynax.html'));
    const testCaseDOM = container.querySelector('#klass');
    const computedStyle = getComputedStyle(testCaseDOM);

    computedStyle.color.should.be.colored('yellow');
    computedStyle.backgroundColor.should.be.colored('red');
  });
});

