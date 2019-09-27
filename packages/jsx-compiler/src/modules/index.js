/**
 * Attention:
 *   The later registered module is called early in parse, but later in generate.
 */
module.exports = [
  // Generate JSON config.
  require('./config'),
  // Extract css from files.
  require('./css'),
  // Handle js code.
  require('./code'),
  // Handle template attrs
  require('./element'),
  // Handle template style attr
  require('./style'),
  // Handle Rax base components.
  require('./components'),
  // JSX+ Directives
  require('./jsx-plus'),
  // Directive a:for
  require('./list'),
  // Directive a:if
  require('./condition'),
  // Handle render function
  require('./render-function'),
  // Parse and generate template.
  require('./template'),
];
