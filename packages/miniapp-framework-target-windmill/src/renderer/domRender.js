import domRenderer from 'driver-worker/dist/driver.worker.renderer';

const documentElementStyle = document.documentElement.style;
const { clientWidth } = document.documentElement;
const isTouchDevice = 'ontouchstart' in window || 'onmsgesturechange' in window;

export default function domRender(windmill) {
  /* HACK: fix safari mobile click events aren't fired https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile */
  if (isTouchDevice) {
    document.documentElement.style.cursor = 'pointer';
  }
  // Set rem
  documentElementStyle.fontSize = clientWidth / 750 * 100 + 'px';

  /**
   * 与 worker 通信的通道
   * 包含 postMessage 和 onmessage 两个方法
   * domRenderer 执行后会注册 onmessage 方法
   */
  const $$worker = {
    postMessage(payload) {
      /**
       * r2w means
       *   renderer send message to worker
       */
      windmill.$emit(
        'r2w',
        {
          // 所有数据收敛到 data 字段
          data: payload
        },
        'AppWorker'
      );
    }
  };

  /**
   * w2r means
   *   worker send message to renderer
   */
  windmill.$on('w2r', event => {
    if (typeof $$worker.onmessage === 'function') {
      $$worker.onmessage(event.data);
    }
  });

  domRenderer({
    worker: $$worker,
    tagNamePrefix: 'a-'
  });
}
