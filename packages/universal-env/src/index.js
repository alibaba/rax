export const isWeex = typeof callNative === 'function';
export const isWeb = typeof window === 'object' && typeof window.document === 'object' && typeof navigator === 'object' && typeof navigator.userAgent === 'string';
export const isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
