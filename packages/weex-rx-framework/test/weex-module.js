import assert from 'assert';
import * as framework from '../src/';
import {Document, Element} from './__mocks__/document';
import * as modules from './__mocks__/modules';
import components from './__mocks__/components';

let id = 10;
let code = `
  define("foo", function(require, exports, module){
    var modal = require("@weex-module/modal");
    modal.alert('hi', function(data){ console.log('alert callback data', data) });
    module.exports = "bar";
  });
  var foo = require("foo");
`;
let options = {
  bundleUrl: 'http://example.com',
  debug: true
};
let counter = 0;
let sendTasks = (instanceId, tasks) => {
  assert.equal(instanceId, id);
  assert.deepEqual(tasks, taskList[counter]);
  counter++;
};

let taskList = [
  [ { module: 'modal', method: 'alert', args: [ 'hi', '1' ] } ],
  [ { module: 'dom', method: 'updateFinish', args: [] } ]
];

framework.init({
  Document,
  Element,
  sendTasks: sendTasks,
});

framework.registerModules(modules);
framework.registerComponents(components);
framework.createInstance(id, code, options);
framework.receiveTasks(id, [{
  method: 'callback',
  args: ['1', {bar: 1}, true]
}]);
