import GCanvas from 'weex-plugin--weex-gcanvas';

class CanvasWeex {
  static init = (element, canvasId) => {
    // weex g2-mobile getElementBtId
    document.getElementById = (id) => {
      return new CanvasWeex(element);
    };

    return new Promise(function(resolve) {
      GCanvas.start(element.ref, function() {
        resolve(GCanvas.getContext('2d'));
      });
    });
  };

  static reset = () => {
    GCanvas.disable();
  };

  constructor(weexElement) {
    const instance = new String();
    instance.weexElement = weexElement;

    Object.defineProperties(instance, {
      currentStyle: {
        get: () => {
          return Object.assign({}, weexElement.classStyle, weexElement.style);
        }
      },
      offsetWidth: {
        get: () => {
          const canvasWidth = parseFloat(weexElement.classStyle.width || weexElement.style.width);
          return canvasWidth;
        }
      },
      offsetHeight: {
        get: () => {
          return parseFloat(weexElement.classStyle.height || weexElement.style.height);
        }
      }
    });

    instance.getContext = () => {
      return GCanvas.getContext('2d');
    };

    return instance;
  }
}

export default CanvasWeex;
