'use strict';

import particular from '../particular';

describe('particular', () => {
  function testBorder(methodName) {
    const borderResult = particular[methodName]('1 solid red');

    expect(borderResult[methodName + 'Width']).toEqual(1);
    expect(borderResult[methodName + 'Style']).toEqual('solid');
    expect(borderResult[methodName + 'Color']).toEqual('red');
  }

  function testMeasure(key) {
    const result = particular[key]('1 2 3 4');

    expect(result[key + 'Top']).toEqual(1);
    expect(result[key + 'Right']).toEqual(2);
    expect(result[key + 'Bottom']).toEqual(3);
    expect(result[key + 'Left']).toEqual(4);
  }

  function testPrefix(methodName, isRem) {
    let value = 'testValue';
    const result = particular[methodName](value);
    const word = methodName.substring(0, 1).toUpperCase() + methodName.substring(1);

    expect(result['ms' + word]).toEqual(value);
    expect(result['webkit' + word]).toEqual(value);
    expect(result[methodName]).toEqual(value);
  }

  function testTransition(value, separatedValue) {
    const result = particular.transition(value);

    expect(result.transitionProperty).toEqual(separatedValue.transitionProperty);
    expect(result.transitionDuration).toEqual(separatedValue.transitionDuration);
    expect(result.transitionDelay).toEqual(separatedValue.transitionDelay);
    expect(result.transitionTimingFunction).toEqual(separatedValue.transitionTimingFunction);
  }

  it('should separate border value', () => {
    testBorder('border');
    testBorder('borderTop');
    testBorder('borderRight');
    testBorder('borderBottom');
    testBorder('borderLeft');
  });

  it('should separate inside and outside distance', () => {
    testMeasure('padding');
    testMeasure('margin');
  });

  it('should separate three numbers', () => {
    const key = 'padding';
    const result = particular[key]('1 2 3');

    expect(result[key + 'Top']).toEqual(1);
    expect(result[key + 'Right']).toEqual(2);
    expect(result[key + 'Bottom']).toEqual(3);
    expect(result[key + 'Left']).toEqual(2);
  });

  it('should separate two numbers', () => {
    const key = 'padding';
    const result = particular[key]('1 2');

    expect(result[key + 'Top']).toEqual(1);
    expect(result[key + 'Right']).toEqual(2);
    expect(result[key + 'Bottom']).toEqual(1);
    expect(result[key + 'Left']).toEqual(2);
  });

  it('should separate one numbers', () => {
    const key = 'padding';
    const result = particular[key](1);

    expect(result[key + 'Top']).toEqual(1);
    expect(result[key + 'Right']).toEqual(1);
    expect(result[key + 'Bottom']).toEqual(1);
    expect(result[key + 'Left']).toEqual(1);
  });

  it('should return in front of four values with over four numbers', () => {
    const key = 'padding';
    const result = particular[key]('1 2 3 4 5');

    expect(result).toEqual({});
  });

  it('should transform lineHeight to string with rem', () => {
    const result = particular.lineHeight(16);

    expect(result.lineHeight).toEqual(16);
  });

  it('should transform fontWeight to string', () => {
    const result = particular.fontWeight(200);

    expect(result.fontWeight).toEqual('200');
  });

  it('should transform transitionDuration to string with ms', () => {
    const result = particular.transitionDuration('0.5s');

    expect(result.transitionDuration).toEqual('500ms');
  });

  it('should transform transitionDelay to string with ms', () => {
    const result = particular.transitionDuration('.5s');

    expect(result.transitionDuration).toEqual('500ms');
  });

  it('should delete empty spaces in transitionTimingFunction', () => {
    const result = particular.transitionTimingFunction('cubic-bezier( 0.42, 0, 0.58, 1 )');

    expect(result.transitionTimingFunction).toEqual('cubic-bezier(0.42,0,0.58,1)');
  });

  it('should transform transitionProperty \'background-color\' to string \'backgroundColor\'', () => {
    const result = particular.transitionProperty('background-color');

    expect(result.transitionProperty).toEqual('backgroundColor');
  });

  it('should transform transitionProperty \'all\' to string \'width,height,top,bottom,left,right,backgroundColor,opacity,transform\'', () => {
    const result = particular.transitionProperty('all');

    expect(result.transitionProperty).toEqual('width,height,top,bottom,left,right,backgroundColor,opacity,transform');
  });

  it('should separate transition value', () => {
    testTransition('all 0.5s linear', {
      transitionProperty: 'width,height,top,bottom,left,right,backgroundColor,opacity,transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'linear',
      transitionDelay: '0ms'
    });
    testTransition('background-color 300ms cubic-bezier( 0.42, 0, 0.58, 1 ) .01s', {
      transitionProperty: 'backgroundColor',
      transitionDuration: '300ms',
      transitionTimingFunction: 'cubic-bezier(0.42,0,0.58,1)',
      transitionDelay: '10ms'
    });
    testTransition('none', {
      transitionDuration: '0ms',
      transitionTimingFunction: 'ease',
      transitionDelay: '0ms'
    });
  });
});
