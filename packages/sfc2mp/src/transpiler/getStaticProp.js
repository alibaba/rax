const STATIC_PROP_REG = /^"?(.*)"/;

module.exports = function getStaticProp(str) {
  const match = STATIC_PROP_REG.exec(str);
  return match ? match[1] : str;
};
