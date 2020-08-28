const pageMap = {};
const routeMap = {};
let config = {};
let window;

const elementsCache = [];
const elementMethodsCache = new Map();
let updatingNodes = [];

// Init
function init(pageId, options) {
  pageMap[pageId] = options.document;
}

// Destroy
function destroy(pageId) {
  delete pageMap[pageId];
}

/**
 * Get document
 */
function getDocument(pageId) {
  return pageMap[pageId];
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
  const document = pageMap[pageId];

  // Call before run, do nothing
  if (!document) return;
  if (!domNode) return pageMap[pageId].__nodeIdMap[nodeId] = domNode;

  pageMap[pageId].__nodeIdMap[nodeId] = domNode;
}

// Get the domNode by nodeId
function getNode(pageId, nodeId) {
  return pageMap[pageId] && pageMap[pageId].__nodeIdMap[nodeId];
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
  if (!routeMap[route]) {
    return routeMap[route] = 1;
  } else {
    return ++routeMap[route];
  }
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
