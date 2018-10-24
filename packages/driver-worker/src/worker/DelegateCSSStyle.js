
export default class DelegateCSSStyle {
  constructor(document) {
    this.cssText = '';

    this.styleEl = document.createElement('style');
    document.body.appendChild(this.styleEl);
    this.styleInnerText = document.createTextNode(this.cssText);
    this.styleEl.appendChild(this.styleInnerText);
  }

  gatherCSSText(text) {
    this.cssText += text;
  }

  updateStyle(cssText) {
    this.styleInnerText.textContent = cssText;
  }

  clearStyle() {
    this.updateStyle(this.cssText = '');
  }
}
