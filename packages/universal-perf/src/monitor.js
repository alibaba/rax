import performanceNow from './performanceNow';

let profiling = false;
let currentNesting = 0;
let currentStartTime = 0;
let currentNestedDuration = 0;
let currentMeasurements = [];
let operations = [];
let data = [];
let tree = {};
let roots = {};

function resetMeasurements() {
  if (currentNesting === 0) {
    currentStartTime = 0;
    currentMeasurements = [];
    return;
  }

  if (currentMeasurements.length) {
    data.push({
      duration: performanceNow() - currentStartTime,
      measurements: currentMeasurements,
      operations: operations,
      tree: tree
    });
  }

  currentStartTime = performanceNow();
  currentMeasurements = [];
}

function clear() {
  currentStartTime = 0;
  currentNestedDuration = 0;
}

const Monitor = {
  begin() {
    if (profiling) {
      return;
    }

    profiling = true;
    data = [];
    resetMeasurements();
  },
  end() {
    if (!profiling) {
      return;
    }

    profiling = false;
    resetMeasurements();
  },
  beginRender() {
    currentNesting++;
    resetMeasurements();
    clear();
  },
  endRender() {
    resetMeasurements();
    currentNesting--;
  },
  beginMountComponent(instanceID, element) {
    tree[instanceID] = element;

    // root
    if (element.getName() === 'Root') {
      roots[instanceID] = element;
    }
  },
  endMountComponent(instanceID) {
    const item = tree[instanceID];
    item.isMounted = true;
  },
  beginUpdateComponent(instanceID, element) {
    const item = tree[instanceID];
    if (!item || !item.isMounted) {
      return;
    }
    item.element = element;
  },
  endUpdateComponent(instanceID) {
    const item = tree[instanceID];
    if (!item || !item.isMounted) {
      return;
    }
    item.updateCount++;
  },
  beginLifeCycle(instanceID, timeType) {
    if (currentNesting === 0) {
      return;
    }

    currentStartTime = performanceNow();
    currentNestedDuration = 0;
  },
  endLifeCycle(instanceID, timerType) {
    if (currentNesting === 0) {
      return;
    }

    if (profiling) {
      currentMeasurements.push({
        timerType,
        instanceID: instanceID,
        duration: performanceNow() - currentStartTime - currentNestedDuration,
      });
    }

    clear();
  },
  recordOperation(operation) {
    operations.push(operation);
  },
  getData() {
    return data;
  },
  getRoots() {
    return roots;
  },
  getTree() {
    return tree;
  }
};

export default Monitor;
