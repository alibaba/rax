let OS;

if (typeof navigator === 'object') {
  OS = navigator.platform.toLowerCase();
} else if (typeof WXEnvironment === 'object') {
  OS = WXEnvironment.platform;
}

export default {
  OS,
  select: obj => obj[OS],
};
