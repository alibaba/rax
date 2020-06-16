import Element from '../element';

class HTMLInputElement extends Element {
  // Create instance
  static $$create(options, tree) {
    return new HTMLInputElement(options, tree);
  }

  // Override parent class recycle method
  $$recycle() {
    this.$$destroy();
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
    return this.$_attrs.get('name');
  }

  set name(value) {
    value = '' + value;
    this.$_attrs.set('name', value);
  }

  get type() {
    return this.$_attrs.get('type') || 'text';
  }

  set type(value) {
    value = '' + value;
    this.$_attrs.set('type', value);
  }

  get value() {
    const type = this.$_attrs.get('type');
    let value = this.$_attrs.get('value');
    if (!value && !this.changed) {
      value = this.$_attrs.get('defaultValue');
    }
    return value || '';
  }

  set value(value) {
    this.changed = true;
    value = '' + value;
    this.$_attrs.set('value', value);
  }

  get readOnly() {
    return !!this.$_attrs.get('readOnly');
  }

  set readOnly(value) {
    this.$_attrs.set('readOnly', !!value);
  }

  get disabled() {
    return !!this.$_attrs.get('disabled');
  }

  set disabled(value) {
    value = !!value;
    this.$_attrs.set('disabled', value);
  }

  get maxlength() {
    return this.$_attrs.get('maxlength');
  }

  set maxlength(value) {
    this.$_attrs.set('maxlength', value);
  }

  get placeholder() {
    return this.$_attrs.get('placeholder') || '';
  }

  set placeholder(value) {
    value = '' + value;
    this.$_attrs.set('placeholder', value);
  }

  get autofocus() {
    return !!this.$_attrs.get('autofocus');
  }

  set autofocus(value) {
    value = !!value;
    this.$_attrs.set('autofocus', value);
  }

  set checked(value) {
    this.$_attrs.set('checked', value);
  }

  get checked() {
    return this.$_attrs.get('checked') || '';
  }

  blur() {
    this.$_attrs.set('focus', false);
  }

  focus() {
    this.$_attrs.set('autofocus', true);
  }
}

export default HTMLInputElement;
