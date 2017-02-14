'use strict';

import particular from '../particular';

describe('particular', () => {
  function testBorder(methodName) {
    const borderResult = particular[methodName]('1 solid red');

    expect(borderResult[methodName + 'Width']).toEqual('1');
    expect(borderResult[methodName + 'Style']).toEqual('solid');
    expect(borderResult[methodName + 'Color']).toEqual('#ff0000');
  }

  function testMeasure(key) {
    const result = particular[key]('1 2 3 4');

    expect(result[key + 'Top']).toEqual('1');
    expect(result[key + 'Right']).toEqual('2');
    expect(result[key + 'Bottom']).toEqual('3');
    expect(result[key + 'Left']).toEqual('4');
  }

  function testPrefix(methodName, isRem) {
    let value = 'testValue';
    const result = particular[methodName](value);
    const word = methodName.substring(0, 1).toUpperCase() + methodName.substring(1);

    expect(result['ms' + word]).toEqual(value);
    expect(result['webkit' + word]).toEqual(value);
    expect(result[methodName]).toEqual(value);
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

    expect(result[key + 'Top']).toEqual('1');
    expect(result[key + 'Right']).toEqual('2');
    expect(result[key + 'Bottom']).toEqual('3');
    expect(result[key + 'Left']).toEqual('2');
  });

  it('should separate two numbers', () => {
    const key = 'padding';
    const result = particular[key]('1 2');

    expect(result[key + 'Top']).toEqual('1');
    expect(result[key + 'Right']).toEqual('2');
    expect(result[key + 'Bottom']).toEqual('1');
    expect(result[key + 'Left']).toEqual('2');
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

    expect(result.lineHeight).toEqual('16rem');
  });
});
