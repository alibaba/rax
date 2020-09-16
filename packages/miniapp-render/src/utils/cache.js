const pageMap = new Map();
const routeMap = new Map();
let config = {};
let window;

const elementsCache = [];
const elementMethodsCache = new Map();

// Init
function init(pageId, options) {
  pageMap.set(pageId, options.document);
}

// Destroy
function destroy(pageId) {
  pageMap.delete(pageId);
}

/**
 * Get document
 */
function getDocument(pageId) {
  return pageMap.get(pageId);
}

// Set window
function setWindow(value) {
  window = value;
}

/**
 * Get window
 */
function getWindow() {
  return window;
}

/**
 * Save domNode map
 */
function setNode(pageId, nodeId, domNode = null) {
  const document = pageMap.get(pageId);

  // Call before run, do nothing
  if (!document) return;

  document.__nodeIdMap.set(nodeId, domNode);
}

// Get the domNode by nodeId
function getNode(pageId, nodeId) {
  const document = pageMap.get(pageId);
  return document && document.__nodeIdMap.get(nodeId);
}

// Store global config
function setConfig(value) {
  config = value;
}

// Get global config
function getConfig() {
  return config;
}

function getRouteId(route) {
  const routeId = routeMap.get(route) || 0;
  routeMap.set(route, routeId + 1);
  return routeId + 1;
}

function setElementInstance(instance) {
  elementsCache.push(instance);
  if (elementMethodsCache.size > 0) {
    elementMethodsCache.forEach((methodFn, methodName) => {
      if (!instance[methodName]) {
        instance[methodName] = methodFn;
      }
    });
  }
}

function getElementInstance() {
  return elementsCache;
}

function setElementMethods(methodName, methodFn) {
  if (elementsCache.length > 0) {
    elementsCache.forEach(element => {
      element[methodName] = methodFn;
    });
  }
  elementMethodsCache.set(methodName, methodFn);
}

export default {
  init,
  destroy,
  getDocument,
  setWindow,
  getWindow,
  setNode,
  getNode,
  setConfig,
  getConfig,
  getRouteId,
  setElementInstance,
  getElementInstance,
  setElementMethods
};
