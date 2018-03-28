const STREAM_MODULE = '@weex-module/stream';
const eventTarget = require('event-target-shim');

const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;

const XHR_EVENTS = [
  'abort',
  'error',
  'load',
  'loadstart',
  'progress',
  'timeout',
  'loadend',
  'readystatechange'
];

module.exports = function(__weex_require__) {
  class XMLHttpRequest extends eventTarget(...XHR_EVENTS) {
    static UNSENT = UNSENT;
    static OPENED = OPENED;
    static HEADERS_RECEIVED = HEADERS_RECEIVED;
    static LOADING = LOADING;
    static DONE = DONE;

    UNSENT = UNSENT;
    OPENED = OPENED;
    HEADERS_RECEIVED = HEADERS_RECEIVED;
    LOADING = LOADING;
    DONE = DONE;

    // EventTarget automatically initializes these to `null`.
    onload;
    onloadstart;
    onprogress;
    ontimeout;
    onerror;
    onabort;
    onloadend;
    onreadystatechange;

    readyState = UNSENT;
    responseHeaders;
    status = 0;
    statusText = '';
    timeout = 0;

    _aborted = false;
    _hasError = false;
    _headers;
    _lowerCaseResponseHeaders;
    _method = null;
    _response;
    _responseType;
    _response = '';
    _sent;
    _url = null;
    _timedOut = false;

    constructor() {
      super();
      this._reset();
    }

    _reset() {
      this.readyState = this.UNSENT;
      this.responseHeaders = undefined;
      this.status = 0;

      this._hasError = false;
      this._headers = {};
      this._response = '';
      this._responseType = '';
      this._sent = false;
      this._lowerCaseResponseHeaders = {};

      this._timedOut = false;
    }

    get responseType() {
      return this._responseType;
    }

    set responseType(responseType) {
      if (this._sent) {
        throw new Error(
          'Failed to set the \'responseType\' property on \'XMLHttpRequest\': The ' +
          'response type cannot be set after the request has been sent.'
        );
      }

      this._responseType = responseType;
    }

    get responseText() {
      if (this._responseType !== '' && this._responseType !== 'text') {
        throw new Error(
          "The 'responseText' property is only available if 'responseType' " +
          `is set to '' or 'text', but it is '${this._responseType}'.`
        );
      }
      if (this.readyState < LOADING) {
        return '';
      }
      return this._response;
    }

    get response() {
      const {responseType} = this;
      if (responseType === '' || responseType === 'text') {
        return this.readyState < LOADING || this._hasError
          ? ''
          : this._response;
      }

      if (this.readyState !== DONE) {
        return null;
      }
    }

    getAllResponseHeaders() {
      if (!this.responseHeaders) {
        // according to the spec, return null if no response has been received
        return null;
      }
      var headers = this.responseHeaders || {};
      return Object.keys(headers).map((headerName) => {
        return headerName + ': ' + headers[headerName];
      }).join('\r\n');
    }

    getResponseHeader(header) {
      var value = this._lowerCaseResponseHeaders[header.toLowerCase()];
      return value !== undefined ? value : null;
    }

    setRequestHeader(header, value) {
      if (this.readyState !== this.OPENED) {
        throw new Error('Request has not been opened');
      }
      this._headers[header.toLowerCase()] = String(value);
    }

    open(method, url, async) {
      /* Other optional arguments are not supported yet */
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
      this.setReadyState(this.OPENED);
    }

    send(data: any) {
      if (this.readyState !== this.OPENED) {
        throw new Error('Request has not been opened');
      }
      if (this._sent) {
        throw new Error('Request has already been sent');
      }
      this._sent = true;

      var nativeFetch = __weex_require__(STREAM_MODULE).fetch;

      nativeFetch({
        method: this._method,
        url: this._url,
        headers: this._headers,
        body: data,
        type: 'text',
      }, (response) => {
        try {
          typeof response === 'string' && (response = JSON.parse(response));

          this.status = response.status;
          this.statusText = response.statusText;
          this.setResponseHeaders(response.headers);

          if (response.ok) {
            this._response = response.data;
          } else {
            if (this._responseType === '' || this._responseType === 'text') {
              this._response = response.data;
            }
            this._hasError = true;
          }
        } catch (err) {

        }

        this.setReadyState(this.DONE);
      }, (progress) => {
        this.status = progress.status;
        this.statusText = progress.statusText;
        this.setResponseHeaders(progress.headers);
        this.setReadyState(progress.readyState);
      });
    }

    abort() {
      this._aborted = true;

      // TODO: Weex native not support abort now

      // only call onreadystatechange if there is something to abort,
      // below logic is per spec
      if (!(this.readyState === this.UNSENT ||
          this.readyState === this.OPENED && !this._sent ||
          this.readyState === this.DONE)) {
        this._reset();
        this.setReadyState(this.DONE);
      }
      // Reset again after, in case modified in handler
      this._reset();
    }

    setResponseHeaders(responseHeaders) {
      this.responseHeaders = responseHeaders || null;
      var headers = responseHeaders || {};
      this._lowerCaseResponseHeaders =
        Object.keys(headers).reduce((lcaseHeaders, headerName) => {
          lcaseHeaders[headerName.toLowerCase()] = headers[headerName];
          return lcaseHeaders;
        }, {});
    }

    setReadyState(newState) {
      this.readyState = newState;
      this.dispatchEvent({type: 'readystatechange'});
      if (newState === this.DONE) {
        if (this._aborted) {
          this.dispatchEvent({type: 'abort'});
        } else if (this._hasError) {
          if (this._timedOut) {
            this.dispatchEvent({type: 'timeout'});
          } else {
            this.dispatchEvent({type: 'error'});
          }
        } else {
          this.dispatchEvent({type: 'load'});
        }
        this.dispatchEvent({type: 'loadend'});
      }
    }
  }

  return XMLHttpRequest;
};
