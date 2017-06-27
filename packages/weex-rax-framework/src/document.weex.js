import EventEmitter from './emitter';

const DOM_MODULE = '@weex-module/dom';
const VISIBLE = 'visible';
const HIDDEN = 'hidden';
const VISIBILITY_CHANGE_EVENT = 'visibilitychange';

function addBodyAppearListener(document) {
  document.body.addEvent('viewappear', function(e) {
    document.visibilityState = VISIBLE;
    e.type = VISIBILITY_CHANGE_EVENT;
    document.dispatchEvent(e);
  });

  document.body.addEvent('viewdisappear', function(e) {
    document.visibilityState = HIDDEN;
    e.type = VISIBILITY_CHANGE_EVENT;
    document.dispatchEvent(e);
  });
}

function removeBodyAppearListener(document) {
  if (document.body) {
    document.body.removeEvent('viewappear');
    document.body.removeEvent('viewdisappear');
  }
}

module.exports = function(__weex_require__, document) {
  // Add w3c events
  const documentEmitter = new EventEmitter();
  let hasVisibilityEventPending = false;

  // Weex freezed the document maybe throw error
  try {
    document.addEventListener = (type, listener) => {
      if (type === VISIBILITY_CHANGE_EVENT) {
        if (document.body) {
          addBodyAppearListener(document);
        } else {
          hasVisibilityEventPending = true;
        }
      }
      documentEmitter.on(type, listener);
    };

    document.removeEventListener = (type, listener) => {
      if (type === VISIBILITY_CHANGE_EVENT) {
        removeBodyAppearListener(document);
      }
      documentEmitter.off(type, listener);
    };

    document.dispatchEvent = (e) => {
      documentEmitter.emit(e.type, e);
    };

    // FontFace
    document.fonts = {
      add: function(fontFace) {
        var domModule = __weex_require__(DOM_MODULE);
        domModule.addRule('fontFace', {
          fontFamily: fontFace.family,
          src: fontFace.source // url('uri') : single quotes are required around uri, and double quotes can not work in weex
        });
      }
    };

    // Init visibility state
    document.visibilityState = VISIBLE;

    // Hijack the origin createBody
    const originCreateBody = document.createBody;

    Object.defineProperty(document, 'createBody', {
      value: function() {
        var body = originCreateBody.apply(document, arguments);

        if (hasVisibilityEventPending) {
          addBodyAppearListener(document);
        }
        return body;
      }
    });
  } catch (e) {
    console.log(e);
  }

  return document;
};
