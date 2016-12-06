export default (children, element, index) => {
  const elementKey = element && element.key;
  const hasKey = typeof elementKey === 'string';
  const defaultName = '.' + index.toString(36);

  if (hasKey) {
    let keyName = '$' + elementKey;
    // Child keys must be unique.
    let keyUnique = children[keyName] === undefined;
    // Only the first child will be used when encountered two children with the same key
    if (!keyUnique) console.warn(`Encountered two children with the same key "${elementKey}".`);

    return keyUnique ? keyName : defaultName;
  } else {
    return defaultName;
  }
};
