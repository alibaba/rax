const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
const TS_FILES_PATTERN = 'src/**/*.+(ts|tsx)';
const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
const IGNORE_PATTERN = '**/__tests__/**';

module.exports = {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN
};
