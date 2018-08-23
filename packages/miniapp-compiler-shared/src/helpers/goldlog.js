const axios = require('axios');

function format(opts) {
  opts = opts || {};
  return Object
    .keys(opts)
    .map((key) => {
      return `${key}=${opts[key]}`;
    })
    .join('&');
}

function passThrough(args) {
  return args;
}

function noop() { }

module.exports = function goldlog(key, data) {
  const gokey = format(data);
  return axios({
    method: 'post',
    url: 'http://gm.mmstat.com/' + key,
    data: {
      cache: Math.random(),
      gmkey: 'CLK',
      gokey: encodeURIComponent(gokey),
      logtype: '2',
    },
  })
    .then(passThrough)
    .catch(noop);
}