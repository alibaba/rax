import DriverWorker from './DriverWorker';

export default function createDriver({ postMessage, addEventListener }) {
  return new DriverWorker({ postMessage, addEventListener });
};
