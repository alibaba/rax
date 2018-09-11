export default function handlerSubmit(form) {
  /**
   * Get the value of all form elements in a child element
   * format e.detail
   * {
   *   value: {
   *      [name]: 'value'
   *   }
   * }
   */
  const formFields = form.querySelectorAll('[name]');
  const value = Object.create(null);
  [...formFields].forEach(node => {
    const name = node.getAttribute('name');
    switch (node.localName) {
      case 'a-checkbox-group':
        const arr = [...node.querySelectorAll('a-checkbox')].filter(
          checkbox => checkbox.checked
        );
        value[name] = arr.map(checkbox => checkbox.value);
        break;
      case 'a-switch':
        value[name] = node.checked;
        break;
      case 'a-radio-group':
        const checkedRadio = node.querySelector('[checked]');
        if (checkedRadio) {
          value[name] = node.querySelector('[checked]').value;
        } else {
          value[name] = '';
        }
        break;
      default:
        value[name] = node.value;
    }
  });
  const evt = new CustomEvent('submit', {
    bubbles: true,
    composed: true,
    detail: {
      value
    }
  });
  form.dispatchEvent(evt);
}
