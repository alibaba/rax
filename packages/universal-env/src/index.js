// https://www.w3.org/TR/html5/webappapis.html#dom-navigator-appcodename
export const isWeb = typeof navigator === 'object' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko');
export const isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
export const isWeex = typeof callNative === 'function' || typeof WXEnvironment === 'object' && WXEnvironment.platform !== 'Web';
export const isReactNative = typeof __fbBatchedBridgeConfig !== 'undefined';
