import { render } from 'rax';
import DriverDOM from 'driver-dom';

export default (element, container, callback) => {
  render(element, container, {
    hydrate: true,
    driver: DriverDOM
  }, callback);
};
