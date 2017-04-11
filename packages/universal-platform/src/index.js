let OS = 'web';

if (typeof WXEnvironment === 'object') {
  OS = WXEnvironment.platform;
}

export default {
  OS,
  select: obj => obj[OS]
};
