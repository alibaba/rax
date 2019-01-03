/* eslint-disable no-undef */

const { appName, appVersion, platform, userAgent, language } =
  typeof __windmill_environment__ === 'object'
    ? __windmill_environment__
    : {};

export default {
  appName,
  appVersion,
  platform,
  language,
  userAgent,
};
