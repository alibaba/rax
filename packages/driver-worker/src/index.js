import WorkerDriver from './WorkerDriver';

/**
 * Instantiate a worker driver.
 * @param options.postMessage {Function} Tunnel for send message to renderer.
 * @param options.addEventListener {Function} Tunnel for driver to receive message.
 * @return {WorkerDriver}
 */
export default function createDriver(options) {
  return new WorkerDriver(options);
};
