/**
 * Driver for Web DOM
 **/
import { setViewportWidth, setUnitPrecision } from 'style-unit';
import getDriver from './getDriver';

const {
  setTagNamePrefix,
  createBody,
  createEmpty,
  createText,
  updateText,
  createElement,
  appendChild,
  removeChild,
  replaceChild,
  insertAfter,
  insertBefore,
  addEventListener,
  removeEventListener,
  removeAttribute,
  setAttribute,
  setStyle,
  beforeRender,
  afterRender,
  removeChildren
} = getDriver(document);

export {
  setTagNamePrefix,
  createBody,
  createEmpty,
  createText,
  updateText,
  createElement,
  appendChild,
  removeChild,
  replaceChild,
  insertAfter,
  insertBefore,
  addEventListener,
  removeEventListener,
  removeAttribute,
  setAttribute,
  setStyle,
  beforeRender,
  afterRender,
  removeChildren
};

export {
  /**
   * Set viewport width.
   * @param viewport {Number} Viewport width, default to 750.
  */
  setViewportWidth,
  /**
   * Set unit precision.
   * @param n {Number} Unit precision, default to 4.
   */
  setUnitPrecision,
  /**
   * Get driver with document passed
   */
  getDriver
};
