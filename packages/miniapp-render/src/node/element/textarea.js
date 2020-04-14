import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';

const pool = new Pool();

class HTMLTextAreaElement extends Element {
  /**
   * Create instance
   */
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Multiplexed element node
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new HTMLTextAreaElement(options, tree);
  }

  // Override the parent class's recovery instance method
  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reuse element node
      pool.add(this);
    }
  }

  /**
   * $_generateHtml handle other attributes
   */
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

    // Special field
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
  get type() {
    return this.$_attrs.get('type') || 'textarea';
  }

  set type(value) {
    value = '' + value;
    this.$_attrs.set('type', value);
  }

  get value() {
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

  get selectionStart() {
    const value = +this.$_attrs.get('selection-start');
    return value !== undefined ? value : -1;
  }

  set selectionStart(value) {
    this.$_attrs.set('selection-start', value);
  }

  get selectionEnd() {
    const value = +this.$_attrs.get('selection-end');
    return value !== undefined ? value : -1;
  }

  set selectionEnd(value) {
    this.$_attrs.set('selection-end', value);
  }

  focus() {
    this.$_attrs.set('focus', true);
  }

  blur() {
    this.$_attrs.set('focus', false);
  }
}

export default HTMLTextAreaElement;
