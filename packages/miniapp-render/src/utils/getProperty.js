export default function(obj, path, cache) {
  // Reduce traversal through cache
  cache.find(({ path: cachedPath, value }) => {
    if (cachedPath === path) {
      path = '';
      obj = value;
      return true;
    } else {
      const pathSplited = path.split(`${cachedPath}.`);
      if (pathSplited.length > 1) {
        path = pathSplited[1];
        obj = value;
        return true;
      }
    }
    return false;
  });

  let value = obj;
  let parentRendered = true;

  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return {
      parentRendered,
      value,
    };
  }
  const keys = path.split('.');
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      const matched = keys[i].match(/\[(.+?)\]/);
      const key = matched && matched[1] ? matched[1] : keys[i];
      // If i is not equal to keys length - 1, the parent node doesn't exist in the view
      if (!value[key] && i !== keys.length - 1) {
        parentRendered = false;
        break;
      };
      value = value[key];
    }
  }

  return {
    parentRendered,
    value,
  };
}
