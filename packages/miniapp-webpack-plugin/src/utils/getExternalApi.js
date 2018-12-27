const { realpathSync, existsSync } = require('fs');
const { resolve} = require('path');
const { getAppConfig } = require('./getAppConfig');

module.exports = () => {
  const appDirectory = realpathSync(process.cwd());
  const appConfig = getAppConfig(appDirectory);
  const externalApi = appConfig.externalApi;

  if (!externalApi) {
    return;
  }

  const externalApiPath = resolve(appDirectory, externalApi);

  if (existsSync(externalApiPath)) {
    return externalApiPath;
  } else {
    console.error('Cannot find this extenal api file : ' + externalApi);
    return;
  }
};