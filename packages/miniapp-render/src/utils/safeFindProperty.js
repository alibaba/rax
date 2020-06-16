export default function(obj, path) {
  if (!path) return;
  let result = obj;
  const keys = path.split('.');
  for (let i = 0; i < keys.length; i ++) {
    const matched = keys[i].match(/\[(.+?)\]/);
    const key = matched && matched[1] ? matched[1] : keys[i];
    if (!result[key]) break;
    result = result[key];
  }
  return result;
}
