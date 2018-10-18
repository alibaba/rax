const path = require('path');
const fs = require('fs');
const axios = require('axios');

const REGISTRY_URL = 'http://registry.npmjs.com/miniapp-framework/latest';
const DIST_FILE = path.join(__dirname, 'src/config/frameworkVersion.js');

axios(REGISTRY_URL).then(response => {
  const { version } = response.data;
  const content = `module.exports = '${version}';`;
  fs.writeFileSync(DIST_FILE, content, 'utf-8');
  console.log('Write Framework Version: ' + version);
});
