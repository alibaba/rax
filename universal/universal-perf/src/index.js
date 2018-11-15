import Measurer from './measurer';
import getTreeSnapshot from './getTreeSnapshot';

function roundFloat(val, base = 2) {
  const n = Math.pow(10, base);
  return Math.floor(val * n) / n;
}

function getLastMeasurements() {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  return Measurer.getData();
}

function start() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  Measurer.begin();
}

function stop() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  Measurer.end();
}

function getOperations(data = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  const roots = Measurer.getRoots();
  const tree = Measurer.getTree();
  const treeSnapshot = getTreeSnapshot(roots, tree);

  let stats = [];
  data.forEach((flush, flushIndex) => {
    let {operations} = flush;
    operations.forEach(operation => {
      let {instanceID, type, payload} = operation;
      let {displayName = '', parentID = 0} = treeSnapshot[instanceID] || {};
      let owner = treeSnapshot[parentID];
      let key = (owner ? owner.displayName + ' > ' : '') + displayName;

      stats.push({
        flushIndex,
        instanceID,
        key,
        type,
        parentID,
        payload,
      });
    });
  });
  return stats;
}

function getInclusive(data = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const roots = Measurer.getRoots();
  const tree = Measurer.getTree();
  const treeSnapshot = getTreeSnapshot(roots, tree);

  let aggregatedStats = {};
  let affectedIDs = {};

  function updateAggregatedStats(treeSnapshot, instanceID, applyUpdate) {
    const component = treeSnapshot[instanceID];
    if (!component) {
      return;
    }
    const {displayName, parentID} = component;
    const owner = treeSnapshot[parentID];
    const key = (owner ? owner.displayName + ' > ' : '') + displayName;
    let stats = aggregatedStats[key];
    if (!stats) {
      affectedIDs[key] = {};
      stats = aggregatedStats[key] = {
        key,
        instanceCount: 0,
        inclusiveRenderDuration: 0,
        renderCount: 0,
      };
    }
    affectedIDs[key][instanceID] = true;
    applyUpdate(stats);
  }
  let isCompositeByID = {};
  data.forEach(flush => {
    const {measurements} = flush;
    measurements.forEach(measurement => {
      const {duration, instanceID, timerType} = measurement;
      if (timerType !== 'render') {
        return;
      }
      isCompositeByID[instanceID] = true;
      let nextParentID = instanceID;
      while (nextParentID) {
        if (isCompositeByID[nextParentID]) {
          updateAggregatedStats(treeSnapshot, nextParentID, stats => {
            stats.inclusiveRenderDuration += duration;
          });
        }
        if (treeSnapshot[nextParentID]) {
          nextParentID = treeSnapshot[nextParentID].parentID;
        } else {
          nextParentID = 0;
        }
      }
    });
  });

  return Object.keys(aggregatedStats)
    .map(key => ({
      ...aggregatedStats[key],
      instanceCount: Object.keys(affectedIDs[key]).length,
    }))
    .sort((a, b) =>
      b.inclusiveRenderDuration - a.inclusiveRenderDuration
    );
}

function getWasted(data = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  const roots = Measurer.getRoots();
  const tree = Measurer.getTree();
  const treeSnapshot = getTreeSnapshot(roots, tree);

  let aggregatedStats = {};
  let affectedIDs = {};

  function updateAggregatedStats(treeSnapshot, instanceID, applyUpdate) {
    const component = treeSnapshot[instanceID];
    if (!component) {
      return;
    }
    let {displayName, parentID} = component;
    let owner = treeSnapshot[parentID];
    let key = (owner ? owner.displayName + ' > ' : '') + displayName;
    let stats = aggregatedStats[key];
    if (!stats) {
      affectedIDs[key] = {};
      stats = aggregatedStats[key] = {
        key,
        instanceCount: 0,
        inclusiveRenderDuration: 0,
        renderCount: 0,
      };
    }
    affectedIDs[key][instanceID] = true;
    applyUpdate(stats);
  }

  data.forEach(flush => {
    let {measurements, operations} = flush;
    let isDefinitelyNotWastedByID = {};

    operations.forEach(operation => {
      let {instanceID} = operation;
      let nextParentID = instanceID;
      while (nextParentID) {
        isDefinitelyNotWastedByID[nextParentID] = true;
        nextParentID = treeSnapshot[nextParentID] ? treeSnapshot[nextParentID].parentID : null;
      }
    });

    let renderedCompositeIDs = {};
    measurements.forEach(measurement => {
      let {instanceID, timerType} = measurement;
      if (timerType !== 'render') {
        return;
      }
      renderedCompositeIDs[instanceID] = true;
    });

    measurements.forEach(measurement => {
      let {duration, instanceID, timerType} = measurement;
      const component = treeSnapshot[instanceID];
      if (!component) {
        return;
      }
      if (timerType !== 'render') {
        return;
      }

      let {updateCount} = component;
      if (isDefinitelyNotWastedByID[instanceID] || updateCount === 0) {
        return;
      }

      updateAggregatedStats(treeSnapshot, instanceID, stats => {
        stats.renderCount++;
      });

      let nextParentID = instanceID;
      while (nextParentID) {
        let isWasted =
          renderedCompositeIDs[nextParentID] &&
          !isDefinitelyNotWastedByID[nextParentID];
        if (isWasted) {
          updateAggregatedStats(treeSnapshot, nextParentID, stats => {
            stats.inclusiveRenderDuration += duration;
          });
        }
        nextParentID = treeSnapshot[nextParentID].parentID;
      }
    });
  });

  return Object.keys(aggregatedStats)
    .map(key => ({
      ...aggregatedStats[key],
      instanceCount: Object.keys(affectedIDs[key]).length,
    }))
    .sort((a, b) =>
      b.inclusiveRenderDuration - a.inclusiveRenderDuration
    );
}

function getExclusive(data = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  let aggregatedStats = {};
  let affectedIDs = {};

  const roots = Measurer.getRoots();
  const tree = Measurer.getTree();
  const treeSnapshot = getTreeSnapshot(roots, tree);

  function updateAggregatedStats(treeSnapshot, instanceID, timerType, applyUpdate) {
    const component = treeSnapshot[instanceID];
    if (!component) {
      return;
    }
    const {displayName} = component;
    const key = displayName;
    let stats = aggregatedStats[key];
    if (!stats) {
      affectedIDs[key] = {};
      stats = aggregatedStats[key] = {
        key,
        instanceCount: 0,
        counts: {},
        durations: {},
        totalDuration: 0,
      };
    }
    if (!stats.durations[timerType]) {
      stats.durations[timerType] = 0;
    }
    if (!stats.counts[timerType]) {
      stats.counts[timerType] = 0;
    }
    affectedIDs[key][instanceID] = true;
    applyUpdate(stats);
  }

  data.forEach(flush => {
    const {measurements} = flush;
    measurements.forEach(measurement => {
      const {duration, instanceID, timerType} = measurement;
      updateAggregatedStats(treeSnapshot, instanceID, timerType, stats => {
        stats.totalDuration += duration;
        stats.durations[timerType] += duration;
        stats.counts[timerType]++;
      });
    });
  });

  return Object.keys(aggregatedStats)
    .map(key => ({
      ...aggregatedStats[key],
      instanceCount: Object.keys(affectedIDs[key]).length,
    }))
    .sort((a, b) =>
      b.totalDuration - a.totalDuration
    );
}

function printInclusive() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const stats = getInclusive();

  const table = stats.map(item => {
    let {key, instanceCount, inclusiveRenderDuration, renderCount} = item;
    return {
      'Component': key,
      'Inclusive time (ms)': roundFloat(inclusiveRenderDuration),
      'Instance count': instanceCount
    };
  });
  console.table(table);
}

function printExclusive() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getExclusive();
  let table = stats.map(item => {
    let {key, instanceCount, totalDuration} = item;
    let renderCount = item.counts.render || 0;
    let renderDuration = item.durations.render || 0;
    return {
      'Component': key,
      'Total time (ms)': roundFloat(totalDuration),
      'Instance count': instanceCount,
      'Total render time (ms)': roundFloat(renderDuration),
      'Average render time (ms)': renderCount ?
        roundFloat(renderDuration / renderCount) :
        undefined,
      'Render count': renderCount,
      'Total lifecycle time (ms)': roundFloat(totalDuration - renderDuration),
    };
  });
  console.table(table);
}

function printOperations() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getOperations();
  let table = stats.map(stat => ({
    'Owner > Node': stat.key,
    'Operation': stat.type,
    'Payload': typeof stat.payload === 'object' ?
      JSON.stringify(stat.payload) :
      stat.payload,
    'Flush index': stat.flushIndex,
    'Owner Component ID': stat.parentID,
    'DOM Component ID': stat.instanceID,
  }));
  console.table(table);
}

function printWasted() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getWasted();
  let table = stats.map(item => {
    let {key, instanceCount, inclusiveRenderDuration, renderCount} = item;
    return {
      'Owner > Component': key,
      'wasted time (ms)': roundFloat(inclusiveRenderDuration),
      'Instance count': instanceCount,
      'Render count': renderCount,
    };
  });
  console.table(table);
}

export default {
  getLastMeasurements,
  getExclusive,
  getInclusive,
  getWasted,
  getOperations,

  printExclusive,
  printInclusive,
  printWasted,
  printOperations,

  start,
  stop,

  Measurer
};
