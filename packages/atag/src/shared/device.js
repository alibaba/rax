const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknow';

export const isIOS = /(iPhone|iPad|iPod)/.test(ua);
export const isAndroid = /Android/.test(ua);
export const isTB = /AliTB/.test(ua);
