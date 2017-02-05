'use strict';

let alreadyWarned = false;

import DebugTool, { FlushHistory } from './DebugTool';

function roundFloat(val, base = 2) {
  const n = Math.pow(10, base);
  return Math.floor(val * n) / n;
}

function consoleTable(table) {
  console.table(table);
}

function getLastMeasurements() {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  return DebugTool.getFlushHistory();
}

function getExclusive(flushHistory = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  let aggregatedStats = {};
  let affectedIDs = {};

  function updateAggregatedStats(treeSnapshot, instanceID, timerType, applyUpdate) {
    const {displayName} = treeSnapshot[instanceID];
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

  flushHistory.forEach(flush => {
    const {measurements, treeSnapshot} = flush;
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

function getInclusive(flushHistory = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  let aggregatedStats = {};
  let affectedIDs = {};

  function updateAggregatedStats(treeSnapshot, instanceID, applyUpdate) {
    const {displayName, ownerID} = treeSnapshot[instanceID];
    const owner = treeSnapshot[ownerID];
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
  flushHistory.forEach(flush => {
    const {measurements} = flush;
    measurements.forEach(measurement => {
      const {instanceID, timerType} = measurement;
      if (timerType !== 'render') {
        return;
      }
      isCompositeByID[instanceID] = true;
    });
  });

  flushHistory.forEach(flush => {
    const {measurements, treeSnapshot} = flush;
    measurements.forEach(measurement => {
      const {duration, instanceID, timerType} = measurement;
      if (timerType !== 'render') {
        return;
      }
      updateAggregatedStats(treeSnapshot, instanceID, stats => {
        stats.renderCount++;
      });
      let nextParentID = instanceID;
      while (nextParentID) {
        if (isCompositeByID[nextParentID]) {
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

function getWasted(flushHistory = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  let aggregatedStats = {};
  let affectedIDs = {};

  function updateAggregatedStats(treeSnapshot, instanceID, applyUpdate) {
    let {displayName, ownerID} = treeSnapshot[instanceID];
    let owner = treeSnapshot[ownerID];
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

  flushHistory.forEach(flush => {
    let {measurements, treeSnapshot, operations} = flush;
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
      if (timerType !== 'render') {
        return;
      }

      let { updateCount } = treeSnapshot[instanceID];
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

function getOperations(flushHistory = getLastMeasurements()) {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  let stats = [];
  flushHistory.forEach((flush, flushIndex) => {
    let {operations, treeSnapshot} = flush;
    operations.forEach(operation => {
      let {instanceID, type, payload} = operation;
      let {displayName = '', ownerID = 0} = treeSnapshot[instanceID] || {};
      let owner = treeSnapshot[ownerID];
      let key = (owner ? owner.displayName + ' > ' : '') + displayName;

      stats.push({
        flushIndex,
        instanceID,
        key,
        type,
        ownerID,
        payload,
      });
    });
  });
  return stats;
}

function printExclusive(flushHistory) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getExclusive(flushHistory);
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
  consoleTable(table);
}

function printInclusive(flushHistory) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getInclusive(flushHistory);
  let table = stats.map(item => {
    let {key, instanceCount, inclusiveRenderDuration, renderCount} = item;
    return {
      'Owner > Component': key,
      'Inclusive render time (ms)': roundFloat(inclusiveRenderDuration),
      'Instance count': instanceCount,
      'Render count': renderCount,
    };
  });
  consoleTable(table);
}

function printWasted(flushHistory) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getWasted(flushHistory);
  let table = stats.map(item => {
    let {key, instanceCount, inclusiveRenderDuration, renderCount} = item;
    return {
      'Owner > Component': key,
      'wasted time (ms)': roundFloat(inclusiveRenderDuration),
      'Instance count': instanceCount,
      'Render count': renderCount,
    };
  });
  consoleTable(table);
}

function printOperations(flushHistory) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  let stats = getOperations(flushHistory);
  let table = stats.map(stat => ({
    'Owner > Node': stat.key,
    'Operation': stat.type,
    'Payload': typeof stat.payload === 'object' ?
      JSON.stringify(stat.payload) :
      stat.payload,
    'Flush index': stat.flushIndex,
    'Owner Component ID': stat.ownerID,
    'DOM Component ID': stat.instanceID,
  }));
  consoleTable(table);
}

let warnedAboutGetMeasurementsSummaryMap = false;
function getMeasurementsSummaryMap(measurements) {
  console.warn(
    warnedAboutGetMeasurementsSummaryMap,
    '`Perf.getMeasurementsSummaryMap(...)` is deprecated. Use ' +
    '`Perf.getWasted(...)` instead.'
  );
  warnedAboutGetMeasurementsSummaryMap = true;
  return getWasted(measurements);
}

function start() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  DebugTool.beginProfiling();
}

function stop() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  DebugTool.endProfiling();
}

function isRunning() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  return DebugTool.isProfiling();
}

let PerfAnalysis = {
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
  isRunning,
  getMeasurementsSummaryMap,
};

export default PerfAnalysis;
