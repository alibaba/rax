import { applyFactory } from '../utils';
import { $on, $off } from '../lifecycle';

export default {
  on(evtName, callback) {
    $on(evtName, callback);
  },
  off(evtName, callback) {
    $off(evtName, callback);
  },
  register(desc, factory) {
    applyFactory(factory);
  }
};
