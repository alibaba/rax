// https://github.com/ericf/css-mediaquery

const RE_MEDIA_QUERY = /^(?:(only|not)?\s*([_a-z][_a-z0-9-]*)|(\([^\)]+\)))(?:\s*and\s*(.*))?$/i,
  RE_MQ_EXPRESSION = /^\(\s*([_a-z-][_a-z0-9-]*)\s*(?:\:\s*([^\)]+))?\s*\)$/,
  RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/;

function _matches(media, values) {
  return _parseQuery(media).some((query) => {
    const inverse = query.inverse;

    const typeMatch = query.type === 'all' || values.type === query.type;

    if (typeMatch && inverse || !(typeMatch || inverse)) {
      return false;
    }

    const expressionsMatch = query.expressions.every((expression) => {
      let feature = expression.feature,
        modifier = expression.modifier,
        expValue = expression.value,
        value = values[feature];

      if (!value) {
        return false;
      }

      switch (feature) {
        case 'width':
        case 'height':
          expValue = parseFloat(expValue);
          value = parseFloat(value);
          break;
      }

      switch (modifier) {
        case 'min': return value >= expValue;
        case 'max': return value <= expValue;
        default: return value === expValue;
      }
    });

    return expressionsMatch && !inverse || !expressionsMatch && inverse;
  });
};

function _parseQuery(media) {
  return media.split(',').map((query) => {
    query = query.trim();

    const captures = query.match(RE_MEDIA_QUERY);

    if (!captures) {
      throw new SyntaxError(`Invalid CSS media query: "${query}"`);
    }

    let modifier = captures[1],
      type = captures[2],
      expressions = ((captures[3] || '') + (captures[4] || '')).trim(),
      parsed = {};

    parsed.inverse = !!modifier && modifier.toLowerCase() === 'not';
    parsed.type = type ? type.toLowerCase() : 'all';

    if (!expressions) {
      parsed.expressions = [];
      return parsed;
    }

    expressions = expressions.match(/\([^\)]+\)/g);

    if (!expressions) {
      throw new SyntaxError(`Invalid CSS media query: "${query}"`);
    }

    parsed.expressions = expressions.map((expression) => {
      const captures = expression.match(RE_MQ_EXPRESSION);

      if (!captures) {
        throw new SyntaxError(`Invalid CSS media query: "${query}"`);
      }

      const feature = captures[1].toLowerCase().match(RE_MQ_FEATURE);

      return {
        modifier: feature[1],
        feature: feature[2],
        value: captures[2]
      };
    });

    return parsed;
  });
};

function matchMedia(media) {
  let mql = {
    matches: false,
    media: media
  };

  if (media === '') {
    mql.matches = true;
    return mql;
  }

  mql.matches = _matches(media, {
    type: 'screen',
    width: window.screen.width,
    height: window.screen.height
  });

  return mql;
}

module.exports = matchMedia;
