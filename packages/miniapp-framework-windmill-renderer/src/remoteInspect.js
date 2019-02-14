const INIT = 0;
const PENDING = 1;
const DONE = 2;
let state = INIT;

/**
 * Start remote webview debugger
 */
export default function startRemoteInspect(remoteInspectUrl) {
  if (state >= PENDING) {
    return;
  }

  state = PENDING;

  const script = document.createElement('script');
  script.async = true;
  script.src = remoteInspectUrl;
  script.onload = function() {
    state = DONE;
  };
  document.body.appendChild(script);
}
