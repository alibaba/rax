'use strict';

import globalCSSVariable from '../globalCSSVariable';

describe('globalCSSVariable', () => {
  const mockStyleString = `let globalObject = typeof window === 'object' ? window : typeof global === 'object' ? global : {};
    if (typeof globalObject === "object") { 
      globalObject.__RootCSSVariable = globalObject.__RootCSSVariable || {};globalObject.__RootCSSVariable["colorName"] = "rgb(0,0,255)";}
    function _getvar(name){
      return (typeof globalObject.__RootCSSVariable === "object") 
        ? window.__RootCSSVariable[name] 
        : "";
    }
  `;

  it('should be initialized in the runtime inline style', () => {
    const styleString = globalCSSVariable({
      __CSSVariable: {
        colorName: 'hsl(240, 100%, 50%)'
      },
      text1: {
        color: 'var(colorName)'
      }
    });

    expect(styleString).toEqual(mockStyleString);
  });
});
