import { isQuickapp } from 'universal-env';
import {
  COMPONENT_DID_MOUNT,
} from '../cycles';

export default function(data) {
  if (isQuickapp) {
    let $ready = false;
    const useSetData = {};

    for (let key in data) {
      if (diffData(this.state[key], data[key])) {
        useSetData[key] = data[key];
      }
    }

    if (!isEmptyObj(useSetData)) {
      $ready = useSetData.$ready;
    }

    Object.keys(useSetData).map(item => {
      if (!(item in this._internal)) {
        this._internal.$set(item, useSetData[item]);
      } else {
        this._internal[item] = useSetData[item];
      }
    });

    if ($ready) {
      // trigger did mount
      this._trigger(COMPONENT_DID_MOUNT);
    }
    let callback;
    while (callback = this._pendingCallbacks.pop()) {
      callback();
    }
  } else {
    const setDataTask = [];
    let $ready = false;
    // In alibaba miniapp can use $spliceData optimize long list
    if (this._internal.$spliceData) {
      const useSpliceData = {};
      const useSetData = {};
      for (let key in data) {
        if (Array.isArray(data[key]) && diffArray(this.state[key], data[key])) {
          useSpliceData[key] = [this.state[key].length, 0].concat(data[key].slice(this.state[key].length));
        } else {
          if (diffData(this.state[key], data[key])) {
            if (Object.prototype.toString.call(data[key]) === '[object Object]') {
              useSetData[key] = Object.assign({}, this.state[key], data[key]);
            } else {
              useSetData[key] = data[key];
            }
          }
        }
      }
      if (!isEmptyObj(useSetData)) {
        $ready = useSetData.$ready;
        setDataTask.push(new Promise(resolve => {
          this._internal.setData(useSetData, resolve);
        }));
      }
      if (!isEmptyObj(useSpliceData)) {
        setDataTask.push(new Promise(resolve => {
          this._internal.$spliceData(useSpliceData, resolve);
        }));
      }
    } else {
      setDataTask.push(new Promise(resolve => {
        $ready = data.$ready;
        this._internal.setData(data, resolve);
      }));
    }
    Promise.all(setDataTask).then(() => {
      if ($ready) {
        // trigger did mount
        this._trigger(COMPONENT_DID_MOUNT);
      }
      let callback;
      while (callback = this._pendingCallbacks.pop()) {
        callback();
      }
    });
  }
}

function isEmptyObj(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

function diffArray(prev, next) {
  if (!Array.isArray(prev)) return false;
  // Only concern about list append case
  if (next.length === 0) return false;
  if (prev.length === 0) return false;
  return next.slice(0, prev.length).every((val, index) => prev[index] === val);
}

function diffData(prevData, nextData) {
  const prevType = typeof prevData;
  const nextType = typeof nextData;
  if (prevType !== nextType) return true;
  if (prevType === 'object' && prevData !== null && nextData !== null) {
    const prevKeys = Object.keys(prevData);
    const nextKeys = Object.keys(nextData);
    if (prevKeys.length !== nextKeys.length) return true;
    if (prevKeys.length === 0) return false;
    return !prevKeys.every(key => prevData[key] === nextData[key] );
  } else {
    return prevData !== nextData;
  }
}
