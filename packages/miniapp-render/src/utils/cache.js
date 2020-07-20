const pageMap = {};
let configCache = {};
let elementsCache = [];
let elementMethodsCache = new Map();
let window;

// Init
function init(pageId, options) {
  pageMap[pageId] = {
    document: options.document,
    nodeIdMap: options.nodeIdMap,
  };
}

// Destroy
function destroy(pageId) {
  delete pageMap[pageId];
}

/**
 * Get document
 */
function getDocument(pageId) {
  return pageMap[pageId] && pageMap[pageId].document;
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
  const document = pageMap[pageId] && pageMap[pageId].document;

  // Call before run, do nothing
  if (!document) return;
  if (!domNode) return pageMap[pageId].nodeIdMap[nodeId] = domNode;

  let parentNode = domNode.parentNode;

  while (parentNode && parentNode !== document.body) {
    parentNode = parentNode.parentNode;
  }

  pageMap[pageId].nodeIdMap[nodeId] = parentNode === document.body ? domNode : null;
}

// Get the domNode by nodeId
function getNode(pageId, nodeId) {
  return pageMap[pageId] && pageMap[pageId].nodeIdMap[nodeId];
}

// Store global config
function setConfig(config) {
  configCache = config;
}

// Get global config
function getConfig() {
  return configCache;
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
    })
  } else {
    elementMethodsCache.set(methodName, methodFn);
  }
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
  setElementInstance,
  getElementInstance,
  setElementMethods
};
