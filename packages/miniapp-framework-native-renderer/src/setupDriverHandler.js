import render from 'rax-miniapp-renderer';

const TAG_PREFIX = 'a-';
const EVENT_WORKER_TO_RENDER = 'w2r';
const EVENT_RENDER_TO_WORKER = 'r2w';

export default function setupDriverHandler(runtime) {
  /**
   * @Note: After executing render method, which will register
   * workerHandle.onmessage to comsume messages from worker.
   */
  const workerHandle = { postMessage };
  function postMessage(data) {
    runtime.$emit(EVENT_RENDER_TO_WORKER, { data }, 'AppWorker');
  }
  function onMessage(event) {
    if (process.env.NODE_ENV === 'development') {
      logPerformance('Order: ' + event.data.order + ', length: ' + JSON.stringify(event.data).length);
    }

    workerHandle.onmessage && workerHandle.onmessage(event.data);
  }
  runtime.$on(EVENT_WORKER_TO_RENDER, onMessage);

  render({
    worker: workerHandle,
    tagNamePrefix: TAG_PREFIX,
  });
}

function logPerformance(str) {
  console.log('[PERFORMANCE]: RENDER-RECEIVE' + str + ' Ts: ' + Date.now());
}
