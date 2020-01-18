import normalizeColor from './normalizeColor';

const GROBAL_CSS_VAR = '__CSSVariable';

export default function getGlobalCSSVariable(styles) {
  let globalCSSVariable = `let globalObject = typeof window === 'object' ? window : typeof global === 'object' ? global : {};
    if (typeof globalObject === "object") { 
      globalObject.__RootCSSVariable = globalObject.__RootCSSVariable || {};`;
  for (let key in styles) {
    if (key === GROBAL_CSS_VAR && typeof styles[key] === 'object') {
      for (let name in styles[key]) {
        globalCSSVariable += 'globalObject.__RootCSSVariable["' + name + '"] = "' + normalizeColor(styles[key][name]) + '";';
      }
    }
  }
  globalCSSVariable += `}
    function _getvar(name){
      return (typeof globalObject.__RootCSSVariable === "object") 
        ? window.__RootCSSVariable[name] 
        : "";
    }
  `;
  return globalCSSVariable;
};