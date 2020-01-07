const pageInstanceMap = {
  // pageId -> rax page instance
};


export function setPageInstance(pageInstance) {
  const pageId = pageInstance.instanceId;
  pageInstanceMap[pageId] = pageInstance;
}


export function getPageInstance(pageId) {
  if (pageInstanceMap.hasOwnProperty(pageId)) {
    return pageInstanceMap[pageId];
  }
  return null;
}
