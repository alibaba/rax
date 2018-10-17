module.exports = function kebabCase(string) {
  let kebab = '';
  for (let i = 0, l = string.length; i < l; i++) {
    if (/[a-z]/.test(string[i])) {
      kebab += string[i];
    } else if (/[A-Z]/.test(string[i])) {
      kebab += '-' + string[i].toLowerCase();
    } else if (string[i] === '-') {
      kebab += '-';
    }
  }
  if (kebab[0] === '-') {
    return kebab.slice(1);
  } else {
    return kebab;
  }
};
