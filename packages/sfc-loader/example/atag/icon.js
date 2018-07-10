const svgData = {
  success: {
    size: '0 0 48 48',
    content: '<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zM13.1 23.2l-2.2 2.1 10 9.9L38.1 15l-2.2-2-15.2 17.8-7.6-7.6z" fill-rule="evenodd"/></svg>'
  },
  info: {
    size: '0 0 48 48',
    content: '<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><circle cx="13.828" cy="19.63" r="1.938"/><circle cx="21.767" cy="19.63" r="1.938"/><circle cx="29.767" cy="19.63" r="1.938"/><path d="M22.102 4.161c-9.918 0-17.958 7.146-17.958 15.961 0 4.935 2.522 9.345 6.481 12.273v5.667l.038.012a2.627 2.627 0 1 0 4.501 1.455l.002.001 5.026-3.539c.628.059 1.265.093 1.911.093 9.918 0 17.958-7.146 17.958-15.961-.001-8.816-8.041-15.962-17.959-15.962zm-.04 29.901c-.902 0-1.781-.081-2.642-.207l-5.882 4.234c-.024.025-.055.04-.083.06l-.008.006a.511.511 0 0 1-.284.095.525.525 0 0 1-.525-.525l.005-6.375c-3.91-2.516-6.456-6.544-6.456-11.1 0-7.628 7.107-13.812 15.875-13.812s15.875 6.184 15.875 13.812-7.107 13.812-15.875 13.812z"/></svg>'
  },
  warn: {
    size: '0 0 64 64',
    content: '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M59.58 40.889L41.193 9.11C39.135 5.382 35.723 3 31.387 3c-3.11 0-6.521 2.382-8.58 6.111L4.42 40.89c-2.788 4.635-3.126 8.81-1.225 12.22C5.015 56.208 7.572 58 13 58h36.773c5.428 0 9.21-1.792 11.031-4.889 1.9-3.41 1.564-7.584-1.225-12.222zm-2.452 11c-.635 1.695-3.802 2.444-7.354 2.444H13c-3.591 0-5.493-.75-6.129-2.444-1.712-2.41-1.375-5.262 0-8.556l18.386-31.777c2.116-3.168 4.394-4.89 6.13-4.89 2.96 0 5.238 1.722 7.354 4.89l18.386 31.777c1.374 3.294 1.713 6.146 0 8.556zm-25.74-33c-.405 0-1.227.836-1.227 2.444v15.89c0 1.608.822 2.444 1.226 2.444 1.628 0 2.452-.836 2.452-2.445V21.333c0-1.608-.824-2.444-2.452-2.444zm0 23.222c-.405 0-1.227.788-1.227 1.222v2.445c0 .434.822 1.222 1.226 1.222 1.628 0 2.452-.788 2.452-1.222v-2.445c0-.434-.824-1.222-2.452-1.222z" fill-rule="evenodd"/></svg>'
  },
  waiting: {
    size: '0 0 120 120',
    content: '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><circle cx="60" cy="60" r="60"/><path d="M62 59.171V24a2 2 0 0 0-4 0v36c0 .66.324 1.241.818 1.606.057.076.113.153.182.222l22.627 22.628a2 2 0 0 0 2.829-2.828L62 59.171z" fill="#FFF"/></g></svg>'
  },
  clear: {
    size: '0 0 48 48',
    content: '<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zm0-3c11.598 0 21-9.402 21-21S35.598 3 24 3 3 12.402 3 24s9.402 21 21 21z"/><path d="M24.34 22.219l-7.775-7.774a1.499 1.499 0 1 0-2.121 2.121l7.774 7.774-7.774 7.775a1.499 1.499 0 1 0 2.12 2.12l7.775-7.773 7.775 7.774a1.499 1.499 0 1 0 2.121-2.121L26.46 24.34l7.774-7.774a1.499 1.499 0 1 0-2.121-2.121l-7.775 7.774z"/></g></svg>'
  },
  success_no_circle: {
    size: '0 0 44 44',
    content: '<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><path d="M34.538 8L38 11.518 17.808 32 8 22.033l3.462-3.518 6.346 6.45z" fill-rule="evenodd"/></svg>'
  },
  download: {
    size: '0 0 48 48',
    content: '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero"><path d="M20 40C8.972 40 0 31.028 0 20 0 8.97 8.972 0 20 0s20 8.972 20 20c0 11.026-8.97 20-20 20zm0-3c9.375 0 17-7.628 17-17 0-9.374-7.627-17-17-17-9.373 0-17 7.625-17 17 0 9.374 7.627 17 17 17z"/><path d="M21.259 30.487c-.104.104-.741.612-1.315.613-.581 0-1.1-.508-1.206-.613l-4.82-5.162c-.748-.802-.464-1.453.625-1.455l3.966-.008V9.08c0-.308.443-1.08 1.435-1.08s1.538.792 1.538 1.08v14.782l3.97.003c1.095.001 1.38.649.627 1.455l-4.82 5.167z"/></g></svg>'
  },
  cancel: {
    size: '0 0 48 48',
    content: '<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zm.353-25.77l-7.593-7.593c-.797-.799-1.538-.822-2.263-.207-.724.614-.56 1.617-.124 2.067l7.852 7.847-7.721 7.723c-.726.728-.558 1.646-.065 2.177.494.532 1.554.683 2.312-.174l7.587-7.584 7.644 7.623c.796.799 1.608.725 2.211.146.604-.579.72-1.442-.075-2.24l-7.657-7.669 7.544-7.521c.811-.697.9-1.76.297-2.34-.92-.885-1.849-.338-2.264.078l-7.685 7.667z" fill-rule="evenodd"/></svg>'
  },
  search: {
    size: '0 0 44 44',
    content: '<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><path d="M32.981 29.255l8.914 8.293L39.603 40l-8.859-8.242a15.952 15.952 0 0 1-10.754 4.147C11.16 35.905 4 28.763 4 19.952 4 11.142 11.16 4 19.99 4s15.99 7.142 15.99 15.952c0 3.472-1.112 6.685-2.999 9.303zm.05-9.21c0 7.123-5.701 12.918-12.88 12.918-7.177 0-13.016-5.795-13.016-12.918 0-7.12 5.839-12.917 13.017-12.917 7.178 0 12.879 5.797 12.879 12.917z" fill-rule="evenodd"/></svg>'
  },
  loading: {
    size: '0 0 60 60',
    content: '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path fill="#ccc" d="M29.691-.527c-15.648 0-28.333 12.685-28.333 28.333s12.685 28.333 28.333 28.333c15.648 0 28.333-12.685 28.333-28.333S45.339-.527 29.691-.527zm.184 53.75c-14.037 0-25.417-11.379-25.417-25.417S15.838 2.39 29.875 2.39s25.417 11.379 25.417 25.417-11.38 25.416-25.417 25.416z"/><path fill="none" stroke="#108ee9" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" d="M56.587 29.766c.369-7.438-1.658-14.699-6.393-19.552"/></svg>'
  },
  'contact-button': {
    size: '0 0 101 101',
    content: '<svg width="101" height="101" viewBox="0 0 101 101" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M0 50.5C0 78.39 22.61 101 50.5 101S101 78.39 101 50.5 78.39 0 50.5 0 0 22.61 0 50.5z" fill="#00A3FF"/><path d="M71.52 26H29.486c-4.132-.002-7.483 3.352-7.485 7.49v29.813c0 4.137 3.348 7.49 7.479 7.49h4.35v10.705a1.501 1.501 0 0 0 2.691.913 70.674 70.674 0 0 1 5.193-5.964c1.254-1.28 2.46-2.394 3.597-3.296 1.93-1.535 3.545-2.354 4.589-2.358l.181.006h.66l2.442.006c4.445.005 8.89.005 13.335 0l3.585-.006h1.413c4.134 0 7.485-3.356 7.485-7.496V33.49c0-4.137-3.349-7.49-7.48-7.49zM51.377 69.586c.012-.069.02-.137.023-.207a.475.475 0 0 1-.023.207zM76 63.303a4.491 4.491 0 0 1-4.488 4.491h-1.41l-3.585.003c-5.255.003-10.51.003-15.765 0l-.645-.003.015.015c-.071-.009-.14-.02-.216-.02-1.905 0-4.035 1.081-6.46 3.007-1.244.988-2.54 2.184-3.875 3.545a73.709 73.709 0 0 0-2.742 2.975v-8.022c0-.83-.672-1.503-1.5-1.503h-5.844A4.482 4.482 0 0 1 25 63.311V33.49a4.484 4.484 0 0 1 4.485-4.486h42.03A4.484 4.484 0 0 1 76 33.49v29.813z" fill="#FFF"/></g></svg>'
  }
};

var sprite;
var SymbolObj = {};
function createSprite(id) {
  if (id && !SymbolObj[id]) {
    if (!sprite) {
      var aIconSpriteNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      aIconSpriteNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      aIconSpriteNode.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      aIconSpriteNode.setAttribute('style', 'position: absolute; width: 0; height: 0');
      aIconSpriteNode.setAttribute('id', 'a-icon-sprite-node');
      sprite = document.body.insertBefore(aIconSpriteNode, document.body.firstChild || null);
    }
    var symbolNode = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbolNode.setAttribute('id', id);
    symbolNode.setAttribute('viewBox', svgData[id].size);
    var svgNode = new DOMParser().parseFromString(svgData[id].content, 'image/svg+xml').documentElement;
    symbolNode.appendChild(svgNode);
    sprite.appendChild(symbolNode);
    // SymbolObj[params.id] not be undefined is OK.
    SymbolObj[id] = 1;
  }
}

class IconElement extends HTMLElement {
  connectedCallback() {
    let type = this.getAttribute('type');
    let color = this.getAttribute('color') || 'currentColor';
    let size = this.getAttribute('size') || '23';

    if (type) {
      createSprite(type);
      this.innerHTML = `
        <svg class="a-icon-svg a-icon-svg-${type}" style="fill: ${color}; background-size: cover; width: ${size}; height: ${size}">
          <use xlink:href="#${type}" />
        </svg>
      `;
    }
  }
}

customElements.define('a-icon', IconElement);
