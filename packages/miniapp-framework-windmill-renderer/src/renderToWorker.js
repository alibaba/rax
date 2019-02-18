/**
 * Low level protocol to send message to worker.
 */
const RENDER_TO_WORKER_NS = '__renderer_to_worker__';

export default function setupRenderToWorker(windmill, extraPayload = {}) {
  function renderToWorker(payload) {
    windmill.$emit(
      payload.type,
      {
        ...extraPayload,
        payload,
      },
      'AppWorker'
    );
  }

  window[RENDER_TO_WORKER_NS] = renderToWorker;
}
