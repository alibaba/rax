import fs from 'fs';

export default function getBabelConfig(query = {}) {
  let result = {};
  const BABELRC_FILE = process.cwd() + '/.babelrc';

  if (query.babel) {
    result = query.babel;
  } else {
    let content = fs.readFileSync(BABELRC_FILE);
    try {
      let config = JSON.parse(content);
      result = config;
    } catch (e) {
      console.error('`.babelrc` config error');
    }
  }

  if (!result.presets && !result.plugins) {
    console.error('please config `.babelrc` or `webpack.config.js` loader query');
  }
  return result;
};
