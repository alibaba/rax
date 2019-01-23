import WorkerDriver from './WorkerDriver';

export default function createDriver({ postMessage, addEventListener, rendererType }) {
  return new WorkerDriver({ postMessage, addEventListener, rendererType });
};
