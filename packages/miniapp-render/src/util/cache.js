const pageMap = {};
let configCache = {};

// Init
function init(pageId, options) {
  pageMap[pageId] = {
    window: options.window,
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

/**
 * Get window
 */
function getWindow(pageId) {
  return pageMap[pageId] && pageMap[pageId].window;
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
  getWindow,
  setNode,
  getNode,
  setConfig,
  getConfig,
};
