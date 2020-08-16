/**
 * Remove pre and after spaces and wraps.
 * Logical from @babel/types/lib/utils/react/cleanJSXElementLiteralChild.js
 * @param rawString
 * @return {string}
 */
module.exports = function cleanJSXElementStringLiteral(rawString = '') {
  const lines = rawString.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i;
    }
  }
  let str = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isFirstLine = i === 0;
    const isLastLine = i === lines.length - 1;
    const isLastNonEmptyLine = i === lastNonEmptyLine;
    let trimmedLine = line.replace(/\t/g, ' ');
    if (!isFirstLine) {
      trimmedLine = trimmedLine.replace(/^[ ]+/, '');
    }
    if (!isLastLine) {
      trimmedLine = trimmedLine.replace(/[ ]+$/, '');
    }
    if (trimmedLine) {
      if (!isLastNonEmptyLine) {
        trimmedLine += ' ';
      }
      str += trimmedLine;
    }
  }
  return str;
};
