import jsonp from '../index';

const mockReturnedObject = {
  a: 1
};

const URL = 'http://XXX/jsonp/';

describe('jsonp in web', () => {
  it('should fetch jsonp data', (done) => {
    jsonp(URL, {
      jsonpCallbackFunctionName: 'jsonpCb'
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      expect(json).toEqual(mockReturnedObject);
      done();
    });

    window.jsonpCb(mockReturnedObject);
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
