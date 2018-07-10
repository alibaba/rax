class ButtonElement extends HTMLElement {
  connectedCallback() {
    let imgSrc = this.getAttribute('src');

    if (imgSrc) {
      this.innerHTML = `<img src="${imgSrc}" />`;
    }
  }
}

customElements.define('a-button', ButtonElement);
