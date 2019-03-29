module.exports = function stripIndent(template) {
  if (typeof template !== 'string') return template;
  const match = template.match(/^[^\S]*(?=\S)/gm);
  const indent = match && Math.min(...match.map(el => el.length));

  if (indent) {
    const regexp = new RegExp(`^.{${indent}}`, 'gm');
    template = template.replace(regexp, '');
  }

  return template.trim();
};
