function minIndent(str) {
  const match = str.match(/^[ \t]*(?=\S)/gm);

  if (!match) {
    return 0;
  }

  return Math.min.apply(Math, match.map(x => x.length));
}

module.exports = function stripIndent(template) {
  if (typeof template !== 'string') return template;

  const indent = minIndent(template);

  if (indent === 0) {
    return template;
  }

  const re = new RegExp(`^[ \\t]{${indent}}`, 'gm');

  return template.replace(re, '').trim();
};
