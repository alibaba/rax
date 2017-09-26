function makeMap(str) {
  const map = {};
  str.split(',').forEach(key => {
    map[key] = true;
  });
  return map;
}

// properties that must use property `node[propKey] = propValue`
const MUST_USE_PROPERTY = makeMap(
  'checked,multiple,muted,selected,value'
);
// if propValue is falsy, not add to node
const BOOLEAN_PROPERTY = makeMap(
  'allowFullScreen,async,autoFocus,autoPlay,capture,checked,controls,' +
  'default,defer,disabled,formNoValidate,hidden,loop,multiple,muted,' +
  'noValidate,open,playsInline,readOnly,required,reversed,scoped,' +
  'seamless,selected,itemScope,size'
);
// if propValue is not equal `false`, not add to node
const STRICT_BOOLEAN_PROPERTY = makeMap('download');
// if propValue is not type of number or cannot convert to number,
// not add to node
const NUMERIC_PROPERTY = makeMap('rows,rawSpan,start');
// all white list properties
const PROPERTY = Object.assign(
  {},
  MUST_USE_PROPERTY,
  BOOLEAN_PROPERTY,
  STRICT_BOOLEAN_PROPERTY,
  NUMERIC_PROPERTY,
  makeMap(
    'style,acceptCharset,className,htmlFor,httpEquiv,autoComplete,' +
    'allowTransparency,contentEditable,draggable,spellCheck,autoCapitalize,' +
    'autoCorrect,autoSave'
  )
);

// map special attribute names
const attributeNamesMap = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
};

// reserved props should not be set
const RESERVED_PROPS = {
  children: true,
  dangerouslysetinnerhtml: true,
  autofocus: true,
  defaultvalue: true,
  defaultchecked: true,
  innerhtml: true,
  suppresscontenteditablewarning: true,
  onfocusin: true,
  onfocusout: true,
  style: true,
};

export function isReservedProp(propKey) {
  return !!RESERVED_PROPS[String(propKey).toLowerCase()];
}

export function normalizeAttributeName(propKey) {
  const lowerCasedPropKey = propKey.toLowerCase();
  return attributeNamesMap.hasOwnProperty(propKey) ? attributeNamesMap[propKey] : lowerCasedPropKey;
}

export function normalizePropertyName(propKey) {
  return propKey;
}

export function isAcceptableAttribute(propKey) {
  if (PROPERTY.hasOwnProperty(propKey)) {
    return true;
  } else {
    return false;
  }
}

export function isBooleanProperty(propKey) {
  if (BOOLEAN_PROPERTY.hasOwnProperty(propKey)) {
    return true;
  }
  return false;
}

export function isStrictBooleanProperty(propKey) {
  if (STRICT_BOOLEAN_PROPERTY.hasOwnProperty(propKey)) {
    return true;
  }
  return false;
}

export function isNumbericProperty(propKey) {
  if (NUMERIC_PROPERTY.hasOwnProperty(propKey)) {
    return true;
  }
  return false;
}

export function mustUseProperty(propKey) {
  if (MUST_USE_PROPERTY.hasOwnProperty(propKey)) {
    return true;
  }
  return false;
}
