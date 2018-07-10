class ImageElement extends HTMLElement {
  // @@important@@
  // Specify observed attributes so that
  // attributeChangedCallback will work
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();
    const root = document.createElement('img');
    this.root = root;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(root);
  }

  connectedCallback() {
    this.syncSrc();
  }

  // when attr changed, the callback triggerd
  attributeChangedCallback() {
    this.syncSrc();
  }

  syncSrc() {
    const imgSrc = this.getAttribute('src');
    this.root.setAttribute('src', imgSrc);

    const style = this.getAttribute('style');
    this.root.setAttribute('style', style);
  }
}

customElements.define('a-image', ImageElement);
