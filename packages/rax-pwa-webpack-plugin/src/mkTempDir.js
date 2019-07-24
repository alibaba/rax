const fs = require('fs');

const mkTempDir = (appDirectory) => {
  const tempFileDirPath = appDirectory + '/.temp';
  if (!fs.existsSync(tempFileDirPath)) {
    fs.mkdirSync(appDirectory + '/.temp');
  }
};

module.exports = mkTempDir;
