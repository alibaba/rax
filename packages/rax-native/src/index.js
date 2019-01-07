import { render as originRender } from 'rax';
import DomDriver from 'driver-dom';
import WeexDriver from 'driver-weex';
import { isWeex } from 'universal-env';

// Weex viewport width is 750
DomDriver.setViewportWidth(750);

export function render(element, container, callback) {
  return originRender(element, container, {
    driver: isWeex ? WeexDriver : DomDriver
  }, callback);
}
