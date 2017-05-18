'use strict';
/* eslint no-console: "warn",  */

/**
 * instanceMap
 * @property {Object} ${instanceType}  - instanceType
 * @property {function} ${instanceType}.facotryfunc  - the factory function of this ${instanceType}
 * @property {Array} ${instanceType}.dependents  - the dependents Array of this ${instanceType}
 */
let instanceMap = {};

/**
 * instancesDict
 * @property {string} ${instanceId}  - instanceType of this instanceId
 */
let instancesDict = {};

class SegmentInstanceManager {

  static addFactoryFunc(instanceType, factoryFunc) {
    if (typeof instanceType !== 'undefined') {
      instanceMap[instanceType] = instanceMap[instanceType] || {};
      instanceMap[instanceType].factoryFunc = factoryFunc;
    }
  }

  static addDependents(instanceType, instanceId) {
    if (typeof instanceId !== 'undefined' && typeof instanceType !== 'undefined' && instanceMap[instanceType]) {
      instancesDict[instanceId] = instanceType;
      instanceMap[instanceType].dependents = instanceMap[instanceType].dependents || [];
      instanceMap[instanceType].dependents.push(instanceId);
    }
  }

  static getFactoryFunc(instanceType) {
    let factoryFunc;

    if ( typeof instanceType !== 'undefined' && typeof instanceMap[instanceType] !== 'undefined') {
      factoryFunc = instanceMap[instanceType].factoryFunc;
    }

    return factoryFunc;
  }
  
  static removeAll() {
    instanceMap = {};
    instancesDict = {};
  }

  static removeCell(instanceId) {

    if (typeof instanceId === 'undefined') return;
    // 根据 instanceId 取到当前的 instanceType;
    let instanceType = instancesDict[instanceId];

    if (!instanceType) {
      console.log('cannot find instanceType of ' + instanceId);
      return;
    }

    let instanceObj = instanceMap[instanceType];

    if (typeof instanceObj !== 'undefined' && Object.prototype.toString.call(instanceObj.dependents) === '[object Array]') {

      let index = instanceObj.dependents.indexOf(instanceId);
      
      if ( index !== -1) {
        // 删除当前 instanceType 的依赖
        instanceObj.dependents.splice(index, 1);
        delete instancesDict[instanceId];
      }

      // 所有实例都删除后删除工厂函数
      if (instanceObj.dependents.length === 0) {
        delete instanceMap[instanceType];
      }

    }

  }

  static echoInstanceMap() {
    console.log('instanceMap:', instanceMap);
  }

  static echoInstancesDict() {
    console.log('instancesDict:', instancesDict);
  }

}

export default SegmentInstanceManager;