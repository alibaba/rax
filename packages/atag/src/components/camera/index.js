import { registerCompositeRender } from '../../shared/compositeRenderAdatper';

const CAMERA_COMPOSITE_CONFIG = {
  tag: 'a-camera',
  viewType: 'wmlCamera',
  properties: {
    mode: {
      type: 'string',
      value: 'normal',
    },
    devicePosition: {
      type: 'string',
      value: 'back',
    },
    flash: {
      type: 'string',
      value: '',
    },
  },
  events: ['stop', 'error', 'scancode'],
};
registerCompositeRender(CAMERA_COMPOSITE_CONFIG);
