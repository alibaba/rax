const DEFAULT_PROTOCOL = 'http:';
const URL_REG = new RegExp(
    '^([a-z0-9-]+\:)?' +                  //protocol
    '[/]{2}' +                            //slash x 2
    '(?:([^@/:\?]+)(?::([^@/:]+))?@)?' +  //username:password@
    '([^:/?#]+)' +                        //hostname
    '(?:[:]([0-9]+))?' +                  //port
    '([/][^?#;]*)?' +                     //pathname
    '(?:[?]([^#]*))?' +                   //search
    '([#][^?]*)?$'                        //hash
, 'i');

class Location {
  constructor(url) {
    this.parse(url);
  }

  parse(url) {
    //  1       2       3       4           5       6       7       8               9           10                  11
   // ["ftp", "user", "pass", "www.cs", "server", "com", "8080", "/dir1/dir2/", "file.php", "param1=value1", "hashtag"]
   // ftp://user:pass@www.cs.server.com:8080/dir1/dir2/file.php?param1=value1#hashtag
    var matches = url.match(URL_REG) || [];
    this.protocol = (matches[1] || DEFAULT_PROTOCOL);
    this.username = matches[2];
    this.password = matches[3];
    this.hostname = matches[4] || '';
    this.port = matches[5] || '';
    this.pathname = matches[6] || '/';
    this.search = matches[7] ? '?' + matches[7] : '';
    this.hash = matches[8] || '';
    this.host = this.hostname + (this.port ? ':' + this.port : '');
    this.origin = this.protocol + '//' + this.host;
    this.href = this.toString();
  }

  toString() {
    var string = this.protocol + '//';
    if (this.username) {
      string += this.username;
      if (this.password) {
        string += ':' + this.password;
      }
      string += '@';
    }
    string += this.hostname;
    if (this.port && this.port !== '80') {
      string += ':' + this.port;
    }
    if (this.pathname) {
      string += this.pathname;
    }
    if (this.search) {
      string += this.search;
    }
    if (this.hash) {
      string += this.hash;
    }
    return string;
  }
}

export default Location;
