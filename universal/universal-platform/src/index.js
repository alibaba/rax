let OS = 'Web';

if (typeof WXEnvironment === 'object') {
  OS = WXEnvironment.platform.toLowerCase() === 'ios' ? 'iOS' : 'Android';
}

export default {
  OS,
  select: obj => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === OS.toLowerCase()) {
        return obj[keys[i]];
      }
    }
  }
};
