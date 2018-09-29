module.exports = styles => {
  const styleContext = styles.map(s => s.content).join('\n');
  return styleContext;
};
