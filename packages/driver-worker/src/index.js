import WorkerDriver from './WorkerDriver';

export default function createDriver({ postMessage, addEventListener }) {
  return new WorkerDriver({ postMessage, addEventListener });
};
