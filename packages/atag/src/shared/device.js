const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknow';

export const isIOS = /iOS/.test(ua);
export const isAndroid = /Android/.test(ua);
export const isTB = /AliTB/.test(ua);
