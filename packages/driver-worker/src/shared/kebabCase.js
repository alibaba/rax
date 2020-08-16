const KebabCache = {};

export default function kebabCase(string) {
  if (KebabCache[string]) {
    return KebabCache[string];
  }

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

  return KebabCache[string] = kebab;
}
