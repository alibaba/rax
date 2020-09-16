// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const camera = {
  name: 'camera'
};

if (isWeChatMiniProgram) {
  camera.singleEvents = [{
    name: 'onCameraStop',
    eventName: 'stop'
  },
  {
    name: 'onCameraError',
    eventName: 'error'
  },
  {
    name: 'onCameraInitDone',
    eventName: 'initdone'
  },
  {
    name: 'onCameraScanCode',
    eventName: 'scancode'
  }];
}

export default camera;
