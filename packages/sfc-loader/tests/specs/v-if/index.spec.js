/* eslint-disable */
import { resolve } from 'path';
import { renderSFCModule } from 'utils';

describe('v-if', () => {
  it('toggle if state', (done) => {
    const container = renderSFCModule(require('./if'));
    // not show at first time
    assert(
      container.querySelector('view>view') === null
    );
    container.querySelector('button').click();

    setTimeout(() => {
      assert(
        container.querySelector('view>view') !== null
      );
      container.querySelector('button').click();

      setTimeout(() => {
        assert(
          container.querySelector('view>view') === null
        );
        done();
      });
    });
  });

  it('if elif else', (done) => {
    const cont = renderSFCModule(require('./if-else.html'));

    function getViewText() {
      return cont.querySelector('view>view').innerText;
    }

    function click() {
      cont.querySelector('button').click();
    }

    assert(getViewText() === 'A');
    click();

    setTimeout(() => {
      assert(getViewText() === 'B');
      click();

      setTimeout(() => {
        assert(getViewText() === 'C');
        done();
      });
    });
  });
});

