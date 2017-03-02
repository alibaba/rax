import {isWeex} from 'universal-env';
const env = {};
let envs = {};

if (!isWeex) {
  const ua = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  let matched;
  let platform = '';

  envs = {
    os: {
      android: ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      iphone: (iphone && !ipod),
      ipad: !!ipad,
      version: (function() {
        var ua = navigator.userAgent.toLowerCase();
        var match = ua.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
      })()
    },
  };
}

export default envs;