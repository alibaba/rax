import { renderSFCModule } from 'utils';

describe('v-once not impl', () => {
  const container = renderSFCModule(require('./v-once'));
  window.c = container;
});
