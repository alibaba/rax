import jsonp from '../index';

const URL = 'http://jsfiddle.net/echo/jsonp/';

const mockReturnedObject = {
  a: 1
};

const mockFetchFn = jest.fn();

jest.mock('@weex-module/stream', () => {
  return {
    fetch: mockFetchFn
  };
}, {virtual: true});

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('jsonp in weex', () => {
  mockFetchFn.mockImplementationOnce((params, cb) => cb({
    data: mockReturnedObject
  }));

  it('response is object', () => {
    return jsonp(URL).then((response) => {
      return response.json();
    }).then((json) => {
      expect(json).toEqual(mockReturnedObject);
    }).catch((error) => {
      expect(error).toBeNull();
    });
  });

  it('response is string', () => {
    mockFetchFn.mockImplementationOnce((params, cb) => cb(JSON.stringify({
      data: mockReturnedObject
    })));

    return jsonp(URL).then((response) => {
      return response.json();
    }).then((json) => {
      expect(json).toEqual(mockReturnedObject);
    }).catch((error) => {
      expect(error).toBeNull();
    });
  });

  it('response data is string', () => {
    mockFetchFn.mockImplementationOnce((params, cb) => cb(JSON.stringify({
      data: JSON.stringify(mockReturnedObject),
      ok: true
    })));

    return jsonp(URL).then((response) => {
      return response.json();
    }).then((json) => {
      expect(json).toEqual(mockReturnedObject);
    }).catch((error) => {
      expect(error).toBeNull();
    });
  });

  it('response data is not a valid json', () => {
    mockFetchFn.mockImplementationOnce((params, cb) => cb(JSON.stringify({
      data: 'a',
      ok: true
    })));

    return jsonp(URL).then((response) => {
      return response.json();
    }).then((json) => {
      expect(json).not.toEqual(mockReturnedObject);
    }).catch((ex) => {
      expect(ex.message).toEqual('the response.data in not valid json');
    });
  });
});
