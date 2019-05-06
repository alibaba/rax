/**
 * Attention:
 *   The later registered module is called early in parse, but later in generate.
 */
module.exports = [
  /**
   * Generate config.
   */
  require('./config'),
  /**
   * Generate css from files.
   */
  require('./css'),
  /**
   * Restrict to only have one return in render.
   */
  require('./onlyOneReturn'),
  /**
   * Extract JSX template.
   */
  require('./extractJSXTemplate'),
];
