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

  // 运行前调用，不做任何操作
  if (!document) return;
  // 相当于删除映射
  if (!domNode) return pageMap[pageId].nodeIdMap[nodeId] = domNode;

  let parentNode = domNode.parentNode;

  while (parentNode && parentNode !== document.body) {
    parentNode = parentNode.parentNode;
  }

  pageMap[pageId].nodeIdMap[nodeId] = parentNode === document.body ? domNode : null;
}

/**
 * 根据 nodeId 获取 domNode
 */
function getNode(pageId, nodeId) {
  return pageMap[pageId] && pageMap[pageId].nodeIdMap[nodeId];
}

/**
 * 存储全局 config
 */
function setConfig(config) {
  configCache = config;
}

/**
 * 获取全局 config
 */
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
