
export default function applyFactory(factory) {
  const module = {};
  module.exports = {};
  factory(module, module.exports);
  return module.exports;
}
