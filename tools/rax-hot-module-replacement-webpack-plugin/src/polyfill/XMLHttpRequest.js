module.exports = function() {
  var XMLHttpRequest = function() { // eslint-disable-line
    this.UNSENT = 0;
    this.OPENED = 1;
    this.HEADERS_RECEIVED = 2;
    this.LOADING = 3;
    this.DONE = 4;

    this.readyState = 0;
    this.status = 0;
    this.responseHeaders = {};
    this.timeout = 0;
    this.onreadystatechange = function() {};
  };

  XMLHttpRequest.prototype.open = function(method, url, async) {
    if (this.readyState !== this.UNSENT) {
      throw new Error('Cannot open, already sending');
    }

    if (async !== undefined && !async) {
      // async is default
      throw new Error('Synchronous http requests are not supported');
    }

    if (!url) {
      throw new Error('Cannot load an empty url');
    }

    this._method = method.toUpperCase();
    this._url = url;
    this._aborted = false;
    this.readyState = 1;
  };

  XMLHttpRequest.prototype.send = function(data) {
    if (this.readyState !== this.OPENED) {
      throw new Error('Request has not been opened');
    }
    if (this._sent) {
      throw new Error('Request has already been sent');
    }
    this._sent = true;
    var self = this;
    fetch(this._url, {
      method: this._method,
      dataType: 'text'
    })
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
        self.responseText = text;
        self.status = 200;
        self.readyState = self.DONE;
        self.onreadystatechange();
      })
      .catch(function(err) {
        self.status = 404;
        self.readyState = self.DONE;
        self.onreadystatechange();
      });
  };
};
