// pageId -> rax page instance
const pageInstanceMap = {};


export function setPageInstance(pageInstance) {
  const pageId = pageInstance.instanceId;
  pageInstanceMap[pageId] = pageInstance;
}


export function getPageInstanceById(pageId) {
  if (pageInstanceMap.hasOwnProperty(pageId)) {
    return pageInstanceMap[pageId];
  }
  return null;
}
