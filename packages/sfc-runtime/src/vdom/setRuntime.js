import Host from '../host';

export default function setRuntime({ createElement }) {
  Host.createElement = createElement;
}
