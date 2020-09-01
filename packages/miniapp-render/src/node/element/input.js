import Element from '../element';

class HTMLInputElement extends Element {
  constructor(options) {
    super(options);
  }

  // $_generateHtml handle other attributes
  $$dealWithAttrsForGenerateHtml(html, node) {
    const type = node.type;
    if (type) html += ` type="${type}"`;

    const value = node.value;
    if (value) html += ` value="${value}"`;

    const disabled = node.disabled;
    if (disabled) html += ' disabled';

    const maxlength = node.maxlength;
    if (maxlength) html += ` maxlength="${maxlength}"`;

    const placeholder = node.placeholder;
    if (placeholder)
      html += ` placeholder="${placeholder.replace(/"/g, '\\"')}"`;

    return html;
  }

  // outerHtml
  $$dealWithAttrsForOuterHTML(node) {
    this.type = node.type || '';
    this.value = node.value || '';
    this.disabled = node.disabled || '';
    this.maxlength = node.maxlength;
    this.placeholder = node.placeholder || '';

    // Special attr
    this.mpplaceholderclass = node.mpplaceholderclass || '';
  }

  /**
   * The cloneNode interface is invoked to handle additional properties
   */
  $$dealWithAttrsForCloneNode() {
    return {
      type: this.type,
      value: this.value,
      disabled: this.disabled,
      maxlength: this.maxlength,
      placeholder: this.placeholder,

      // Special field
      mpplaceholderclass: this.mpplaceholderclass
    };
  }

  // Attribute
  get name() {
    return this.__attrs.get('name');
  }

  set name(value) {
    value = '' + value;
    this.__attrs.set('name', value);
  }

  get type() {
    return this.__attrs.get('type') || 'text';
  }

  set type(value) {
    value = '' + value;
    this.__attrs.set('type', value);
  }

  get value() {
    const type = this.__attrs.get('type');
    let value = this.__attrs.get('value');
    if (!value && !this.changed) {
      value = this.__attrs.get('defaultValue');
    }
    return value || '';
  }

  set value(value) {
    this.changed = true;
    value = '' + value;
    this.__attrs.set('value', value);
  }

  get readOnly() {
    return !!this.__attrs.get('readOnly');
  }

  set readOnly(value) {
    this.__attrs.set('readOnly', !!value);
  }

  get disabled() {
    return !!this.__attrs.get('disabled');
  }

  set disabled(value) {
    value = !!value;
    this.__attrs.set('disabled', value);
  }

  get maxlength() {
    return this.__attrs.get('maxlength');
  }

  set maxlength(value) {
    this.__attrs.set('maxlength', value);
  }

  get placeholder() {
    return this.__attrs.get('placeholder') || '';
  }

  set placeholder(value) {
    value = '' + value;
    this.__attrs.set('placeholder', value);
  }

  get autofocus() {
    return !!this.__attrs.get('autofocus');
  }

  set autofocus(value) {
    value = !!value;
    this.__attrs.set('autofocus', value);
  }

  set checked(value) {
    this.__attrs.set('checked', value);
  }

  get checked() {
    return this.__attrs.get('checked') || '';
  }

  blur() {
    this.__attrs.set('focus', false);
  }

  focus() {
    this.__attrs.set('autofocus', true);
  }
}

export default HTMLInputElement;
