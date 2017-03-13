/* eslint-env node, mocha */

const assert = require('chai').assert;
const base64ImageLoader = require('../index');

const fs = require('fs');


describe('testImageBase64', () => {
  it('output the base64 string', () => {
    const thisObj = { resourcePath: 'filename.png' };
    const aBase64String = 'SGVsbG8gV29ybGQ=';
    const result = base64ImageLoader.call(thisObj, new Buffer(aBase64String, 'base64'));

    assert.include(result, aBase64String);
  });

  it('should set extension for jpg', () => {
    const thisObj = { resourcePath: 'filename.jpg' };
    const result = base64ImageLoader.call(thisObj, new Buffer(''));

    assert.include(result, 'image/jpeg');
  });

  it('should set extension for png', () => {
    const thisObj = { resourcePath: 'filename.png' };
    const result = base64ImageLoader.call(thisObj, new Buffer(''));

    assert.include(result, 'image/png');
  });

  it('should set extension for svg', () => {
    const thisObj = { resourcePath: 'filename.svg' };
    const result = base64ImageLoader.call(thisObj, new Buffer(''));

    assert.include(result, 'image/svg+xml');
  });

  it('should throw an error on unknown file extension', () => {
    const thisObj = { resourcePath: 'filename.bad' };

    assert.throws(base64ImageLoader.bind(thisObj, new Buffer('')));
  });

  it('output the base64 of the test image', () => {
    const testImage = fs.readFileSync('./test/1x1.png');
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII='; // eslint-disable-line max-len

    const thisObj = { resourcePath: 'filename.png' };

    const result = base64ImageLoader.call(thisObj, testImage);
    assert.include(result, testImageBase64);
    assert.include(result, 'width: 1');
    assert.include(result, 'height: 1');
  });

  it('case insensitive extension matching', () => {
    const testImage = fs.readFileSync('./test/1x1.png');
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII='; // eslint-disable-line max-len

    const thisObj = { resourcePath: 'filename.pNG' };

    const result = base64ImageLoader.call(thisObj, testImage);

    assert.include(result, testImageBase64);
    assert.include(result, 'width: 1');
    assert.include(result, 'height: 1');
  });
});
