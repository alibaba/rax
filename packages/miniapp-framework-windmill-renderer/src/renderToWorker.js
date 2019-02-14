/**
 * Low level protocol to send message to worker.
 */
const RENDER_TO_WORKER_NS = '__renderer_to_worker__';

export default function setupRenderToWorker(windmill) {
  function renderToWorker(payload) {
    windmill.$emit(
      payload.type,
      {
        payload,
        pageName,
      },
      'AppWorker'
    );
  }

  window[RENDER_TO_WORKER_NS] = renderToWorker;
}
