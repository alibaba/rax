let OS = 'web';

if (typeof WXEnvironment === 'object') {
  OS = WXEnvironment.platform.toLowerCase();
}

export default {
  OS,
  select: obj => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === OS) {
        return obj[keys[i]];
      }
    }
  }
};
