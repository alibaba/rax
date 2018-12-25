const { existsSync } = require('fs');
const { resolve} = require('path');
const { getAppConfig } = require('./getAppConfig');

module.exports = (projectDir) => {
  const appConfig = getAppConfig(projectDir);
  const externalApi = appConfig.externalApi;

  if (!externalApi) {
    return false;
  }

  const externalApiPath = resolve(projectDir, externalApi);
    
  if (existsSync(externalApiPath)) {
    return true;
  } else {
    console.error('Cannot find this extenal api file : ' + externalApi);
    return false;
  }
}