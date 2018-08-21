exports.genComponentModel = genComponentModel;
/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel(el, value, modifiers) {
  const { number, trim } = modifiers || {};

  const baseValueExpression = '$$v';
  let valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
      `? ${baseValueExpression}.trim()` +
      `: ${baseValueExpression})`;
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`;
  }
  const assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: `(${value})`,
    expression: `"${value}"`,
    callback: `function (${baseValueExpression}) {${assignment}}`
  };
}

exports.genAssignmentCode = genAssignmentCode;
/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode(value, assignment) {
  const modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return `${value}=${assignment}`;
  } else {
    return `$set(${modelRs.exp}, ${modelRs.idx}, ${assignment})`;
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

let len, str, chr, index, expressionPos, expressionEndPos;

exports.parseModel = parseModel;
function parseModel(val) {
  str = val;
  len = str.length;
  index = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    };
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5b) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  };
}

function next() {
  return str.charCodeAt(++index);
}

function eof() {
  return index >= len;
}

function isStringStart(chr) {
  return chr === 0x22 || chr === 0x27;
}

function parseBracket(chr) {
  let inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue;
    }
    if (chr === 0x5b) inBracket++;
    if (chr === 0x5d) inBracket--;
    if (inBracket === 0) {
      expressionEndPos = index;
      break;
    }
  }
}

function parseString(chr) {
  const stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break;
    }
  }
}
