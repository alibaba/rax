import { render as originRender } from 'rax';
import WeexDriver from 'driver-weex';

export function render(element, container, callback) {
  return originRender(element, container, {
    driver: WeexDriver
  }, callback);
}
