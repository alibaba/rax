let profiling = false;
let currentNesting = 0;
let currentStartTime = 0;
let currentNestedDuration = 0;
let currentMeasurements = [];
let operations = [];
let data = [];
let tree = {};
let roots = {};

let performance = {};
if (typeof window !== 'undefined') {
  performance =
    window.performance ||
    window.webkitPerformance || {};
}

function now() {
  if (performance.now) {
    return performance.now();
  } else {
    return Date.now();
  }
}

function resetMeasurements() {
  if (currentMeasurements.length) {
    data.push({
      duration: now() - currentStartTime,
      measurements: currentMeasurements,
      operations: operations,
      tree: tree
    });
  }

  currentStartTime = now();
  currentMeasurements = [];
}

function clear() {
  currentStartTime = 0;
  currentNestedDuration = 0;
}

const Measurer = {
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
  beforeRender() {
    currentNesting++;
    resetMeasurements();
    clear();
  },
  afterRender() {
    resetMeasurements();
    currentNesting--;
  },
  beforeMountComponent(instanceID, element) {
    tree[instanceID] = element;

    // root
    if (element.getName() === 'Root') {
      roots[instanceID] = element;
    }
  },
  afterMountComponent(instanceID) {
    const item = tree[instanceID];
    item.isMounted = true;
  },
  beforeUpdateComponent(instanceID, element) {
    const item = tree[instanceID];
    if (!item || !item.isMounted) {
      return;
    }
    item.element = element;
  },
  afterUpdateComponent(instanceID) {
    const item = tree[instanceID];
    if (!item || !item.isMounted) {
      return;
    }
    item.updateCount++;
  },
  beforeLifeCycle(instanceID, timeType) {
    currentStartTime = now();
    currentNestedDuration = 0;
  },
  afterLifeCycle(instanceID, timerType) {
    if (profiling) {
      currentMeasurements.push({
        timerType,
        instanceID: instanceID,
        duration: now() - currentStartTime - currentNestedDuration,
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

export default Measurer;
