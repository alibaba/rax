function createStyle(innerText) {
  const style = document.createElement('style');
  if (typeof innerText === 'string') {
    style.innerHTML = innerText;
  }
  return style;
}

export default function injectStyle(content) {
  return function(klass) {
    return class extends klass {
      constructor() {
        super();
        const shadowRoot =
          this.shadowRoot || this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(createStyle(content));
      }
    };
  };
}
