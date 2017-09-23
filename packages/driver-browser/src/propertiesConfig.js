const MUST_USE_ATTRIBUTE = 0x1;
const MUST_USE_PROPERTY = 0x2;
const HAS_SIDE_EFFECTS = 0x4;
const HAS_BOOLEAN_VALUE = 0x8;
const HAS_NUMERIC_VALUE = 0x10;
const HAS_POSITIVE_NUMERIC_VALUE = 0x20 | 0x10;
const HAS_OVERLOADED_BOOLEAN_VALUE = 0x40;

const PROPERTY_WHITE_LIST = {
  properties: {
    allowFullScreen: HAS_BOOLEAN_VALUE,
    // specifies target context for links with `preload` type
    async: HAS_BOOLEAN_VALUE,
    // autoFocus is polyfilled/normalized by AutoFocusUtils
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: HAS_BOOLEAN_VALUE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    cols: HAS_POSITIVE_NUMERIC_VALUE,
    controls: HAS_BOOLEAN_VALUE,
    default: HAS_BOOLEAN_VALUE,
    defer: HAS_BOOLEAN_VALUE,
    disabled: HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    hidden: HAS_BOOLEAN_VALUE,
    loop: HAS_BOOLEAN_VALUE,
    // Caution; `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`.
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    playsInline: HAS_BOOLEAN_VALUE,
    readOnly: HAS_BOOLEAN_VALUE,
    required: HAS_BOOLEAN_VALUE,
    reversed: HAS_BOOLEAN_VALUE,
    rows: HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: HAS_NUMERIC_VALUE,
    scoped: HAS_BOOLEAN_VALUE,
    seamless: HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    size: HAS_POSITIVE_NUMERIC_VALUE,
    start: HAS_NUMERIC_VALUE,
    // support for projecting regular DOM Elements via V1 named slots ( shadow dom )
    span: HAS_POSITIVE_NUMERIC_VALUE,
    // Style must be explicitly set in the attribute list. React components
    // expect a style object
    style: 0,
    // itemScope is for for Microdata support.
    // See http://schema.org/docs/gs.html
    itemScope: HAS_BOOLEAN_VALUE,
    // These attributes must stay in the white-list because they have
    // different attribute names (see DOMAttributeNames below)
    acceptCharset: 0,
    className: 0,
    htmlFor: 0,
    httpEquiv: 0,
    // Attributes with mutation methods must be specified in the whitelist
    value: MUST_USE_PROPERTY,
    // The following attributes expect boolean values. They must be in
    // the whitelist to allow boolean attribute assignment:
    autoComplete: 0,
    // IE only true/false iFrame attribute
    // https://msdn.microsoft.com/en-us/library/ms533072(v=vs.85).aspx
    allowTransparency: 0,
    contentEditable: 0,
    draggable: 0,
    spellCheck: 0,
    // autoCapitalize and autoCorrect are supported in Mobile Safari for
    // keyboard hints.
    autoCapitalize: 0,
    autoCorrect: 0,
    // autoSave allows WebKit/Blink to persist values of input fields on page reloads
    autoSave: 0,
  },
  attributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
  }
};

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

function shouldSetNullValue(propertyName, value) {
  const { properties } = PROPERTY_WHITE_LIST;
  return (
    value == null ||
    ((properties[propertyName] & HAS_BOOLEAN_VALUE) && !value) ||
    ((properties[propertyName] & HAS_NUMERIC_VALUE) && isNaN(value)) ||
    ((properties[propertyName] & HAS_POSITIVE_NUMERIC_VALUE) && value < 1) ||
    ((properties[propertyName] & HAS_OVERLOADED_BOOLEAN_VALUE) && value === false)
  );
}

function isReserved(propKey) {
  return !!RESERVED_PROPS[String(propKey).toLowerCase()];
}

function getPropertyDetail(propKey) {
  const { properties, attributeNames } = PROPERTY_WHITE_LIST;
  if (typeof propKey !== 'string' || !propKey in properties) {
    return null;
  } else {
    const propertyConfig = properties[propKey];
    const lowerCasedPropKey = propKey.toLowerCase();
    return {
      isReserved: isReserved(propKey),
      hasBooleanValue: !!(propertyConfig & HAS_BOOLEAN_VALUE),
      hasNumericValue: !!(propertyConfig & HAS_NUMERIC_VALUE),
      hasPositiveNumericValue: !!(propertyConfig & HAS_POSITIVE_NUMERIC_VALUE),
      hasOverloadedBooleanValue: !!(propertyConfig & HAS_OVERLOADED_BOOLEAN_VALUE),
      mustUseProperty: !!(propertyConfig & MUST_USE_PROPERTY),
      mustUseAttribute: !!(propertyConfig & MUST_USE_ATTRIBUTE),
      hasSideEffects: !!(propertyConfig & HAS_SIDE_EFFECTS),

      attributeName: attributeNames.hasOwnProperty(propKey) ? attributeNames[propKey] : lowerCasedPropKey,
      propertyName: propKey,
    };
  }
}

export {
  PROPERTY_WHITE_LIST,
  isReserved,
  shouldSetNullValue,
  getPropertyDetail,
};
