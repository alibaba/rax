/* global global */
const JS_TO_DART = '__kraken_js_to_dart__';
const DART_TO_JS = '__kraken_dart_to_js__';
const TARGET_JS = 'J';

export default function createBridge() {
  const listeners = [];
  function addEventListener(callback) {
    listeners.push(callback);
  }

  function postMessage(message) {
    let stringified = null;
    try {
      stringified = JSON.stringify(message);
    } catch (err) {
      console.error('Can not execute JSON.stringify(message), due to message is not stringifiable.');
      console.error(err);
    }

    if (stringified !== null) {
      global[JS_TO_DART](stringified);
    }
  }

  // Setup singleton message listener from native backend.
  if (typeof global[DART_TO_JS] === 'function') {
    global[DART_TO_JS](function(message) {
      if (message[1] === TARGET_JS) {
        message = message.slice(2);
      }
      let parsedMessage = null;
      try {
        parsedMessage = JSON.parse(message);
      } catch (err) {
        console.error('Can not parse message from backend, the raw message:', message);
        console.error(err);
      }

      if (parsedMessage !== null) {
        try {
          for (let i = 0; i < listeners.length; i++) {
            listeners[i].call(this, parsedMessage);
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    });
  } else {
    console.error(`ERROR: Can not register bridge ${DART_TO_JS}`);
  }

  return { postMessage, addEventListener };
}
