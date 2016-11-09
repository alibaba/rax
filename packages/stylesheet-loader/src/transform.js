'use strict';
const camelCase = require('camelcase');
const normalizeColor = require('./normalizeColor');
const particular = require('./particular');

module.exports = {
  sanitizeSelector(selector) {
    return selector.replace(/\s/gi, '_').replace(/[\.#]/g, '');
  },

  convertProp(prop) {
    let result = camelCase(prop);

    // Handle vendor prefixes
    if (prop.indexOf('-webkit') === 0) {
      result = result.replace('webkit', 'Webkit');
    } else if (prop.indexOf('-moz') === 0) {
      result = result.replace('moz', 'Moz');
    } else if (prop.indexOf('-o') === 0) {
      result = result.replace('o', 'O');
    }

    return result;
  },

  convertTransform(fullValue) {
    // remove spaces that are inside transformation values
    fullValue = fullValue.replace(/\((.+?)\)/g, function(a, b) {
      return "(" + b.replace(/\s/g, "") + ")";
    });
    // the only spaces left should be between transformation values
    let values = fullValue.split(' ');
    let transformations = [];

    for (let i = 0, j = values.length; i < j; i++) {
      let matches = values[i].match(/(.+)\((.+)\)/);
      let transformationType = matches[1];
      let transformation = matches[2];

      switch (transformationType.toLowerCase()) {
        case 'perspective':
          transformations.push({
            perspective: parseFloat(transformation)
          })
          break;

        case 'rotate':
        case 'rotatex':
        case 'rotatey':
        case 'rotatez':
          var thisTransformation = {};
          thisTransformation[transformationType] = transformation;
          transformations.push(thisTransformation);
          break;

        case 'rotate3d':
          var thisTransformationValues = transformation.split(",");
          transformations.push({
            rotateX: thisTransformationValues[0]
          }, {
            rotateY: thisTransformationValues[1]
          }, {
            rotateZ: thisTransformationValues[2]
          });
          break;

        case 'scale':
        case 'scalex':
        case 'scaley':
          var thisTransformation = {};
          thisTransformation[transformationType] = parseFloat(transformation);
          transformations.push(thisTransformation);
          break;

        case 'scale3d':
        case 'scale2d':
          var thisTransformationValues = transformation.split(",");
          transformations.push({
            scaleX: parseFloat(thisTransformationValues[0])
          }, {
            scaleY: parseFloat(thisTransformationValues[1])
          });
          break;

        case 'translatex':
        case 'translatey':
          var thisTransformation = {};
          thisTransformation[transformationType] = parseFloat(transformation);
          transformations.push(thisTransformation);
          break;

        case 'translate3d':
        case 'translate2d':
          var thisTransformationValues = transformation.split(",");
          transformations.push({
            translateX: parseFloat(thisTransformationValues[0])
          }, {
            translateY: parseFloat(thisTransformationValues[1])
          });
          break;
      }
    }
  },

  convertValue(property, value) {
    var result = value,
      resultNumber;

    if (!Number.isNaN(Number(result))) {
      resultNumber = Number(result);
    }

    // Handle single pixel values (font-size: 16px)
    if (result.indexOf(' ') === -1 && result.indexOf('px') !== -1) {
      result = parseInt(result.replace('px', ''), 10);
    } else if (typeof resultNumber === 'number') {
      result = resultNumber;
    } else if (property == 'transform') {
      result = convertTransform(result)
    }

    result = normalizeColor(property, value);

    return result;
  },

  // print error
  formatLessRenderError(e) {
    let extract = e.extract? '\n near lines:\n   ' + e.extract.join('\n   ') : '';
    let err = new Error(
      e.message + '\n @ ' + e.filename +
      ' (line ' + e.line + ', column ' + e.column + ')' +
      extract
    );
    err.hideStack = true;
    return err;
  },

  inheritText(rule) {
    const self = this;
    let style = {};

    if (rule.tagName === 'text') {
      return;
    }

    rule.declarations.forEach(function(declaration) {
      let camelCaseProperty = self.convertProp(declaration.property)
      let value = self.convertValue(camelCaseProperty, declaration.value);
      style[camelCaseProperty] = value;

      if (particular[camelCaseProperty]) {
        let particularResult = particular[camelCaseProperty](value);
        if (particularResult.isDeleted) {
          style[camelCaseProperty] = null;
          delete style[camelCaseProperty];
        }
        Object.assign(style, particularResult);
      }
    });

    return style;
  }
};
