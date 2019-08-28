export default function runCallbacks(callbacks, context) {
  for (let i = 0, l = callbacks && callbacks.length; i < l; i++) {
    callbacks[i].call(context);
  }
}
