import assert from 'assert';
import * as framework from '../src/';
import {Document, Element} from './__mocks__/document';
import * as modules from './__mocks__/modules';
import components from './__mocks__/components';

let id = 3;
let code = `
  define("foo", function(require, exports, module){
    console.log(new Request());
    console.log(new Headers());
    console.log(new Response());
    fetch('http://path/to/api').then(function(response) {
      if (response.status != -1 && response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(function (data) {
      console.log(data);
    });
  });
  require("foo");
`;
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
  assert.equal(instanceId, id);
  assert.deepEqual(tasks, taskList[counter]);
  counter++;
};

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
  args: ['1', {status: 200, data: {'foo': '1'}, ok: true}, true]
}]);
