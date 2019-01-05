/**
 * my api
 */
import ctxRequire from '../require';

const $call = ctxRequire('@core/my');

const my = {};

export function registerApis(apiList) {
  apiList.forEach(method => {
    my[method] = (params = {}, successCallback, failCallback) => {
      const {success, fail, complete, ...methodParams} = params;
      const callKey = `my.${method}`;
      return $call(callKey, methodParams, successCallback, failCallback);
    };
  });

  postMessage({ type: 'api-registered' });
};

export default my;


