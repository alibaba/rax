function decode(s) {
  return decodeURIComponent(s.replace(/\+/g, ' '));
}

function endsWith(str, suffix) {
  var ind = str.length - suffix.length;
  return ind >= 0 && str.indexOf(suffix, ind) === ind;
}

function unparam(str, sep, eq) {
  // str = str.trim();
  if (typeof str !== 'string' || !str) {
    return {};
  }
  str = str.replace(/^\s*/, '').replace(/\s*$/, '');
  sep = sep || '&';
  eq = eq || '=';
  var ret = {}, eqIndex, pairs = str.split(sep), key, val, i = 0, len = pairs.length;
  for (;i < len; ++i) {
    eqIndex = pairs[i].indexOf(eq);
    if (eqIndex === -1) {
      key = decode(pairs[i]);
      val = undefined;
    } else {
      key = decode(pairs[i].substring(0, eqIndex));
      val = pairs[i].substring(eqIndex + 1);
      try {
        val = decode(val);
      } catch (e) {
        console.on('error', 'decodeURIComponent error : ' + val);
        console.on('error', e);
      }
      if (endsWith(key, '[]')) {
        key = key.substring(0, key.length - 2);
      }
    }
    if (key in ret) {
      if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ ret[key], val ];
      }
    } else {
      ret[key] = val;
    }
  }
  return ret;
}

export default unparam;