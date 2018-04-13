import getComponentTree from './getComponentTree';

let treeSnapshot = {};

export default function getTreeSnapshot(roots, tree) {
  const rootIDs = Object.getOwnPropertyNames(roots);

  for (const rootID of rootIDs) {
    treeSnapshot[rootID] = getComponentData(tree[rootID], 0);
  }

  return treeSnapshot;
}

function getComponentData(element, parentID) {
  const data = getComponentTree(element);

  for (const child of data.children || []) {
    treeSnapshot[child._mountID] = getComponentData(child, element._mountID);
  }

  return {
    ...data,
    parentID: parentID,
    ownerID: element._mountID,
    displayName: data.name
  };
}
