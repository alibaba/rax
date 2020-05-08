const pageMap = {};
let configCache = {};
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
};
