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
  // Handle rax-slider
  require('./rax-slider'),
  // Handle template attrs
  require('./element'),
  // Handle jsx attribute
  require('./attribute'),
  // Handle template style attr
  require('./style'),
  // Handle Rax base components.
  require('./components'),
  // Directive a:for
  require('./list'),
  // JSX+ Directives
  require('./jsx-plus'),
  // Directive a:if
  require('./condition'),
  // Handle render function
  require('./render-function'),
  // Hadnle render props
  require('./render-props'),
  // Parse and generate template.
  require('./template'),
  // Handle function
  require('./function')
];
