// A simple string attribute.
// Attributes that aren't in the whitelist are presumed to have this type.
export const STRING = 1;

// A string attribute that accepts booleans in Rax. In HTML, these are called
// "enumerated" attributes with "true" and "false" as possible values.
// When true, it should be set to a "true" string.
// When false, it should be set to a "false" string.
export const BOOLEANISH_STRING = 2;

// A real boolean attribute.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.
export const BOOLEAN = 3;

// An attribute that can be used as a flag as well as with a value.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.
// For any other value, should be present with that value.
export const OVERLOADED_BOOLEAN = 4;

// An attribute that must be numeric or parse as a numeric.
// When falsy, it should be removed.
export const NUMERIC = 5;

// An attribute that must be positive numeric or parse as a positive numeric.
// When falsy, it should be removed.
export const POSITIVE_NUMERIC = 6;

const properties = {};

export function getPropertyInfo(prop) {
  return properties[prop];
}

export function shouldRemoveAttribute(prop, value) {
  const propertyInfo = getPropertyInfo(prop);
  const propType = propertyInfo ? propertyInfo.type : null;
  const valueType = typeof value;

  if (value === null || valueType === 'undefined') {
    return true;
  }

  switch (valueType) {
    case 'function':
    case 'symbol':
      return true;
  }

  if (propType !== null) {
    switch (propType) {
      case BOOLEAN:
        return !value;
      case OVERLOADED_BOOLEAN:
        return value === false;
      case NUMERIC:
        return isNaN(value);
      case POSITIVE_NUMERIC:
        return isNaN(value) || value < 1;
    }
  }

  return false;
}

[
  'contentEditable',
  'draggable',
  'spellCheck',
  'value'
].forEach((name) => {
  properties[name] = {
    type: BOOLEANISH_STRING
  };
});

[
  'allowFullScreen',
  'async',
  'autoFocus',
  'autoPlay',
  'controls',
  'default',
  'defer',
  'disabled',
  'disablePictureInPicture',
  'formNoValidate',
  'hidden',
  'loop',
  'noModule',
  'noValidate',
  'open',
  'playsInline',
  'readOnly',
  'required',
  'reversed',
  'scoped',
  'seamless',
  'itemScope',
  'checked',
  'multiple',
  'muted',
  'selected',
].forEach((name) => {
  properties[name] = {
    type: BOOLEAN
  };
});

[
  'capture',
  'download'
].forEach((name) => {
  properties[name] = {
    type: OVERLOADED_BOOLEAN
  };
});

[
  'cols',
  'rows',
  'size',
  'span',
].forEach((name) => {
  properties[name] = {
    type: POSITIVE_NUMERIC
  };
});
