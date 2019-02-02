/**
* Make a map and return a function for checking if a key
* is in that map.
*/
const makeMap = exports.makeMap = function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
};

/**
 * Mix properties into target object.
 */
const extend = exports.extend = function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
};

const isPreTag = exports.isPreTag = tag => tag === 'pre';

const isReservedTag = exports.isReservedTag = makeMap(
  'template,script,style,element,content,slot,link,meta,svg,view,' +
  'a,div,img,image,text,span,richtext,input,switch,textarea,spinner,select,' +
  'slider,slider-neighbor,indicator,trisition,trisition-group,canvas,' +
  'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
  'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown',
  true
);

exports.isReservedTagName = makeMap(
  'switch,const,export,import,break,case,catch,continue,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,debugger,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,'
);
// these are reserved for web because they are directly compiled away
// during template compilation
const isReservedAttr = exports.isReservedAttr = makeMap('style,class');

// Elements that you can, intentionally, leave open (and which close themselves)
// more flexable than web
const canBeLeftOpenTag = exports.canBeLeftOpenTag = makeMap(
  'web,spinner,switch,video,textarea,canvas,' + 'indicator,marquee,countdown',
  true
);

const isUnaryTag = exports.isUnaryTag = makeMap('embed,img,image,input,link,meta', true);

exports.mustUseProp = function mustUseProp() {
  /* console.log('mustUseProp') */
};

exports.getTagNamespace = function getTagNamespace() {
  /* console.log('getTagNamespace') */
};

exports.isUnknownElement = function isUnknownElement() {
  /* console.log('isUnknownElement') */
};

exports.getComKey = function getComKey(vm) {
  return vm && vm.$attrs ? vm.$attrs.mpcomid : '0';
};

// 用于小程序的 event type 到 web 的 event
const eventTypeMap = exports.eventTypeMap = {
  tap: ['tap', 'click'],
  touchstart: ['touchstart'],
  touchmove: ['touchmove'],
  touchcancel: ['touchcancel'],
  touchend: ['touchend'],
  longtap: ['longtap'],
  input: ['input'],
  blur: ['change', 'blur'],
  submit: ['submit'],
  focus: ['focus'],
  scrolltoupper: ['scrolltoupper'],
  scrolltolower: ['scrolltolower'],
  scroll: ['scroll']
};

exports.traverseASTNode = function traverseASTNode(ast, fn) {
  if (Array.isArray(ast.children)) {
    ast.children.forEach(child => {
      traverseASTNode(child, fn);
    });
  }
  fn(ast);
};

exports.objectValues = function objectValues(arr) {
  return typeof Object.values === 'function' ? Object.values(arr) : Object.keys(arr).map((k) => arr[k]);
};

/**
 * Always return false.
 */
exports.no = function no() {
  return false;
};

/**
 * Merge an Array of Objects into a single Object.
 */
exports.toObject = function toObject(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};


/**
 * Create a cached version of a pure function.
 */
const cached = exports.cached = function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
const camelize = exports.camelize = cached(function(str) {
  return str.replace(camelizeRE, function(_, c) {
    return c ? c.toUpperCase() : '';
  });
});

const colors = require('colors');
/**
 *  Warn
 */
exports.warn = function warn(msg) {
  return console.warn(colors.yellow('[WARN]'), msg);
};

/**
 * no op
 */
exports.noop = function noop() { };

/**
 * Generate a static keys string from compiler modules.
 */
exports.genStaticKeys = function genStaticKeys(modules) {
  return modules
    .reduce((keys, m) => {
      return keys.concat(m.staticKeys || []);
    }, [])
    .join(',');
};


// global id and object that prevered
exports.isPreveredIdentifier = makeMap('true,false,null,undefined');
exports.isPreveredGlobalObject = makeMap(
  'Object,Array,String,Number,Symbol,Function,RegExp,' +
  'Math,Date,JSON,console,' +
  'Proxy,Promise,Reflect,Set,Map,ArrayBuffer' +
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
);

const sfcModuleDeclarationName = exports.sfcModuleDeclarationName = '__sfc_module_declaration__';
const globalComponentsRefName = exports.globalComponentsRefName = '__components_ref__';
const componentDifinitionName = exports.componentDifinitionName = '__difinition__';
const renderHelperName = exports.renderHelperName = '__render_helpers__';
const styleObjectName = exports.styleObjectName = '__styles__';
const renderHelpers = exports.renderHelpers = '_c,_cx,_e,_s,_l,_t,_m,_v,_u';
exports.isRenderHelperFns = makeMap(renderHelpers);
exports.isSFCInternalIdentifier = makeMap([
  sfcModuleDeclarationName,
  globalComponentsRefName,
  componentDifinitionName,
  styleObjectName,
  renderHelperName
].join(','));

/**
 * check whether string is a valid identifer in JS
 * @param id name
 * @returns {boolean} isValid
 */
exports.isValidIdentifier = function(id) {
  return !/^\ws[~`!@#$%^&*()]/.test(id);
};
