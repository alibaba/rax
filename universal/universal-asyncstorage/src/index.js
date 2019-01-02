'use strict';

import {isWeex} from 'universal-env';

let storage = {};

if (isWeex) {
  storage = __weex_require__('@weex-module/storage');
} else if (typeof localStorage !== 'undefined' && localStorage) {
  storage = localStorage;
}

var AsyncStorage = {
  getItem: (key) => {
    return new Promise(function(resolve, reject) {
      if (storage.getItem) {
        if (isWeex) {
          storage.getItem(key, function({data, result}) {
            if (result === 'success') {
              resolve(data === undefined ? null : data);
            } else {
              reject(data);
            }
          });
        } else {
          let value = storage.getItem(key);
          resolve(value);
        }
      }
    });
  },
  setItem: function(key, value) {
    return new Promise(function(resolve, reject) {
      if (storage.setItem) {
        if (isWeex) {
          storage.setItem(key, value, function({data, result}) {
            if (result === 'success') {
              resolve(data);
            } else {
              reject(data);
            }
          });
        } else {
          storage.setItem(key, value);
          resolve(null);
        }
      }
    });
  },
  removeItem: function(key) {
    return new Promise(function(resolve, reject) {
      if (storage.removeItem) {
        if (isWeex) {
          storage.removeItem(key, function({data, result}) {
            if (result === 'success') {
              resolve(data);
            } else {
              reject(data);
            }
          });
        } else {
          storage.removeItem(key);
          resolve(null);
        }
      }
    });
  },
  getAllKeys: function() {
    return new Promise(function(resolve, reject) {
      if (isWeex) {
        storage.getAllKeys(function({data, result}) {
          if (result === 'success') {
            resolve(data);
          } else {
            reject(data);
          }
        });
      } else {
        if (storage.length) {
          resolve(Object.keys(storage));
        }
      }
    });
  },
  clear: function() {
    return new Promise(function(resolve, reject) {
      if (storage.clear) {
        storage.clear();
        resolve(null);
      } else {
        AsyncStorage.getAllKeys().then(function(keys) {
          Promise.all(keys.map((key) => {
            return AsyncStorage.removeItem(key);
          })).then(() => resolve(null)).catch(reject);
        });
      }
    });
  },
  length: function() {
    return new Promise(function(resolve, reject) {
      if (isWeex) {
        storage.length(function({data, result}) {
          if (result === 'success') {
            resolve(data);
          } else {
            reject(data);
          }
        });
      } else {
        if (storage.length != null) {
          resolve(storage.length);
        }
      }
    });
  }
};


export default AsyncStorage;
