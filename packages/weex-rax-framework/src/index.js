'use strict';

let Document;
let Element;
let Comment;

// Instance hub
const instances = {};

export function getInstance(instanceId) {
  const instance = instances[instanceId];
  if (!instance) {
    throw new Error(`Invalid instance id "${instanceId}"`);
  }
  return instance;
}

// TODO: delete (future)
export function init(config) {
  Document = config.Document;
  Element = config.Element;
  Comment = config.Comment;
}

/**
 * create a Weex instance
 *
 * @param  {string} instanceId
 * @param  {object} [__weex_options__] {bundleUrl, debug}
 * @param  {object} __weex_data__
 */
export function createInstanceContext(instanceId, __weex_options__, __weex_data__) {
  let instance = instances[instanceId];
  const weex = __weex_options__.weex;

  if (instance == undefined) {
    let bundleUrl = weex.config.bundleUrl;
    if (!bundleUrl) {
      console.error('Error: Must have bundleUrl option when createInstance, downgrade to "about:blank".');
      bundleUrl = 'about:blank';
    } else if (!bundleUrl.split('//')[0]) {
      bundleUrl = 'https:' + bundleUrl;
    }

    const document = new Document(instanceId, bundleUrl);

    instance = instances[instanceId] = {
      document,
      instanceId,
      bundleUrl,
      __weex_data__,
      uid: 0
    };

    const instanceContext = {
      instanceId,
      bundleUrl,
      document,
      __weex_document__: document,
      __weex_options__,
      __weex_data__: __weex_data__ || {},
      // Weex
      callNative: () => {},
      __weex_config__: __weex_options__
    };

    return instanceContext;
  } else {
    throw new Error(`Instance id "${instanceId}" existed when create instance`);
  }
}

/**
 * refresh a Weex instance
 *
 * @param  {string} instanceId
 * @param  {object} data
 */
export function refreshInstance(instanceId, data) {
  let instance = getInstance(instanceId);
  let document = instance.document;
  document.documentElement.fireEvent('refresh', {
    timestamp: Date.now(),
    data,
  });
  document.taskCenter.send('dom', { action: 'refreshFinish' }, []);
}

/**
 * destroy a Weex instance
 * @param  {string} instanceId
 */
export function destroyInstance(instanceId) {
  let instance = getInstance(instanceId);
  let bundleCode = instance.bundleCode;
  // instance.window.closed = true;

  let document = instance.document;
  document.documentElement.fireEvent('destory', {
    timestamp: Date.now()
  });

  if (document.destroy) {
    document.destroy();
  }

  if (document.taskCenter && document.taskCenter.destroyCallback) {
    document.taskCenter.destroyCallback();
  }

  delete instances[instanceId];
}

// FIXME: Hack for rollup build "import Rax from 'weex-rax-framework'", in rollup if `module.exports` has `__esModule` key must return by export default
export default exports;
