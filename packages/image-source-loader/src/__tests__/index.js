'use strict';
const imageSourceLoader = require('../index');
/* eslint-disable */
const onePixelPng = require('one-pixel-png');
/* eslint-enable */
describe('test image source loader', () => {
  it('output the base64 string', () => {
    const thisObj = { resourcePath: 'filename.png' };
    const aBase64String = 'SGVsbG8gV29ybGQ=';
    const result = imageSourceLoader.call(thisObj, new Buffer(aBase64String, 'base64'));
    expect(result).toEqual(expect.stringMatching(aBase64String));
  });

  it('should set extension for jpg', () => {
    const thisObj = { resourcePath: 'filename.jpg' };
    const result = imageSourceLoader.call(thisObj, new Buffer(''));

    expect(result).toEqual(expect.stringMatching('image/jpeg'));
  });

  it('should set extension for png', () => {
    const thisObj = { resourcePath: 'filename.png' };
    const result = imageSourceLoader.call(thisObj, new Buffer(''));

    expect(result).toEqual(expect.stringMatching('image/png'));
  });

  it('should throw an error on unknown file extension', () => {
    const thisObj = { resourcePath: 'filename.bad' };

    expect(imageSourceLoader.bind(thisObj, new Buffer(''))).toThrow(Error);
  });

  it('output the base64 of the test image', () => {
    const testImage = onePixelPng;
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII='; // eslint-disable-line max-len

    const thisObj = { resourcePath: 'filename.png' };

    const result = imageSourceLoader.call(thisObj, testImage);
    expect(result).toEqual(expect.stringMatching(testImageBase64));
    expect(result).toEqual(expect.stringMatching('width: 1'));
    expect(result).toEqual(expect.stringMatching('height: 1'));
  });

  it('case insensitive extension matching', () => {
    const testImage = onePixelPng;
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII='; // eslint-disable-line max-len

    const thisObj = { resourcePath: 'filename.pNG' };

    const result = imageSourceLoader.call(thisObj, testImage);

    expect(result).toEqual(expect.stringMatching(testImageBase64));
    expect(result).toEqual(expect.stringMatching('width: 1'));
    expect(result).toEqual(expect.stringMatching('height: 1'));
  });
});
