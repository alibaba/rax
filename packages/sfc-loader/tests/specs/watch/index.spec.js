import { resolve } from 'path';
import { renderSFCModule } from 'utils';

describe('watch', () => {
  it('can watch data change', () => {
    const cont = renderSFCModule(require('./watch'));
  });
});
