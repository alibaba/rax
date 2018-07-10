class ViewElement extends HTMLElement {
  constructor() {
    super();
    const root = document.createElement('div');
    const children = document.createElement('slot');
    root.appendChild(children);

    const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(root);

    if (this.hasAttribute('shadow-style')) {
      const shadowStyle = this.getAttribute('shadow-style');
      const style = document.createElement('style');
      style.innerText = shadowStyle;
      // Create some CSS to apply to the shadow dom
      shadowRoot.appendChild(style);
    }
  }
}

customElements.define('a-view', ViewElement);
