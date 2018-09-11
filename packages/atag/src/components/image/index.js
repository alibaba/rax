/**
 * ref https://github.com/RevillWeb/img-2
 * MIT
 */
export default class ImageElement extends HTMLElement {
  static get is() {
    return 'a-image';
  }

  constructor() {
    super();

    // Private class variables
    this._root = null;
    this._$img = null;
    this._$preview = null;
    this._preview = null;
    this._src = null;
    this._width = null;
    this._height = null;
    this._reset();

    // Settings
    this._renderOnPreCached = ImageElement.settings.RENDER_ON_PRECACHED;

    // Bound class methods
    this._precache = this._precache.bind(this);
    this._onImgLoad = this._onImgLoad.bind(this);
    this._onImgPreCached = this._onImgPreCached.bind(this);
  }

  get loaded() {
    return this._loaded;
  }

  /**
   * Reset all private values
   * @private
   */
  _reset() {
    if (this._loaded === true) this.removeAttribute('loaded');
    this._inited = false;
    this._rendered = false;
    this._loading = false;
    this._loaded = false;
    this._preCaching = false;
    this._preCached = false;
  }

  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
    // Override any global settings
    this._renderOnPreCached =
      this.getAttribute('render-on-pre-cached') === 'true';
    this._init();
  }

  _init() {
    // Check to see if we have a src, if not return and do nothing else
    this._src = this.getAttribute('src');
    // Grab the initial attribute values
    this._preview = this.getAttribute('src-preview');
    this._width = this.getAttribute('width');
    this._height = this.getAttribute('height');

    if (!this._src) return;

    // Set the height and width of the element so that we can figure out if it is on the screen or not
    if (this.hasAttribute('width')) {
      this.style.width = `${this._width}px`;
    }
    if (this.hasAttribute('height')) {
      this.style.height = `${this._height}px`;
    }
    this._width = parseFloat(this.style.width);
    this._height = parseFloat(this.style.height);

    // Figure out if this image is within view
    ImageElement.addIntersectListener(this, () => {
      ImageElement._removePreCacheListener(this._precache);
      this._render();
      this._load();
      ImageElement.removeIntersectListener(this);
    });

    // Listen for precache instruction
    ImageElement._addPreCacheListener(this._precache, this._src);
    this._inited = true;
  }

  /**
   * Method which displays the image once ready to be displayed
   * @private
   */
  _load() {
    if (this._preCached === false) ImageElement._priorityCount += 1;
    this._$img.onload = this._onImgLoad;
    this._loading = true;
    this._$img.src = this._src;
    this._$img.style.opacity = 1;
  }

  _onImgLoad(evt) {
    this._loading = false;
    this._loaded = true;

    /**
     * Synchronize the height of the inside and outside image
     */
    if (parseInt(this.style.height) !== evt.target.height) {
      this.style.height = evt.target.height + 'px';
    }
    if (parseInt(this.style.width) !== evt.target.width) {
      this.style.width = evt.target.width + 'px';
    }

    if (this._$preview !== null) {
      this._root.removeChild(this._$preview);
      this._$preview = null;
    }
    this._$img.onload = null;
    if (this._preCached === false) ImageElement._priorityCount -= 1;
    this.setAttribute('loaded', '');
  }

  _onImgPreCached() {
    this._preCaching = false;
    this._preCached = true;
    if (this._renderOnPreCached !== false) {
      this._render();
      this._load();
    }
  }

  static get observedAttributes() {
    return ['src', 'width', 'height', 'alt'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // If nothing has changed then just return
    if (newValue === oldValue) return;

    switch (name) {
      case 'src':
        // If the src is changed then we need to reset and start again
        this._reset();
        this._init();
        break;
      case 'width':
        this._width = newValue;
        if (this._$preview !== null) this._$preview.width = this._width;
        if (this._$img !== null) this._$img.width = this._width;
        this.style.width = `${this._width}px`;
        if (!this._inited) this._init();
        break;
      case 'height':
        this._height = newValue;
        if (this._$preview !== null) this._$preview.height = this._height;
        if (this._$img !== null) this._$img.height = this._height;
        this.style.height = `${this._height}px`;
        if (!this._inited) this._init();
        break;
      case 'render-on-pre-cached':
        this._renderOnPreCached = !(newValue === 'false');
        break;
      case 'alt':
        this._updateAttribute('alt', newValue);
        break;
    }
  }

  /**
   * Method used to update an individual attribute on the native image element
   * @param {string} name - The name of the attribute to update
   * @param {string} value - The new attribute value
   * @private
   */
  _updateAttribute(name, value) {
    // If the image element hasn't been rendered yet, just return.
    if (this._rendered === false) return;
    this._$img.setAttribute(name, value);
  }

  /**
   * Method which renders the DOM elements and displays any preview image
   * @private
   */
  _render() {
    if (this._rendered === true) return;

    // Render the Shadow Root if not done already (src change can force this method to be called again)
    if (this._root === null) {
      // Attach the Shadow Root to the element
      this._root = this.attachShadow({ mode: 'open' });
      // Create the initial template with styles
      let $template = document.createElement('template');
      $template.innerHTML = `
            <style>
              :host {
                position: relative;
                overflow: hidden;
                display: inline-block;
                outline: none;
              }
              img {
                position: absolute;
                left: 0;
                top: 0;
              }
              img.image-src {
                z-index: 1;
                opacity: 0;
              }
              img.image-preview {
                z-index: 2;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
              }
              :host([loaded]) img.image-src {
                opacity: 1;
              }
            </style>
          `;
      if (window.ShadyCSS) {
        window.ShadyCSS.prepareTemplate($template, 'a-image');
      }
      this._root.appendChild(document.importNode($template.content, true));
    }

    // If a preview image has been specified
    if (
      this._$preview === null &&
      this._preview !== null &&
      this._loaded === false
    ) {
      // Create the element
      this._$preview = document.createElement('img');
      this._$preview.classList.add('image-preview');
      this._$preview.src = this._preview;
      // Add the specified width and height
      if (this._width) {
        this._$preview.width = this._width;
      }
      if (this._height) {
        this._$preview.height = this._height;
      }
      // Add it to the Shadow Root
      this._root.appendChild(this._$preview);
    }

    // Render the img element if not done already
    if (this._$img === null) {
      // Create the actual image element to be used to display the image
      this._$img = document.createElement('img');
      this._$img.classList.add('image-src');
      // add the specified width and height to the image element
      if (this._width) {
        this._$img.width = this._width;
      }
      if (this._height) {
        this._$img.height = this._height;
      }
      const alt = this.getAttribute('alt');
      if (alt !== null) this._$img.setAttribute('alt', alt);
      // Add the image to the Shadow Root
      this._root.appendChild(this._$img);
    }

    // Flag as rendered
    this._rendered = true;
  }

  _precache() {
    this._preCaching = true;
    ImageElement._preCache(this._src, this._onImgPreCached);
  }

  static _preCacheListeners = new Map();
  static _addPreCacheListener(cb, url) {
    ImageElement._preCacheListeners.set(cb, url);
  }

  static _removePreCacheListener(cb) {
    ImageElement._preCacheListeners.delete(cb);
  }

  static _startPreCache() {
    for (let cb of ImageElement._preCacheListeners.keys()) cb();
  }

  /**
   * Methods used to determine when currently visible (priority) elements have finished download to then inform other elements to pre-cache
   */

  static __priorityCount = 0;
  static _startPreCacheDebounce = null;
  static get _priorityCount() {
    return ImageElement.__priorityCount;
  }
  static set _priorityCount(value) {
    ImageElement.__priorityCount = value;
    if (ImageElement.__priorityCount < 1) {
      // Inform components that they can start to pre-cache their images
      // Debounce in case the user scrolls because then there will be more priority images
      if (ImageElement._startPreCacheDebounce !== null) {
        clearTimeout(ImageElement._startPreCacheDebounce);
        ImageElement._startPreCacheDebounce = null;
      }
      ImageElement._startPreCacheDebounce = setTimeout(function() {
        if (ImageElement.__priorityCount < 1) ImageElement._startPreCache();
      }, 500);
    }
  }

  /**
   * Methods used to determine when this element is in the visible viewport
   */
  static _intersectListeners = new Map();
  static _observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: '0px',
    threshold: 0
  });

  static addIntersectListener($element, intersectCallback) {
    ImageElement._intersectListeners.set($element, intersectCallback);
    ImageElement._observer.observe($element);
  }

  static removeIntersectListener($element) {
    if ($element) ImageElement._observer.unobserve($element);
  }

  static _preCacheCallbacks = {};
  static _preCache(url, cb) {
    let slot = ImageElement._preCacheCallbacks[url];
    if (slot === undefined) {
      ImageElement._preCacheCallbacks[url] = {
        cached: false,
        cbs: [cb]
      };
      const absolute = url.indexOf('http') === 0 || url.indexOf('/') === 0;
      const location = absolute ? url : window.location.href + url;
      ImageElement._worker.postMessage({ location: location, url: url });
    } else {
      if (slot.cached === true) {
        cb();
      } else {
        slot.cbs.push(cb);
      }
    }
  }

  static settings = {
    // Set this to false to save memory but can cause jank during scrolling
    RENDER_ON_PRECACHED: false
  };
}

/**
 * setup worker to pre-cache images
 */
ImageElement._worker = new Worker(
  window.URL.createObjectURL(
    new Blob(
      [
        `self.onmessage=${function(e) {
          const xhr = new XMLHttpRequest();
          function onload() {
            self.postMessage(e.data.url);
          }
          xhr.responseType = 'blob';
          xhr.onload = xhr.onerror = onload;
          xhr.open('GET', resolveURL(e.data.location), true); // eslint-disable-line
          xhr.send();
        }.toString()};`,
        `var HTTP_REG = /^http/;
        function resolveURL(path) {
          if (HTTP_REG.test(path)) {
            return path;
          } else if (path[0] === '/') {
            return location.origin + path;
          } else {
            return location.origin + location.pathname + path;
          }
        }`
      ],
      { type: 'text/javascript' }
    )
  )
);

ImageElement._worker.onmessage = function(e) {
  const slot = ImageElement._preCacheCallbacks[e.data];
  if (slot !== undefined) {
    slot.cached = true;
    slot.cbs = slot.cbs.filter(cb => {
      // Call the callback
      cb();
      // Remove the callback
      return false;
    });
  }
};

function handleIntersect(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting === true) {
      const cb = ImageElement._intersectListeners.get(entry.target);
      if (cb !== undefined) cb(entry);
    }
  });
}


customElements.define(ImageElement.is, ImageElement);
