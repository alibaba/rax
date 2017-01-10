import jsonp from '../index';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

// See http://doc.jsfiddle.net/use/echo.html
const URL = 'http://jsfiddle.net/echo/jsonp/';

describe('jsonp in web', () => {
  it('should fetch jsonp data', (done) => {
    jsonp(URL, {
      timeout: 10000
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      expect(json).not.toBeNull();
      done();
    });
  });

  it('should fail when time out', (done) => {
    jsonp(URL, {
      timeout: 0
    }).then(function(response) {
      return response.json();
    }).then((json) => {
      expect(json).not.toBeNull();
      done();
    }).catch(function(ex) {
      expect(ex.message).toEqual(`JSONP request to ${URL}? timed out`);
      done();
    });
  });
});
