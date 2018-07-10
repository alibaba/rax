const { makeMap } = require('../../shared/utils');

const isPreTag = tag => tag === 'pre';
exports.isPreTag = isPreTag;

const isReservedTag = makeMap(
  'template,script,style,element,content,slot,link,meta,svg,view,' +
    'a,div,img,image,text,span,richtext,input,switch,textarea,spinner,select,' +
    'slider,slider-neighbor,indicator,trisition,trisition-group,canvas,' +
    'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
    'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown',
  true
);
exports.isReservedTag = isReservedTag;

exports.isReservedTagName = makeMap(
  `switch,const,export,import,break,case,catch,continue,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,debugger,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,`
);
// these are reserved for web because they are directly compiled away
// during template compilation
const isReservedAttr = makeMap('style,class');
exports.isReservedAttr = isReservedAttr;

// Elements that you can, intentionally, leave open (and which close themselves)
// more flexable than web
const canBeLeftOpenTag = makeMap(
  'web,spinner,switch,video,textarea,canvas,' + 'indicator,marquee,countdown',
  true
);
exports.canBeLeftOpenTag = canBeLeftOpenTag;

const isUnaryTag = makeMap('embed,img,image,input,link,meta', true);
exports.isUnaryTag = isUnaryTag;

exports.mustUseProp = mustUseProp;
function mustUseProp() {
  /* console.log('mustUseProp') */
}

exports.getTagNamespace = getTagNamespace;
function getTagNamespace() {
  /* console.log('getTagNamespace') */
}

exports.isUnknownElement = isUnknownElement;
function isUnknownElement() {
  /* console.log('isUnknownElement') */
}

exports.query = query;
function query(el, document) {
  // renderer is injected by weex factory wrapper
  const placeholder = new renderer.Comment('root');
  placeholder.hasAttribute = placeholder.removeAttribute = function() {}; // hack for patch
  document.documentElement.appendChild(placeholder);
  return placeholder;
}

exports.getComKey = getComKey;
function getComKey(vm) {
  return vm && vm.$attrs ? vm.$attrs['mpcomid'] : '0';
}

// 用于小程序的 event type 到 web 的 event
const eventTypeMap = {
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
exports.eventTypeMap = eventTypeMap;

exports.traverseASTNode = function traverseASTNode(ast, fn) {
  if (Array.isArray(ast.children)) {
    ast.children.forEach(child => {
      traverseASTNode(child, fn);
    });
  }
  fn(ast);
};
