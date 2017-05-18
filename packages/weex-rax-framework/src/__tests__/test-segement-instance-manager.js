/* eslint no-console:  "warn"  */
import SegmentInstanceManager from '../segment-instance-manager';

describe('functions of SegmentInstanceManager : ', () => { 
  test('SegmentInstanceManager is a Function', () => {
    expect(SegmentInstanceManager).toBeInstanceOf(Function);
  });

  test('SegmentInstanceManager.addFactoryFunc is a Function', () => {
    expect(SegmentInstanceManager.addFactoryFunc).toBeInstanceOf(Function);
  });

  test('SegmentInstanceManager.addDependents is a Function', () => {
    expect(SegmentInstanceManager.addDependents).toBeInstanceOf(Function);
  });

  test('SegmentInstanceManager.getFactoryFunc is a Function', () => {
    expect(SegmentInstanceManager.getFactoryFunc).toBeInstanceOf(Function);
  });
  
  test('SegmentInstanceManager.removeAll is a Function', () => {
    expect(SegmentInstanceManager.removeAll).toBeInstanceOf(Function);
  });
  
  test('SegmentInstanceManager.removeCell is a Function', () => {
    expect(SegmentInstanceManager.removeCell).toBeInstanceOf(Function);
  });
});

describe('test SegmentInstanceManager for createInstance : ', () => {

  let mockData = [{
    __weex_code__: 'console.log(\'nxType1 function\')',
    __weex_data__: {
      __nxType__: 'nxType1'
    }
  }, {
    __weex_code__: 'console.log(\'nxType2 function\')',
    __weex_data__: {
      __nxType__: 'nxType2'
    }
  }, {
    __weex_code__: 'console.log(\'no nxType function\')',
    __weex_data__: {
    }
  }, {
    __weex_code__: 'throw new Error(123)',
    __weex_data__: {
      __nxType__: 'nxType3'
    }
  }, {
    __weex_code__: '',
    __weex_data__: {
      __nxType__: 'nxType1'
    }
  }];

  mockData.forEach((data, index) => {

    (function(instanceId, __weex_code__, __weex_options__, __weex_data__, __weex_config__) {

      let nxType = typeof __weex_data__ !== 'undefined' && __weex_data__.__nxType__;

      let scriptStr = '"use strict";\n' + __weex_code__;

      scriptStr = 'with(this){(function(){"use strict";\n' + __weex_code__ + '\n}).call(this)}';
      
      let init;

      if (nxType) {

        let factoryFunc = SegmentInstanceManager.getFactoryFunc(nxType);

        if (typeof factoryFunc !== 'function') {

          SegmentInstanceManager.addFactoryFunc(nxType, new Function(scriptStr));
        
        }

        init = SegmentInstanceManager.getFactoryFunc(nxType);

        // 添加依赖
        SegmentInstanceManager.addDependents(nxType, instanceId);

      } 

      test((nxType || 'noType') + ' init toBe a function', () => {

        if (nxType) {
          expect(init).toBeInstanceOf(Function);
        } else {
          expect(init).toBeUndefined();
        }
          
      });

      if (typeof init === 'function') {
        try {
          init.call(
            // Context is window
            window,
          );
        } catch (e) {
          console.log('e', e);
        }
      }

      SegmentInstanceManager.echoInstanceMap();
      SegmentInstanceManager.echoInstancesDict();

    })(index, data.__weex_code__, null, data.__weex_data__);

  });

  test('test SegmentInstanceManager for destoryInstance: ', () => {
    
    [4, 3, 2, 1, 0].forEach((instanceId) => {
      SegmentInstanceManager.removeCell(instanceId);
    });

    console.log('after destory');

    SegmentInstanceManager.echoInstanceMap();
    SegmentInstanceManager.echoInstancesDict();

  });

});

