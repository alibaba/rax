const map = new Map();
const createEvent = name => new Event(name, { bubbles: true });

function assign(node) {
  if (!node || !node.nodeName || node.nodeName !== 'TEXTAREA' || map.has(node))
    return;

  let heightOffset = null;
  let clientWidth = null;
  let cachedHeight = null;

  function init() {
    const style = window.getComputedStyle(node, null);

    if (style.resize === 'vertical') {
      node.style.resize = 'none';
    } else if (style.resize === 'both') {
      node.style.resize = 'horizontal';
    }

    if (style.boxSizing === 'content-box') {
      heightOffset = -(
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      );
    } else {
      heightOffset =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    }
    if (isNaN(heightOffset)) {
      heightOffset = 0;
    }

    update();
  }

  function changeOverflow(value) {
    const width = node.style.width;
    node.style.width = '0px';
    node.offsetWidth;
    node.style.width = width;

    node.style.overflowY = value;
  }

  function getParentOverflows(el) {
    const arr = [];

    while (el && el.parentNode && el.parentNode instanceof Element) {
      if (el.parentNode.scrollTop) {
        arr.push({
          node: el.parentNode,
          scrollTop: el.parentNode.scrollTop
        });
      }
      el = el.parentNode;
    }

    return arr;
  }

  function resize() {
    if (node.scrollHeight === 0) {
      return;
    }

    const overflows = getParentOverflows(node);
    const docTop =
      document.documentElement && document.documentElement.scrollTop;

    node.style.height = '';
    node.style.height = node.scrollHeight + heightOffset + 'px';

    clientWidth = node.clientWidth;

    overflows.forEach(el => {
      el.node.scrollTop = el.scrollTop;
    });

    if (docTop) {
      document.documentElement.scrollTop = docTop;
    }
  }

  function update() {
    resize();

    const styleHeight = Math.round(parseFloat(node.style.height));
    const computed = window.getComputedStyle(node, null);
    let actualHeight =
      computed.boxSizing === 'content-box'
        ? Math.round(parseFloat(computed.height))
        : node.offsetHeight;
    if (actualHeight < styleHeight) {
      if (computed.overflowY === 'hidden') {
        changeOverflow('scroll');
        resize();
        actualHeight =
          computed.boxSizing === 'content-box'
            ? Math.round(parseFloat(window.getComputedStyle(node, null).height))
            : node.offsetHeight;
      }
    } else {
      if (computed.overflowY !== 'hidden') {
        changeOverflow('hidden');
        resize();
        actualHeight =
          computed.boxSizing === 'content-box'
            ? Math.round(parseFloat(window.getComputedStyle(node, null).height))
            : node.offsetHeight;
      }
    }

    if (cachedHeight !== actualHeight) {
      cachedHeight = actualHeight;
      const evt = createEvent('autosize:resized');
      node.dispatchEvent(evt);
    }
  }

  const pageResize = () => {
    if (node.clientWidth !== clientWidth) {
      update();
    }
  };

  const destroy = (style => {
    window.removeEventListener('resize', pageResize, false);
    node.removeEventListener('keyup', update, false);
    node.removeEventListener('autosize:destroy', destroy, false);
    node.removeEventListener('autosize:update', update, false);

    Object.keys(style).forEach(key => {
      node.style[key] = style[key];
    });

    map.delete(node);
  }).bind(node, {
    height: node.style.height,
    resize: node.style.resize,
    overflowY: node.style.overflowY,
    overflowX: node.style.overflowX,
    wordWrap: node.style.wordWrap
  });

  node.addEventListener('autosize:destroy', destroy, false);

  window.addEventListener('resize', pageResize, false);
  node.addEventListener('autosize:update', update, false);
  node.style.overflowX = 'hidden';
  node.style.wordWrap = 'break-word';

  map.set(node, {
    destroy,
    update
  });

  init();
}

function destroy(node) {
  const methods = map.get(node);
  if (methods) {
    methods.destroy();
  }
}

function update(node) {
  const methods = map.get(node);
  if (methods) {
    methods.update();
  }
}

const autosize = (el, options) => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], x =>
      assign(x, options)
    );
  }
  return el;
};
autosize.destroy = el => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], destroy);
  }
  return el;
};
autosize.update = el => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], update);
  }
  return el;
};

export default autosize;
