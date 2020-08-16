import URL from '../url';

describe('URL', () => {
  it('accept url with proctal', () => {
    var url = new URL('http://example.com/path/to?query=string');
    expect(url.search).toEqual('?query=string');
    expect(url.hostname).toEqual('example.com');
  });
});
