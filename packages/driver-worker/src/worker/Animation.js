const patchTransform = {};

export function dispatchAnimationToStyle(node, animationGroup) {
  // properties aren't belonged to transform
  const notBelongedToTransform = [
    'opacity',
    'backgroundColor',
    'width',
    'height',
    'top',
    'left',
    'bottom',
    'right'
  ];
  let nextProperties = {};
  let nextTranfrom = '';
  let transformActions = [];

  // actions about transform
  animationGroup.animation.map(prop => {
    let [name, value] = prop;

    if (notBelongedToTransform.indexOf(name) > -1) {
      let unit = '';
      /**
       * Tip:
       * Currently, we are not supprt custom unit
       */
      if (['opacity', 'backgroundColor'].indexOf(name) < 0) {
        unit = 'px';
      } else if (name === 'backgroundColor') {
        name = 'background-color';
      }

      nextProperties[name] = value + unit;
    } else {
      transformActions.push({
        name,
        value
      });
    }
  });

  // match actions and update patchTransform
  transformActions.forEach(({ name, value }) => {
    let defaultVal = 0;
    let unit = '';

    if (/rotate[XYZ]?$/.test(name)) {
      unit = 'deg';
    }

    if (/translate/.test(name)) {
      unit = 'px';
    }
    // scale's defaultVal is 1
    if (/scale/.test(name)) {
      defaultVal = 1;
    }

    if (['rotate', 'scale', 'translate', 'skew'].indexOf(name) > -1) {
      // if the rotate only has one param, it equals to rotateZ
      if (name === 'rotate' && value.length === 1) {
        patchTransform[`${name}Z`] = (value[0] || defaultVal) + unit;
        return;
      }

      if (value.length === 3) {
        patchTransform[`${name}Z`] = (value[2] || defaultVal) + unit;
      }

      patchTransform[`${name}X`] = (value[0] || defaultVal) + unit;
      patchTransform[`${name}Y`] = (value[1] || defaultVal) + unit;
    } else if (['scale3d', 'translate3d'].indexOf(name) > -1) {
      // three args
      patchTransform[name] = value
        .map(i => `${i || defaultVal}${unit}`)
        .join(',');
    } else if ('rotate3d' === name) {
      patchTransform[name] =
        value.map(i => `${i || defaultVal}${unit}`).join(',') + 'deg';
    } else if (['matrix', 'matrix3d'].indexOf(name) > -1) {
      nextTranfrom += ` ${name}(${value.join(',')})`;
    } else {
      // key = val
      patchTransform[name] = value[0] + unit;
    }
  });

  // stitching patchTransform into a string
  Object.keys(patchTransform).forEach(name => {
    nextTranfrom += ` ${name}(${patchTransform[name]})`;
  });

  /**
   * Merge onto style cssText
   * before every animationGroup setTimeout 16ms
   *
   * it shouldn't just assignment cssText
   * but parse cssText
   */

  requestAnimationFrame(() => {
    const {
      duration,
      timeFunction,
      delay,
      transformOrigin
    } = animationGroup.config;
    let properties = {};

    if (node.style) {
      const propList = Object.keys(node.style);
      const style = {};
      const transformProperties = [
        'transition',
        'transform',
        'transform-origin'
      ];
      // traverse all properties that aren't about transform
      propList.forEach((prop) => {
        if (
          prop &&
          transformProperties.indexOf(prop) < 0
        ) {
          style[prop] = node.style[prop];
        }
      });
      // merge nextProperties into style
      properties = Object.assign(style, nextProperties);
    }

    node.style = Object.assign(node.style, {
      transition: `all ${duration}ms ${timeFunction} ${delay}ms`,
      transformOrigin: transformOrigin,
      transform: `${nextTranfrom}`,
      ...properties
    });
  });
}
