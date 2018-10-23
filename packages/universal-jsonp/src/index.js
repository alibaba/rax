import {isWeex, isWeb} from 'universal-env';

// From https://github.com/camsong/fetch-jsonp
const defaultOptions = {
  timeout: 5000,
  jsonpCallback: 'callback'
};

function generateCallbackFunction() {
  return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`;
}

function clearFunction(functionName) {
  // IE8 throws an exception when you try to delete a property on window
  // http://stackoverflow.com/a/1824228/751089
  try {
    delete window[functionName];
  } catch (e) {
    window[functionName] = undefined;
  }
}

function removeScript(script) {
  document.getElementsByTagName('head')[0].removeChild(script);
}

const JSONP = function(url, options = {}) {
  if (isWeex) {
    const Stream = __weex_require__('@weex-module/stream');

    return new Promise((resolve, reject) => {
      const jsonpCallback = options.jsonpCallback != null ? options.jsonpCallback : defaultOptions.jsonpCallback;
      const callbackFunction = options.jsonpCallbackFunctionName || generateCallbackFunction();
      if (url.indexOf(jsonpCallback) == -1) {
        url += url.indexOf('?') === -1 ? '?' : '&';
        url = url + jsonpCallback + '=' + callbackFunction;
      }
      let params = {
        url: url,
        method: 'GET',
        dataType: 'jsonp',
        type: 'jsonp'
      };
      Stream.fetch(params, (response) => {
        try {
          if (typeof response === 'string') {
            // parse the response（it is string in weex-android & obj in ios）
            response = JSON.parse(response);
            if (response.data && typeof response.data === 'string' && response.ok) {
              try {
                response.data = JSON.parse(response.data);
              } catch (e) {
                throw new Error('the response.data in not valid json');
              }
            }
          }
          // resolve the response no matter success or fail(the user decide what to do)
          resolve({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            json: () => {
              return Promise.resolve(response.data);
            }
          });
        } catch (e) {
          reject(e);
        }
      }, (progress) => {
        if (progress.status === 'FAILED') reject(new Error(progress.data));
      });
    });
  } else {
    // !weex env
    return new Promise((resolve, reject) => {
      const timeout = options.timeout != null ? options.timeout : defaultOptions.timeout;
      const jsonpCallback = options.jsonpCallback != null ? options.jsonpCallback : defaultOptions.jsonpCallback;
      let timeoutId;
      const callbackFunction = options.jsonpCallbackFunctionName || generateCallbackFunction();
      const jsonpScript = document.createElement('script');

      window[callbackFunction] = function(response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function() {
            return Promise.resolve(response);
          }
        });
        if (timeoutId) clearTimeout(timeoutId);
        removeScript(jsonpScript);
        clearFunction(callbackFunction);
      };

      url += url.indexOf('?') === -1 ? '?' : '&';

      jsonpScript.setAttribute('src', url + jsonpCallback + '=' + callbackFunction);
      // jsonpScript.id = jsonpCallback + '_' + callbackFunction;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(() => {
        reject(new Error(`JSONP request to ${url} timed out`));
        removeScript(jsonpScript);

        // remove script will not abort the request, so rewrite callback function and clear itself after response
        window[callbackFunction] = function() {
          clearFunction(callbackFunction);
        };
      }, timeout);
    });
  }
};

export default JSONP;
