import { renderSFCModule } from 'utils';

describe('life cycle', () => {
  it('before created', (done) => {
    const cont = renderSFCModule(require('./before-created.html'));
    setTimeout(done, 600);
  });

  it('created', (done) => {
    const cont = renderSFCModule(require('./created.html'));
    setTimeout(done, 600);
  });

  it('before mount', (done) => {
    const cont = renderSFCModule(require('./before-mount.html'));
    setTimeout(done, 600);
  });

  it('mounted', (done) => {
    const cont = renderSFCModule(require('./mounted.html'));
    setTimeout(done, 600);
  });

  it('before-update', (done) => {
    const cont = renderSFCModule(require('./before-update.html'));
    setTimeout(done, 600);
  });

  it('updated', (done) => {
    const cont = renderSFCModule(require('./updated.html'));
    setTimeout(done, 600);
  });

  it('before destroyed and destroyed', (done) => {
    const { unmount } = renderSFCModule(require('./destroyed.html'));
    unmount();
    setTimeout(done, 600);
  });
});
