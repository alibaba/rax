const css = require('css');
const camelCase = require('camelcase');

const RULE = 'rule';

var sanitizeSelector = function(selector) {
  return selector.replace(/\s/gi, '_').replace(/[\.#]/g, '');
};

var convertProp = function(prop) {
  var result = camelCase(prop);

  // Handle vendor prefixes
  if (prop.indexOf('-webkit') === 0) {
    result = result.replace('webkit', 'Webkit');
  } else if (prop.indexOf('-moz') === 0) {
    result = result.replace('moz', 'Moz');
  } else if (prop.indexOf('-o') === 0) {
    result = result.replace('o', 'O');
  }

  return result;
};

function convertTransform(fullValue) {
  // remove spaces that are inside transformation values
  fullValue = fullValue.replace(/\((.+?)\)/g, function(a, b) {
    return "(" + b.replace(/\s/g, "") + ")";
  });
  // the only spaces left should be between transformation values
  var values = fullValue.split(' ');
  var transformations = [];

  for (var i = 0, j = values.length; i < j; i++) {
    var matches = values[i].match(/(.+)\((.+)\)/);
    var transformationType = matches[1];
    var transformation = matches[2];

    switch (transformationType.toLowerCase()) {
      case "perspective":
        transformations.push({
          perspective: parseFloat(transformation)
        })
        break;

      case "rotate":
      case "rotatex":
      case "rotatey":
      case "rotatez":
        var thisTransformation = {};
        thisTransformation[transformationType] = transformation;
        transformations.push(thisTransformation);
        break;

      case "rotate3d":
        var thisTransformationValues = transformation.split(",");
        transformations.push({
          rotateX: thisTransformationValues[0]
        }, {
          rotateY: thisTransformationValues[1]
        }, {
          rotateZ: thisTransformationValues[2]
        });
        break;

      case "scale":
      case "scalex":
      case "scaley":
        var thisTransformation = {};
        thisTransformation[transformationType] = parseFloat(transformation);
        transformations.push(thisTransformation);
        break;

      case "scale3d":
      case "scale2d":
        var thisTransformationValues = transformation.split(",");
        transformations.push({
          scaleX: parseFloat(thisTransformationValues[0])
        }, {
          scaleY: parseFloat(thisTransformationValues[1])
        });
        break;

      case "translatex":
      case "translatey":
        var thisTransformation = {};
        thisTransformation[transformationType] = parseFloat(transformation);
        transformations.push(thisTransformation);
        break;

      case "translate3d":
      case "translate2d":
        var thisTransformationValues = transformation.split(",");
        transformations.push({
          translateX: parseFloat(thisTransformationValues[0])
        }, {
          translateY: parseFloat(thisTransformationValues[1])
        });
        break;
    }
  }
}

var convertValue = function(property, value) {
  var result = value;
  var resultNumber = Number(result);

  // Handle single pixel values (font-size: 16px)
  if (result.indexOf(' ') === -1 && result.indexOf('px') !== -1) {
    result = parseInt(result.replace('px', ''), 10);
    // Handle numeric values
  } else if (typeof resultNumber === 'number') {
    result = resultNumber;
  } else if (property == 'transform') {
    result = convertTransform(result)
  }

  return result;
};

module.exports = function(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  var stylesheet = css.parse(source).stylesheet;

  if (stylesheet.parsingErrors.length) {
    throw new Error('Parsing Error occured.');
  }

  stylesheet.rules.forEach(function(rule) {
    var style = {};

    if (rule.type === RULE) {
      rule.declarations.forEach(function(declaration) {
        var camelCaseProperty = convertProp(declaration.property)
        style[camelCaseProperty] = convertValue(camelCaseProperty, declaration.value);
      });
    }

    rule.selectors.forEach(function(selector) {
      stylesheet[sanitizeSelector(selector)] = style;
    });
  });

  return stylesheet;
};
