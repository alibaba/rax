export let isWeex = typeof callNative === 'function';
export let isWeb = typeof window === 'object' && typeof window.document === 'object' && typeof navigator === 'object' && typeof navigator.userAgent === 'string';
