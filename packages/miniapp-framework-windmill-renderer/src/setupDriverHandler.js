import render from 'driver-worker-renderer-webview';

const TAG_PREFIX = 'a-';
const EVENT_WORKER_TO_RENDER = 'w2r';
const EVENT_RENDER_TO_WORKER = 'r2w';

export default function setupDriverHandler(windmill) {
  /**
   * @Note: After executing render method, which will register
   * workerHandle.onmessage to comsume messages from worker.
   */
  const workerHandle = { postMessage };
  function postMessage(data) {
    windmill.$emit(EVENT_RENDER_TO_WORKER, { data }, 'AppWorker');
  }
  function onMessage(event) {
    workerHandle.onmessage && workerHandle.onmessage(event.data);
  }
  windmill.$on(EVENT_WORKER_TO_RENDER, onMessage);

  render({
    worker: workerHandle,
    tagNamePrefix: TAG_PREFIX,
  });
}
