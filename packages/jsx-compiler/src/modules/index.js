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
   * Handle code.
   */
  require('./code'),

  /**
   * Handle JSX template.
   */
  require('./template'),

  /**
   * Handle Rax base components.
   * Order: parse in front of template.
   */
  require('./components'),
];
