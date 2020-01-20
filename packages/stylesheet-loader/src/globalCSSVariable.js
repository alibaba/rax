import normalizeColor from './normalizeColor';

const GROBAL_CSS_VAR = '__CSSVariable';

export default function getGlobalCSSVariable(styles) {
  let globalCSSVariable = `let __globalObject = typeof window === 'object' ? window : typeof global === 'object' ? global : {};
    if (typeof __globalObject === "object") { 
      __globalObject.__RootCSSVariable = __globalObject.__RootCSSVariable || {};`;
  for (let key in styles) {
    if (key === GROBAL_CSS_VAR && typeof styles[key] === 'object') {
      for (let name in styles[key]) {
        globalCSSVariable += '__globalObject.__RootCSSVariable["' + name + '"] = "' + normalizeColor(styles[key][name]) + '";';
      }
    }
  }
  globalCSSVariable += `}
    function __getValue(name){
      return (typeof __globalObject.__RootCSSVariable === "object") 
        ? window.__RootCSSVariable[name] 
        : "";
    }
  `;
  return globalCSSVariable;
};