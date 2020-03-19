module.exports = (options) => {
  return options.adapter ? options.platform.type === 'quickapp' : options.platform === 'quickapp';
}