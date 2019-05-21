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
  // require('./render-plugins/render-generate-plugin'),

  // require('./render-plugins/render-event-plugin'),
  // require('./render-plugins/render-logic-plugin'),
  // require('./render-plugins/render-tag-plugin'),
  require('./attrs'),
  require('./style'),

  /**
   * Handle Rax base components.
   * Order: parse in front of template.
   */
  require('./components'),

  require('./template'),

];
