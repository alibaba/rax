import assert from 'assert'
import * as framework from '../src/'
import {Document, Element} from './__mocks__/document'
import * as modules from './__mocks__/modules'
import components from './__mocks__/components'

let id = 'downgrade'
let code = `
  define("foo", function(require, exports, module){
    __weex_downgrade__({
      ios: {
        osVersion: '>1.0.0',
        appVersion: '>1.0.0',
        weexVersion: '>1.0.0',
        deviceModel: ['modelA', 'modelB']
      },
      android: {
        osVersion: '>1.0.0',
        appVersion: '>1.0.0',
        weexVersion: '>1.0.0',
        deviceModel: ['modelA', 'modelB']
      }
    });
  });
  require("foo");
`
let options = {
  bundleUrl: 'http://example.com',
  debug: true
};
let counter = 0;
let taskList = [
  [ { module: 'stream', method: 'fetch', args: [ {
      url: 'http://path/to/api',
      method: 'GET',
      header: undefined,
      type: 'json' }, '1', '2'] } ],
  [ { module: 'dom', method: 'updateFinish', args: [] } ]
];
let sendTasks = (instanceId, tasks) => {
  assert.equal(instanceId, id)
  assert.deepEqual(tasks, taskList[counter])
  counter++
};

framework.init({
  Document,
  Element,
  sendTasks: sendTasks,
})

framework.registerModules(modules)
framework.registerComponents(components)
framework.createInstance(id, code, options)

framework.receiveTasks(id, [{
  method: 'callback',
  args: ['1', {status: 200, data: {"foo": "1"}, ok: true}, true]
}])
