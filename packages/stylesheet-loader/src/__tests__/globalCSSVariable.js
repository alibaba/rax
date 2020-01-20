'use strict';

import globalCSSVariable from '../globalCSSVariable';

describe('globalCSSVariable', () => {
  const mockStyleString = `let __globalObject = typeof window === 'object' ? window : typeof global === 'object' ? global : {};
    if (typeof __globalObject === "object") { 
      __globalObject.__RootCSSVariable = __globalObject.__RootCSSVariable || {};__globalObject.__RootCSSVariable["colorName"] = "rgb(0,0,255)";}
    function __getValue(name){
      return (typeof __globalObject.__RootCSSVariable === "object") 
        ? window.__RootCSSVariable[name] 
        : "";
    }
  `;

  it('should be initialized in the runtime inline style', () => {
    const styleString = globalCSSVariable({
      __CSSVariables: {
        colorName: 'hsl(240, 100%, 50%)'
      },
      text1: {
        color: 'var(colorName)'
      }
    });

    expect(styleString).toEqual(mockStyleString);
  });
});
