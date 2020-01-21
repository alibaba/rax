'use strict';

import loader from '../index';
import globalCSSVariable from '../globalCSSVariable';

jest.mock('loader-utils', () => {
  return {
    getOptions: () => {
      return {
        theme: true,
      };
    }
  };
});

const mockStyleHeaderString = `let __globalObject = typeof window === 'object' ? window : typeof global === 'object' ? global : {};
  if (typeof __globalObject === "object") {
    __globalObject.__RootCSSVariable = __globalObject.__RootCSSVariable || {};__globalObject.__RootCSSVariable["colorName"] = "rgb(0,0,255)";}
  function __getValue(name){
    return (typeof __globalObject.__RootCSSVariable === "object")
      ? window.__RootCSSVariable[name]
      : "";
  }
  `;

const mockStyleString = `let __globalObject = typeof window === 'object' ? window : typeof global === 'object' ? global : {};
  if (typeof __globalObject === "object") {
    __globalObject.__RootCSSVariable = __globalObject.__RootCSSVariable || {};__globalObject.__RootCSSVariable["colorName"] = "blue";}
  function __getValue(name){
    return (typeof __globalObject.__RootCSSVariable === "object")
      ? window.__RootCSSVariable[name]
      : "";
  }
  
  var _styles = {
  "__CSSVariables": {
    "colorName": "blue"
  },
  "text1": {
    get color(){return __getValue("colorName")}
  }
};
  
  
  
  module.exports = _styles;
  `;

describe('globalCSSVariable', () => {
  it('shoule build code to create writes and reads to runtime global css variables', () => {
    const styleString = ':root { --color-name: blue; }.text1 { color: var(--color-name); }';
    const createdString = loader(styleString);

    expect(createdString).toEqual(mockStyleString);
  });

  it('should be initialized in the runtime inline style', () => {
    const styleString = globalCSSVariable({
      globalCSSVarName: '__CSSVariables',
      styles: {
        __CSSVariables: {
          colorName: 'hsl(240, 100%, 50%)'
        },
        text1: {
          color: 'var(colorName)'
        }
      }
    });

    expect(styleString).toEqual(mockStyleHeaderString);
  });
});
