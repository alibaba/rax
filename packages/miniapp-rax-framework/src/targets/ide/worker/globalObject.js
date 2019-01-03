import getModule from './getModule';

const CURRENT_CLIENT_ID = '__current_client_id__';

// TODO:
const APIs = {}; // my.*
const wmlEnv = {}; // use for windmill environment.
const wmlRuntimeAPI = {
  $getCurrentActivePageId() {
    return global[CURRENT_CLIENT_ID];
  },
  $on(eventName, callback) {
    addEventListener(eventName, callback);
  },
  $emit(eventName, payload, clientId) {
    postMessage({
      type: eventName,
      data: payload,
      clientId
    });
  }
}

const globalObject = {
  require: getModule,
  my: APIs,
  __file_schema_prefix__: '',
  __windmill_environment__: wmlEnv,
  __WINDMILL_WORKER_RUNTIME_APIS__: wmlRuntimeAPI,
};

export function setupGlobalObject() {
  Object.assign(global, globalObject);
}
