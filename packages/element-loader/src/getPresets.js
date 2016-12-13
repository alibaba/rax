import fs from 'fs';

// default rax presets
const DEFAULT_PRESETS = ['es2015', 'rax'];

export default function getPresets(presets) {
  let result = DEFAULT_PRESETS;
  const BABELRC_FILE = process.cwd() + '/.babelrc';

  if (!presets || !Array.isArray(presets)) {
    let content = fs.readFileSync(BABELRC_FILE);
    try {
      let config = JSON.parse(content);
      result = config.presets;
    } catch (e) {
      console.error('.babelrc config error');
    }
  } else {
    result = presets;
  }
  return result;
};
