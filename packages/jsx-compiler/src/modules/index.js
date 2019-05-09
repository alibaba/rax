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
   * Extract JSX template.
   */
  require('./extractTemplate'),
];
