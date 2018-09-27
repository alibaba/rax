const { join } = require('path');
const { existsSync, readFileSync } = require('fs');

module.exports = function getAppJSON(rootDir) {
  const appJSONPath = join(rootDir, 'manifest.json');

  if (!existsSync(appJSONPath)) {
    throw new Error('manifest.json not exists');
  }

  const appJSON = JSON.parse(readFileSync(appJSONPath, 'utf-8'));

  appJSON.pages = Object.values(appJSON.pages);
  return appJSON;
};
