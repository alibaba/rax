import { render } from 'rax';

export default (element, container, callback) => {
  render(element, container, {
    hydrate: true
  }, callback);
};
