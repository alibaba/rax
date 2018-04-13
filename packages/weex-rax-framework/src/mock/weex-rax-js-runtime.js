/* global define,callNative */
/* Weex JS Runtime 0.23.6, Build 2018-01-04 13:39. */

import {ModuleFactories} from './builtin';

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      global.WeexJSRuntime = factory();
}(this, function() {
  'use strict';

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /**
 * Get a unique id.
 */
  var nextNodeRef = 1;
  function uniqueId() {
    return (nextNodeRef++).toString();
  }

  function typof(v) {
    var s = Object.prototype.toString.call(v);
    return s.substring(8, s.length - 1);
  }

  function bufferToBase64(buffer) {
    if (typeof btoa !== 'function') {
      return '';
    }
    var string = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(code) {
        return String.fromCharCode(code);
      }
    ).join('');
    return btoa(string); // eslint-disable-line no-undef
  }

  function base64ToBuffer(base64) {
    if (typeof atob !== 'function') {
      return new ArrayBuffer(0);
    }
    var string = atob(base64); // eslint-disable-line no-undef
    var array = new Uint8Array(string.length);
    Array.prototype.forEach.call(string, function(ch, i) {
      array[i] = ch.charCodeAt(0);
    });
    return array.buffer;
  }

  /**
 * Detect if the param is falsy or empty
 * @param {any} any
 */
  function isEmpty(any) {
    if (!any || typeof any !== 'object') {
      return true;
    }

    for (var key in any) {
      if (Object.prototype.hasOwnProperty.call(any, key)) {
        return false;
      }
    }
    return true;
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /**
 * Normalize a primitive value.
 * @param  {any}        v
 * @return {primitive}
 */
  function normalizePrimitive(v) {
    var type = typof(v);

    switch (type) {
      case 'Undefined':
      case 'Null':
        return '';

      case 'RegExp':
        return v.toString();
      case 'Date':
        return v.toISOString();

      case 'Number':
      case 'String':
      case 'Boolean':
      case 'Array':
      case 'Object':
        return v;

      case 'ArrayBuffer':
        return {
          '@type': 'binary',
          dataType: type,
          base64: bufferToBase64(v)
        };

      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array':
        return {
          '@type': 'binary',
          dataType: type,
          base64: bufferToBase64(v.buffer)
        };

      default:
        return JSON.stringify(v);
    }
  }

  function decodePrimitive(data) {
    if (typof(data) === 'Object') {
    // decode base64 into binary
      if (data['@type'] && data['@type'] === 'binary') {
        return base64ToBuffer(data.base64 || '');
      }

      var realData = {};
      for (var key in data) {
        realData[key] = decodePrimitive(data[key]);
      }
      return realData;
    }
    if (typof(data) === 'Array') {
      return data.map(decodePrimitive);
    }
    return data;
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  function getHookKey(componentId, type, hookName) {
    return type + '@' + hookName + '#' + componentId;
  }

  /**
 * For general callback management of a certain Weex instance.
 * Because function can not passed into native, so we create callback
 * callback id for each function and pass the callback id into native
 * in fact. And when a callback called from native, we can find the real
 * callback through the callback id we have passed before.
 */
  var CallbackManager = function CallbackManager(instanceId) {
    this.instanceId = String(instanceId);
    this.lastCallbackId = 0;
    this.callbacks = {};
    this.hooks = {};
  };
  CallbackManager.prototype.add = function add(callback) {
    this.lastCallbackId++;
    this.callbacks[this.lastCallbackId] = callback;
    return this.lastCallbackId;
  };
  CallbackManager.prototype.remove = function remove(callbackId) {
    var callback = this.callbacks[callbackId];
    delete this.callbacks[callbackId];
    return callback;
  };
  CallbackManager.prototype.registerHook = function registerHook(componentId, type, hookName, hookFunction) {
  // TODO: validate arguments
    var key = getHookKey(componentId, type, hookName);
    if (this.hooks[key]) {
      console.warn('[JS Framework] Override an existing component hook "' + key + '".');
    }
    this.hooks[key] = hookFunction;
  };
  CallbackManager.prototype.triggerHook = function triggerHook(componentId, type, hookName, options) {
    if ( options === void 0 ) options = {};

    // TODO: validate arguments
    var key = getHookKey(componentId, type, hookName);
    var hookFunction = this.hooks[key];
    if (typeof hookFunction !== 'function') {
      console.error('[JS Framework] Invalid hook function type (' + typeof hookFunction + ') on "' + key + '".');
      return null;
    }
    var result = null;
    try {
      result = hookFunction.apply(null, options.args || []);
    } catch (e) {
      console.error('[JS Framework] Failed to execute the hook function on "' + key + '".');
    }
    return result;
  };
  CallbackManager.prototype.consume = function consume(callbackId, data, ifKeepAlive) {
    var callback = this.callbacks[callbackId];
    if (typeof ifKeepAlive === 'undefined' || ifKeepAlive === false) {
      delete this.callbacks[callbackId];
    }
    if (typeof callback === 'function') {
      return callback(decodePrimitive(data));
    }
    return new Error('invalid callback id "' + callbackId + '"');
  };
  CallbackManager.prototype.close = function close() {
    this.callbacks = {};
    this.hooks = {};
  };

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var docMap = {};

  /**
 * Add a document object into docMap.
 * @param {string} id
 * @param {object} document
 */
  function addDoc(id, doc) {
    if (id) {
      docMap[id] = doc;
    }
  }

  /**
 * Get the document object by id.
 * @param {string} id
 */
  function getDoc(id) {
    return docMap[id];
  }

  /**
 * Remove the document from docMap by id.
 * @param {string} id
 */
  function removeDoc(id) {
    delete docMap[id];
  }

  /**
 * @deprecated
 * Get listener by document id.
 * @param {string} id
 * @return {object} listener
 */


  /**
 * Get TaskCenter instance by id.
 * @param {string} id
 * @return {object} TaskCenter
 */
  function getTaskCenter(id) {
    var doc = docMap[id];
    if (doc && doc.taskCenter) {
      return doc.taskCenter;
    }
    return null;
  }

  /**
 * Append body node to documentElement.
 * @param {object} document
 * @param {object} node
 * @param {object} before
 */
  function appendBody(doc, node, before) {
    var documentElement = doc.documentElement;

    if (documentElement.pureChildren.length > 0 || node.parentNode) {
      return;
    }
    var children = documentElement.children;
    var beforeIndex = children.indexOf(before);
    if (beforeIndex < 0) {
      children.push(node);
    } else {
      children.splice(beforeIndex, 0, node);
    }

    if (node.nodeType === 1) {
      if (node.role === 'body') {
        node.docId = doc.id;
        node.ownerDocument = doc;
        node.parentNode = documentElement;
        linkParent(node, documentElement);
      } else {
        node.children.forEach(function(child) {
          child.parentNode = node;
        });
        setBody(doc, node);
        node.docId = doc.id;
        node.ownerDocument = doc;
        linkParent(node, documentElement);
        delete doc.nodeMap[node.nodeId];
      }
      documentElement.pureChildren.push(node);
      sendBody(doc, node);
    } else {
      node.parentNode = documentElement;
      doc.nodeMap[node.ref] = node;
    }
  }

  function sendBody(doc, node) {
    var body = node.toJSON();
    if (doc && doc.taskCenter && typeof doc.taskCenter.send === 'function') {
      doc.taskCenter.send('dom', { action: 'createBody' }, [body]);
    }
  }

  /**
 * Set up body node.
 * @param {object} document
 * @param {object} element
 */
  function setBody(doc, el) {
    el.role = 'body';
    el.depth = 1;
    delete doc.nodeMap[el.nodeId];
    el.ref = '_root';
    doc.nodeMap._root = el;
    doc.body = el;
  }

  /**
 * Establish the connection between parent and child node.
 * @param {object} child node
 * @param {object} parent node
 */
  function linkParent(node, parent) {
    node.parentNode = parent;
    if (parent.docId) {
      node.docId = parent.docId;
      node.ownerDocument = parent.ownerDocument;
      node.ownerDocument.nodeMap[node.nodeId] = node;
      node.depth = parent.depth + 1;
    }
    node.children.forEach(function(child) {
      linkParent(child, node);
    });
  }

  /**
 * Get the next sibling element.
 * @param {object} node
 */
  function nextElement(node) {
    while (node) {
      if (node.nodeType === 1) {
        return node;
      }
      node = node.nextSibling;
    }
  }

  /**
 * Get the previous sibling element.
 * @param {object} node
 */
  function previousElement(node) {
    while (node) {
      if (node.nodeType === 1) {
        return node;
      }
      node = node.previousSibling;
    }
  }

  /**
 * Insert a node into list at the specified index.
 * @param {object} target node
 * @param {array} list
 * @param {number} newIndex
 * @param {boolean} changeSibling
 * @return {number} newIndex
 */
  function insertIndex(target, list, newIndex, changeSibling) {
  /* istanbul ignore next */
    if (newIndex < 0) {
      newIndex = 0;
    }
    var before = list[newIndex - 1];
    var after = list[newIndex];
    list.splice(newIndex, 0, target);
    if (changeSibling) {
      before && (before.nextSibling = target);
      target.previousSibling = before;
      target.nextSibling = after;
      after && (after.previousSibling = target);
    }
    return newIndex;
  }

  /**
 * Move the node to a new index in list.
 * @param {object} target node
 * @param {array} list
 * @param {number} newIndex
 * @param {boolean} changeSibling
 * @return {number} newIndex
 */
  function moveIndex(target, list, newIndex, changeSibling) {
    var index = list.indexOf(target);
    /* istanbul ignore next */
    if (index < 0) {
      return -1;
    }
    if (changeSibling) {
      var before = list[index - 1];
      var after = list[index + 1];
      before && (before.nextSibling = after);
      after && (after.previousSibling = before);
    }
    list.splice(index, 1);
    var newIndexAfter = newIndex;
    if (index <= newIndex) {
      newIndexAfter = newIndex - 1;
    }
    var beforeNew = list[newIndexAfter - 1];
    var afterNew = list[newIndexAfter];
    list.splice(newIndexAfter, 0, target);
    if (changeSibling) {
      beforeNew && (beforeNew.nextSibling = target);
      target.previousSibling = beforeNew;
      target.nextSibling = afterNew;
      afterNew && (afterNew.previousSibling = target);
    }
    if (index === newIndexAfter) {
      return -1;
    }
    return newIndex;
  }

  /**
 * Remove the node from list.
 * @param {object} target node
 * @param {array} list
 * @param {boolean} changeSibling
 */
  function removeIndex(target, list, changeSibling) {
    var index = list.indexOf(target);
    /* istanbul ignore next */
    if (index < 0) {
      return;
    }
    if (changeSibling) {
      var before = list[index - 1];
      var after = list[index + 1];
      before && (before.nextSibling = after);
      after && (after.previousSibling = before);
    }
    list.splice(index, 1);
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var Node = function Node() {
    this.nodeId = uniqueId();
    this.ref = this.nodeId;
    this.children = [];
    this.pureChildren = [];
    this.parentNode = null;
    this.nextSibling = null;
    this.previousSibling = null;
  };

  /**
* Destroy current node, and remove itself form nodeMap.
*/
  Node.prototype.destroy = function destroy() {
    var doc = getDoc(this.docId);
    if (doc) {
      delete this.docId;
      delete doc.nodeMap[this.nodeId];
    }
    this.children.forEach(function(child) {
      child.destroy();
    });
  };

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
  var Element$2;

  function setElement(El) {
    Element$2 = El;
  }

  /**
 * A map which stores all type of elements.
 * @type {Object}
 */
  var registeredElements = {};

  /**
 * Register an extended element type with component methods.
 * @param  {string} type    component type
 * @param  {array}  methods a list of method names
 */
  function registerElement(type, methods) {
  // Skip when no special component methods.
    if (!methods || !methods.length) {
      return;
    }

    // Init constructor.
    var WeexElement = (function(Element) {
      function WeexElement() {
        Element.apply(this, arguments);
      } if ( Element ) WeexElement.__proto__ = Element;
      WeexElement.prototype = Object.create( Element && Element.prototype );
      WeexElement.prototype.constructor = WeexElement;


      return WeexElement;
    }(Element$2));

    // Add methods to prototype.
    methods.forEach(function(methodName) {
      WeexElement.prototype[methodName] = function() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var taskCenter = getTaskCenter(this.docId);
        if (taskCenter) {
          return taskCenter.send('component', {
            ref: this.ref,
            component: type,
            method: methodName
          }, args);
        }
      };
    });

    // Add to element type map.
    registeredElements[type] = WeexElement;
  }


  function getWeexElement(type) {
    return registeredElements[type];
  }


  /**
 * Clear all element types. Only for testing.
 */

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var DEFAULT_TAG_NAME = 'div';
  var BUBBLE_EVENTS = [
    'click', 'longpress', 'touchstart', 'touchmove', 'touchend',
    'panstart', 'panmove', 'panend', 'horizontalpan', 'verticalpan', 'swipe'
  ];

  function registerNode(docId, node) {
    var doc = getDoc(docId);
    doc.nodeMap[node.nodeId] = node;
  }

  var Element = (function(Node$$1) {
    function Element(type, props, isExtended) {
      if ( type === void 0 ) type = DEFAULT_TAG_NAME;

      Node$$1.call(this);

      var WeexElement = getWeexElement(type);
      if (WeexElement && !isExtended) {
        return new WeexElement(type, props, true);
      }

      props = props || {};
      this.nodeType = 1;
      this.nodeId = uniqueId();
      this.ref = this.nodeId;
      this.type = type;
      this.attr = props.attr || {};
      this.style = props.style || {};
      this.classStyle = props.classStyle || {};
      this.classList = props.classList || [];
      this.event = {};
      this.children = [];
      this.pureChildren = [];
    }

    if ( Node$$1 ) Element.__proto__ = Node$$1;
    Element.prototype = Object.create( Node$$1 && Node$$1.prototype );
    Element.prototype.constructor = Element;

    /**
   * Append a child node.
   * @param {object} node
   * @return {undefined | number} the signal sent by native
   */
    Element.prototype.appendChild = function appendChild(node) {
      if (node.parentNode && node.parentNode !== this) {
        return;
      }
      /* istanbul ignore else */
      if (!node.parentNode) {
        linkParent(node, this);
        insertIndex(node, this.children, this.children.length, true);
        if (this.docId) {
          registerNode(this.docId, node);
        }
        if (node.nodeType === 1) {
          insertIndex(node, this.pureChildren, this.pureChildren.length);
          var taskCenter = getTaskCenter(this.docId);
          if (taskCenter) {
            return taskCenter.send(
              'dom',
              { action: 'addElement' },
              [this.ref, node.toJSON(), -1]
            );
          }
        }
      } else {
        moveIndex(node, this.children, this.children.length, true);
        if (node.nodeType === 1) {
          var index = moveIndex(node, this.pureChildren, this.pureChildren.length);
          var taskCenter$1 = getTaskCenter(this.docId);
          if (taskCenter$1 && index >= 0) {
            return taskCenter$1.send(
              'dom',
              { action: 'moveElement' },
              [node.ref, this.ref, index]
            );
          }
        }
      }
    };

    /**
   * Insert a node before specified node.
   * @param {object} node
   * @param {object} before
   * @return {undefined | number} the signal sent by native
   */
    Element.prototype.insertBefore = function insertBefore(node, before) {
      if (node.parentNode && node.parentNode !== this) {
        return;
      }
      if (node === before || node.nextSibling && node.nextSibling === before) {
        return;
      }
      if (!node.parentNode) {
        linkParent(node, this);
        insertIndex(node, this.children, this.children.indexOf(before), true);
        if (this.docId) {
          registerNode(this.docId, node);
        }
        if (node.nodeType === 1) {
          var pureBefore = nextElement(before);
          var index = insertIndex(
            node,
            this.pureChildren,
            pureBefore
              ? this.pureChildren.indexOf(pureBefore)
              : this.pureChildren.length
          );
          var taskCenter = getTaskCenter(this.docId);
          if (taskCenter) {
            return taskCenter.send(
              'dom',
              { action: 'addElement' },
              [this.ref, node.toJSON(), index]
            );
          }
        }
      } else {
        moveIndex(node, this.children, this.children.indexOf(before), true);
        if (node.nodeType === 1) {
          var pureBefore$1 = nextElement(before);
          /* istanbul ignore next */
          var index$1 = moveIndex(
            node,
            this.pureChildren,
            pureBefore$1
              ? this.pureChildren.indexOf(pureBefore$1)
              : this.pureChildren.length
          );
          var taskCenter$1 = getTaskCenter(this.docId);
          if (taskCenter$1 && index$1 >= 0) {
            return taskCenter$1.send(
              'dom',
              { action: 'moveElement' },
              [node.ref, this.ref, index$1]
            );
          }
        }
      }
    };

    /**
   * Insert a node after specified node.
   * @param {object} node
   * @param {object} after
   * @return {undefined | number} the signal sent by native
   */
    Element.prototype.insertAfter = function insertAfter(node, after) {
      if (node.parentNode && node.parentNode !== this) {
        return;
      }
      if (node === after || node.previousSibling && node.previousSibling === after) {
        return;
      }
      if (!node.parentNode) {
        linkParent(node, this);
        insertIndex(node, this.children, this.children.indexOf(after) + 1, true);
        /* istanbul ignore else */
        if (this.docId) {
          registerNode(this.docId, node);
        }
        if (node.nodeType === 1) {
          var index = insertIndex(
            node,
            this.pureChildren,
            this.pureChildren.indexOf(previousElement(after)) + 1
          );
          var taskCenter = getTaskCenter(this.docId);
          /* istanbul ignore else */
          if (taskCenter) {
            return taskCenter.send(
              'dom',
              { action: 'addElement' },
              [this.ref, node.toJSON(), index]
            );
          }
        }
      } else {
        moveIndex(node, this.children, this.children.indexOf(after) + 1, true);
        if (node.nodeType === 1) {
          var index$1 = moveIndex(
            node,
            this.pureChildren,
            this.pureChildren.indexOf(previousElement(after)) + 1
          );
          var taskCenter$1 = getTaskCenter(this.docId);
          if (taskCenter$1 && index$1 >= 0) {
            return taskCenter$1.send(
              'dom',
              { action: 'moveElement' },
              [node.ref, this.ref, index$1]
            );
          }
        }
      }
    };

    /**
   * Remove a child node, and decide whether it should be destroyed.
   * @param {object} node
   * @param {boolean} preserved
   */
    Element.prototype.removeChild = function removeChild(node, preserved) {
      if (node.parentNode) {
        removeIndex(node, this.children, true);
        if (node.nodeType === 1) {
          removeIndex(node, this.pureChildren);
          var taskCenter = getTaskCenter(this.docId);
          if (taskCenter) {
            taskCenter.send(
              'dom',
              { action: 'removeElement' },
              [node.ref]
            );
          }
        }
      }
      if (!preserved) {
        node.destroy();
      }
    };

    /**
   * Clear all child nodes.
   */
    Element.prototype.clear = function clear() {
      var taskCenter = getTaskCenter(this.docId);
      /* istanbul ignore else */
      if (taskCenter) {
        this.pureChildren.forEach(function(node) {
          taskCenter.send(
            'dom',
            { action: 'removeElement' },
            [node.ref]
          );
        });
      }
      this.children.forEach(function(node) {
        node.destroy();
      });
      this.children.length = 0;
      this.pureChildren.length = 0;
    };

    /**
   * Set an attribute, and decide whether the task should be send to native.
   * @param {string} key
   * @param {string | number} value
   * @param {boolean} silent
   */
    Element.prototype.setAttr = function setAttr(key, value, silent) {
      if (this.attr[key] === value && silent !== false) {
        return;
      }
      this.attr[key] = value;
      var taskCenter = getTaskCenter(this.docId);
      if (!silent && taskCenter) {
        var result = {};
        result[key] = value;
        taskCenter.send(
          'dom',
          { action: 'updateAttrs' },
          [this.ref, result]
        );
      }
    };

    /**
   * Set batched attributes.
   * @param {object} batchedAttrs
   * @param {boolean} silent
   */
    Element.prototype.setAttrs = function setAttrs(batchedAttrs, silent) {
      var this$1 = this;

      if (isEmpty(batchedAttrs)) {
        return;
      }
      var mutations = {};
      for (var key in batchedAttrs) {
        if (this$1.attr[key] !== batchedAttrs[key]) {
          this$1.attr[key] = batchedAttrs[key];
          mutations[key] = batchedAttrs[key];
        }
      }
      if (!isEmpty(mutations)) {
        var taskCenter = getTaskCenter(this.docId);
        if (!silent && taskCenter) {
          taskCenter.send(
            'dom',
            { action: 'updateAttrs' },
            [this.ref, mutations]
          );
        }
      }
    };

    /**
   * Set a style property, and decide whether the task should be send to native.
   * @param {string} key
   * @param {string | number} value
   * @param {boolean} silent
   */
    Element.prototype.setStyle = function setStyle(key, value, silent) {
      if (this.style[key] === value && silent !== false) {
        return;
      }
      this.style[key] = value;
      var taskCenter = getTaskCenter(this.docId);
      if (!silent && taskCenter) {
        var result = {};
        result[key] = value;
        taskCenter.send(
          'dom',
          { action: 'updateStyle' },
          [this.ref, result]
        );
      }
    };

    /**
   * Set batched style properties.
   * @param {object} batchedStyles
   * @param {boolean} silent
   */
    Element.prototype.setStyles = function setStyles(batchedStyles, silent) {
      var this$1 = this;

      if (isEmpty(batchedStyles)) {
        return;
      }
      var mutations = {};
      for (var key in batchedStyles) {
        if (this$1.style[key] !== batchedStyles[key]) {
          this$1.style[key] = batchedStyles[key];
          mutations[key] = batchedStyles[key];
        }
      }
      if (!isEmpty(mutations)) {
        var taskCenter = getTaskCenter(this.docId);
        if (!silent && taskCenter) {
          taskCenter.send(
            'dom',
            { action: 'updateStyle' },
            [this.ref, mutations]
          );
        }
      }
    };

    /**
   * TODO: deprecated
   * Set style properties from class.
   * @param {object} classStyle
   */
    Element.prototype.setClassStyle = function setClassStyle(classStyle) {
      var this$1 = this;

      // reset previous class style to empty string
      for (var key in this$1.classStyle) {
        this$1.classStyle[key] = '';
      }

      Object.assign(this.classStyle, classStyle);
      var taskCenter = getTaskCenter(this.docId);
      if (taskCenter) {
        taskCenter.send(
          'dom',
          { action: 'updateStyle' },
          [this.ref, this.toStyle()]
        );
      }
    };

    /**
   * Set class list.
   * @param {array} classList
   */
    Element.prototype.setClassList = function setClassList(classList) {
      var classes = typeof classList === 'string'
        ? classList.split(/\s+/)
        : Array.from(classList);
      if (Array.isArray(classes) && classes.length > 0) {
        this.classList = classes;
        var taskCenter = getTaskCenter(this.docId);
        if (taskCenter) {
          taskCenter.send(
            'dom',
            { action: 'updateClassList' },
            [this.ref, this.classList.slice()]
          );
        }
      }
    };

    /**
   * Add an event handler.
   * @param {string} event type
   * @param {function} event handler
   */
    Element.prototype.addEvent = function addEvent(type, handler, params) {
      if (!this.event) {
        this.event = {};
      }
      if (!this.event[type]) {
        this.event[type] = { handler: handler, params: params };
        var taskCenter = getTaskCenter(this.docId);
        if (taskCenter) {
          taskCenter.send(
            'dom',
            { action: 'addEvent' },
            [this.ref, type]
          );
        }
      }
    };

    /**
   * Remove an event handler.
   * @param {string} event type
   */
    Element.prototype.removeEvent = function removeEvent(type) {
      if (this.event && this.event[type]) {
        delete this.event[type];
        var taskCenter = getTaskCenter(this.docId);
        if (taskCenter) {
          taskCenter.send(
            'dom',
            { action: 'removeEvent' },
            [this.ref, type]
          );
        }
      }
    };

    /**
   * Fire an event manually.
   * @param {string} type type
   * @param {function} event handler
   * @param {boolean} isBubble whether or not event bubble
   * @param {boolean} options
   * @return {} anything returned by handler function
   */
    Element.prototype.fireEvent = function fireEvent(type, event, isBubble, options) {
      var result = null;
      var isStopPropagation = false;
      var eventDesc = this.event[type];
      if (eventDesc && event) {
        var handler = eventDesc.handler;
        event.stopPropagation = function() {
          isStopPropagation = true;
        };
        if (options && options.params) {
          result = handler.call.apply(handler, [ this ].concat( options.params, [event] ));
        } else {
          result = handler.call(this, event);
        }
      }

      if (!isStopPropagation
      && isBubble
      && BUBBLE_EVENTS.indexOf(type) !== -1
      && this.parentNode
      && this.parentNode.fireEvent) {
        event.currentTarget = this.parentNode;
        this.parentNode.fireEvent(type, event, isBubble); // no options
      }

      return result;
    };

    /**
   * Get all styles of current element.
   * @return {object} style
   */
    Element.prototype.toStyle = function toStyle() {
      return Object.assign({}, this.classStyle, this.style);
    };

    /**
   * Convert current element to JSON like object.
   * @return {object} element
   */
    Element.prototype.toJSON = function toJSON() {
      var this$1 = this;

      var result = {
        ref: this.ref.toString(),
        type: this.type
      };
      if (!isEmpty(this.attr)) {
        result.attr = this.attr;
      }
      if (this.classList.length > 0) {
        result.classList = this.classList.slice();
      }
      var style = this.toStyle();
      if (!isEmpty(style)) {
        result.style = style;
      }
      var event = [];
      for (var type in this$1.event) {
        var ref = this$1.event[type];
        var params = ref.params;
        if (!params) {
          event.push(type);
        } else {
          event.push({ type: type, params: params });
        }
      }
      if (event.length) {
        result.event = event;
      }
      if (this.pureChildren.length) {
        result.children = this.pureChildren.map(function(child) {
          return child.toJSON();
        });
      }
      return result;
    };

    /**
   * Convert to HTML element tag string.
   * @return {stirng} html
   */
    Element.prototype.toString = function toString() {
      return '<' + this.type +
    ' attr=' + JSON.stringify(this.attr) +
    ' style=' + JSON.stringify(this.toStyle()) + '>' +
    this.pureChildren.map(function(child) {
      return child.toString();
    }).join('') +
    '</' + this.type + '>';
    };

    return Element;
  }(Node));

  setElement(Element);

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var fallback = function() {};

  // The API of TaskCenter would be re-design.
  var TaskCenter = function TaskCenter(id, sendTasks) {
    Object.defineProperty(this, 'instanceId', {
      enumerable: true,
      value: String(id)
    });
    Object.defineProperty(this, 'callbackManager', {
      enumerable: true,
      value: new CallbackManager(id)
    });
    fallback = sendTasks || function() {};
  };

  TaskCenter.prototype.callback = function callback(callbackId, data, ifKeepAlive) {
    return this.callbackManager.consume(callbackId, data, ifKeepAlive);
  };

  TaskCenter.prototype.registerHook = function registerHook() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return (ref = this.callbackManager).registerHook.apply(ref, args);
    var ref;
  };

  TaskCenter.prototype.triggerHook = function triggerHook() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return (ref = this.callbackManager).triggerHook.apply(ref, args);
    var ref;
  };

  TaskCenter.prototype.updateData = function updateData(componentId, newData, callback) {
    this.send('module', {
      module: 'dom',
      method: 'updateComponentData'
    }, [componentId, newData, callback]);
  };

  TaskCenter.prototype.destroyCallback = function destroyCallback() {
    return this.callbackManager.close();
  };

  /**
 * Normalize a value. Specially, if the value is a function, then generate a function id
 * and save it to `CallbackManager`, at last return the function id.
 * @param{any}      v
 * @return {primitive}
 */
  TaskCenter.prototype.normalize = function normalize(v) {
    var type = typof(v);
    if (v && v instanceof Element) {
      return v.ref;
    }
    if (v && v._isVue && v.$el instanceof Element) {
      return v.$el.ref;
    }
    if (type === 'Function') {
      return this.callbackManager.add(v).toString();
    }
    return normalizePrimitive(v);
  };

  TaskCenter.prototype.send = function send(type, params, args, options) {
    var this$1 = this;

    var action = params.action;
    var component = params.component;
    var ref = params.ref;
    var module = params.module;
    var method = params.method;

    args = args.map(function(arg) {
      return this$1.normalize(arg);
    });

    switch (type) {
      case 'dom':
        return this[action](this.instanceId, args);
      case 'component':
        return this.componentHandler(this.instanceId, ref, method, args, Object.assign({ component: component }, options));
      default:
        return this.moduleHandler(this.instanceId, module, method, args, options);
    }
  };

  TaskCenter.prototype.callDOM = function callDOM(action, args) {
    return this[action](this.instanceId, args);
  };

  TaskCenter.prototype.callComponent = function callComponent(ref, method, args, options) {
    return this.componentHandler(this.instanceId, ref, method, args, options);
  };

  TaskCenter.prototype.callModule = function callModule(module, method, args, options) {
    return this.moduleHandler(this.instanceId, module, method, args, options);
  };

  function init$1() {
    var DOM_METHODS = {
      createFinish: global.callCreateFinish,
      updateFinish: global.callUpdateFinish,
      refreshFinish: global.callRefreshFinish,

      createBody: global.callCreateBody,
      registerStyleSheets: global.callRegisterStyleSheets,
      addElement: global.callAddElement,
      removeElement: global.callRemoveElement,
      moveElement: global.callMoveElement,
      updateAttrs: global.callUpdateAttrs,
      updateStyle: global.callUpdateStyle,
      updateClassList: global.callUpdateClassList,

      addEvent: global.callAddEvent,
      removeEvent: global.callRemoveEvent
    };
    var proto = TaskCenter.prototype;

    var loop = function( name ) {
      var method = DOM_METHODS[name];
      proto[name] = method ?
        function(id, args) {
          return method.apply(void 0, [ id ].concat( args ));
        } :
        function(id, args) {
          return fallback(id, [{ module: 'dom', method: name, args: args }], '-1');
        };
    };

    for (var name in DOM_METHODS) loop( name );

    proto.componentHandler = global.callNativeComponent ||
    function(id, ref, method, args, options) {
      return fallback(id, [{ component: options.component, ref: ref, method: method, args: args }]);
    };

    proto.moduleHandler = global.callNativeModule ||
    function(id, module, method, args) {
      return fallback(id, [{ module: module, method: method, args: args }]);
    };
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  function fireEvent(document, nodeId, type, event, domChanges, params) {
    var el = document.getRef(nodeId);
    if (el) {
      return document.fireEvent(el, type, event, domChanges, params);
    }
    return new Error('invalid element reference "' + nodeId + '"');
  }

  function callback(document, callbackId, data, ifKeepAlive) {
    return document.taskCenter.callback(callbackId, data, ifKeepAlive);
  }

  function componentHook(document, componentId, type, hook, options) {
    if (!document || !document.taskCenter) {
      console.error("[JS Framework] Can't find \"document\" or \"taskCenter\".");
      return null;
    }
    var result = null;
    try {
      result = document.taskCenter.triggerHook(componentId, type, hook, options);
    } catch (e) {
      console.error('[JS Framework] Failed to trigger the "' + type + '@' + hook + '" hook on ' + componentId + '.');
    }
    return result;
  }

  /**
 * Accept calls from native (event or callback).
 *
 * @param  {string} id
 * @param  {array} tasks list with `method` and `args`
 */
  function receiveTasks(id, tasks) {
    var document = getDoc(id);
    if (!document) {
      return new Error('[JS Framework] Failed to receiveTasks, '
      + 'instance (' + id + ') is not available.');
    }
    if (Array.isArray(tasks)) {
      return tasks.map(function(task) {
        switch (task.method) {
          case 'callback': return callback.apply(void 0, [ document ].concat( task.args ));
          case 'fireEventSync':
          case 'fireEvent': return fireEvent.apply(void 0, [ document ].concat( task.args ));
          case 'componentHook': return componentHook.apply(void 0, [ document ].concat( task.args ));
        }
      });
    }
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var weexModules = {};

  /**
 * Register native modules information.
 * @param {object} newModules
 */
  function registerModules(newModules) {
    var loop = function( name ) {
      if (!weexModules[name]) {
        weexModules[name] = {};
      }
      newModules[name].forEach(function(method) {
        if (typeof method === 'string') {
          weexModules[name][method] = true;
        } else {
          weexModules[name][method.name] = method.args;
        }
      });
    };

    for (var name in newModules) loop( name );
  }

  /**
 * Check whether the module or the method has been registered.
 * @param {String} module name
 * @param {String} method name (optional)
 */
  function isRegisteredModule(name, method) {
    if (typeof method === 'string') {
      return !!(weexModules[name] && weexModules[name][method]);
    }
    return !!weexModules[name];
  }

  function getModuleDescription(name) {
    return weexModules[name];
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var weexComponents = {};

  /**
 * Register native components information.
 * @param {array} newComponents
 */
  function registerComponents(newComponents) {
    if (Array.isArray(newComponents)) {
      newComponents.forEach(function(component) {
        if (!component) {
          return;
        }
        if (typeof component === 'string') {
          weexComponents[component] = true;
        } else if (typeof component === 'object' && typeof component.type === 'string') {
          weexComponents[component.type] = component;
          registerElement(component.type, component.methods);
        }
      });
    }
  }

  /**
 * Check whether the component has been registered.
 * @param {String} component name
 */
  function isRegisteredComponent(name) {
    return !!weexComponents[name];
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  // JS Services

  var services = [];

  /**
 * Register a JavaScript service.
 * A JavaScript service options could have a set of lifecycle methods
 * for each Weex instance. For example: create, refresh, destroy.
 * For the JS framework maintainer if you want to supply some features
 * which need to work well in different Weex instances, even in different
 * frameworks separately. You can make a JavaScript service to init
 * its variables or classes for each Weex instance when it's created
 * and recycle them when it's destroyed.
 * @param {object} options Could have { create, refresh, destroy }
 *                         lifecycle methods. In create method it should
 *                         return an object of what variables or classes
 *                         would be injected into the Weex instance.
 */
  function register(name, options) {
    if (has(name)) {
      console.warn('Service "' + name + '" has been registered already!');
    } else {
      options = Object.assign({}, options);
      services.push({ name: name, options: options });
    }
  }

  /**
 * Unregister a JavaScript service by name
 * @param {string} name
 */
  function unregister(name) {
    services.some(function(service, index) {
      if (service.name === name) {
        services.splice(index, 1);
        return true;
      }
    });
  }

  /**
 * Check if a JavaScript service with a certain name existed.
 * @param  {string}  name
 * @return {Boolean}
 */
  function has(name) {
    return indexOf(name) >= 0;
  }

  /**
 * Find the index of a JavaScript service by name
 * @param  {string} name
 * @return {number}
 */
  function indexOf(name) {
    return services.map(function(service) {
      return service.name;
    }).indexOf(name);
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  function track(id, type, value) {
    var taskCenter = getTaskCenter(id);
    if (!taskCenter || typeof taskCenter.send !== 'function') {
      console.error('[JS Framework] Failed to create tracker!');
      return;
    }
    if (!type || !value) {
      console.warn('[JS Framework] Invalid track type (' + type + ') or value (' + value + ')');
      return;
    }
    var label = 'jsfm.' + type + '.' + value;
    try {
      if (isRegisteredModule('userTrack', 'addPerfPoint')) {
        var message = Object.create(null);
        message[label] = '4';
        taskCenter.send('module', {
          module: 'userTrack',
          method: 'addPerfPoint'
        }, [message]);
      }
    } catch (err) {
      console.error('[JS Framework] Failed to trace "' + label + '"!');
    }
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var Comment = (function(Node$$1) {
    function Comment(value) {
      Node$$1.call(this);

      this.nodeType = 8;
      this.nodeId = uniqueId();
      this.ref = this.nodeId;
      this.type = 'comment';
      this.value = value;
      this.children = [];
      this.pureChildren = [];
    }

    if ( Node$$1 ) Comment.__proto__ = Node$$1;
    Comment.prototype = Object.create( Node$$1 && Node$$1.prototype );
    Comment.prototype.constructor = Comment;

    /**
  * Convert to HTML comment string.
  * @return {stirng} html
  */
    Comment.prototype.toString = function toString() {
      return '<!-- ' + this.value + ' -->';
    };

    return Comment;
  }(Node));

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /**
* Create the action object.
* @param {string} name
* @param {array} arguments
* @return {object} action
*/
  function createAction(name, args) {
    if ( args === void 0 ) args = [];

    return { module: 'dom', method: name, args: args };
  }

  var Listener = function Listener(id, handler) {
    this.id = id;
    this.batched = false;
    this.updates = [];
    if (typeof handler === 'function') {
      Object.defineProperty(this, 'handler', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: handler
      });
    } else {
      console.error('[JS Runtime] invalid parameter, handler must be a function');
    }
  };

  /**
 * Send the "createFinish" signal.
 * @param {function} callback
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.createFinish = function createFinish(callback) {
    var handler = this.handler;
    return handler([createAction('createFinish')], callback);
  };

  /**
 * Send the "updateFinish" signal.
 * @param {function} callback
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.updateFinish = function updateFinish(callback) {
    var handler = this.handler;
    return handler([createAction('updateFinish')], callback);
  };

  /**
 * Send the "refreshFinish" signal.
 * @param {function} callback
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.refreshFinish = function refreshFinish(callback) {
    var handler = this.handler;
    return handler([createAction('refreshFinish')], callback);
  };

  /**
 * Send the "createBody" signal.
 * @param {object} element
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.createBody = function createBody(element) {
    var body = element.toJSON();
    var children = body.children;
    delete body.children;
    var actions = [createAction('createBody', [body])];
    if (children) {
      actions.push.apply(actions, children.map(function(child) {
        return createAction('addElement', [body.ref, child, -1]);
      }));
    }
    return this.addActions(actions);
  };

  /**
 * Send the "addElement" signal.
 * @param {object} element
 * @param {stirng} reference id
 * @param {number} index
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.addElement = function addElement(element, ref, index) {
    if (!(index >= 0)) {
      index = -1;
    }
    return this.addActions(createAction('addElement', [ref, element.toJSON(), index]));
  };

  /**
 * Send the "removeElement" signal.
 * @param {stirng} reference id
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.removeElement = function removeElement(ref) {
    if (Array.isArray(ref)) {
      var actions = ref.map(function(r) {
        return createAction('removeElement', [r]);
      });
      return this.addActions(actions);
    }
    return this.addActions(createAction('removeElement', [ref]));
  };

  /**
 * Send the "moveElement" signal.
 * @param {stirng} target reference id
 * @param {stirng} parent reference id
 * @param {number} index
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.moveElement = function moveElement(targetRef, parentRef, index) {
    return this.addActions(createAction('moveElement', [targetRef, parentRef, index]));
  };

  /**
 * Send the "updateAttrs" signal.
 * @param {stirng} reference id
 * @param {stirng} key
 * @param {stirng} value
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.setAttr = function setAttr(ref, key, value) {
    var result = {};
    result[key] = value;
    return this.addActions(createAction('updateAttrs', [ref, result]));
  };

  /**
 * Send the "updateStyle" signal, update a sole style.
 * @param {stirng} reference id
 * @param {stirng} key
 * @param {stirng} value
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.setStyle = function setStyle(ref, key, value) {
    var result = {};
    result[key] = value;
    return this.addActions(createAction('updateStyle', [ref, result]));
  };

  /**
 * Send the "updateStyle" signal.
 * @param {stirng} reference id
 * @param {object} style
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.setStyles = function setStyles(ref, style) {
    return this.addActions(createAction('updateStyle', [ref, style]));
  };

  /**
 * Send the "addEvent" signal.
 * @param {stirng} reference id
 * @param {string} event type
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.addEvent = function addEvent(ref, type) {
    return this.addActions(createAction('addEvent', [ref, type]));
  };

  /**
 * Send the "removeEvent" signal.
 * @param {stirng} reference id
 * @param {string} event type
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.removeEvent = function removeEvent(ref, type) {
    return this.addActions(createAction('removeEvent', [ref, type]));
  };

  /**
 * Default handler.
 * @param {object | array} actions
 * @param {function} callback
 * @return {} anything returned by callback function
 */
  Listener.prototype.handler = function handler(actions, cb) {
    return cb && cb();
  };

  /**
 * Add actions into updates.
 * @param {object | array} actions
 * @return {undefined | number} the signal sent by native
 */
  Listener.prototype.addActions = function addActions(actions) {
    var updates = this.updates;
    var handler = this.handler;

    if (!Array.isArray(actions)) {
      actions = [actions];
    }

    if (this.batched) {
      updates.push.apply(updates, actions);
    } else {
      return handler(actions);
    }
  };

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /**
 * @fileOverview
 * Task handler for communication between javascript and native.
 */

  var handlerMap = {
    createBody: 'callCreateBody',
    addElement: 'callAddElement',
    removeElement: 'callRemoveElement',
    moveElement: 'callMoveElement',
    updateAttrs: 'callUpdateAttrs',
    updateStyle: 'callUpdateStyle',
    addEvent: 'callAddEvent',
    removeEvent: 'callRemoveEvent'
  };

  /**
 * Create a task handler.
 * @param {string} id
 * @param {function} handler
 * @return {function} taskHandler
 */
  function createHandler(id, handler) {
    var defaultHandler = handler || global.callNative;

    /* istanbul ignore if */
    if (typeof defaultHandler !== 'function') {
      console.error('[JS Runtime] no default handler');
    }

    return function taskHandler(tasks) {
    /* istanbul ignore if */
      if (!Array.isArray(tasks)) {
        tasks = [tasks];
      }
      for (var i = 0; i < tasks.length; i++) {
        var returnValue = dispatchTask(id, tasks[i], defaultHandler);
        if (returnValue === -1) {
          return returnValue;
        }
      }
    };
  }

  /**
 * Check if there is a corresponding available handler in the environment.
 * @param {string} module
 * @param {string} method
 * @return {boolean}
 */
  function hasAvailableHandler(module, method) {
    return module === 'dom'
    && handlerMap[method]
    && typeof global[handlerMap[method]] === 'function';
  }

  /**
 * Dispatch the task to the specified handler.
 * @param {string} id
 * @param {object} task
 * @param {function} defaultHandler
 * @return {number} signal returned from native
 */
  function dispatchTask(id, task, defaultHandler) {
    var module = task.module;
    var method = task.method;
    var args = task.args;

    if (hasAvailableHandler(module, method)) {
      return global[handlerMap[method]].apply(global, [ id ].concat( args, ['-1'] ));
    }

    return defaultHandler(id, [task], '-1');
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /**
 * Update all changes for an element.
 * @param {object} element
 * @param {object} changes
 */
  function updateElement(el, changes) {
    var attrs = changes.attrs || {};
    for (var name in attrs) {
      el.setAttr(name, attrs[name], true);
    }
    var style = changes.style || {};
    for (var name$1 in style) {
      el.setStyle(name$1, style[name$1], true);
    }
  }

  var Document = function Document(id, url, handler) {
    id = id ? id.toString() : '';
    this.id = id;
    this.URL = url;

    addDoc(id, this);
    this.nodeMap = {};
    var L = Document.Listener || Listener;
    this.listener = new L(id, handler || createHandler(id, Document.handler)); // deprecated
    this.taskCenter = new TaskCenter(id, handler ? function(id) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return handler.apply(void 0, args);
    } : Document.handler);
    this.createDocumentElement();
  };

  /**
* Get the node from nodeMap.
* @param {string} reference id
* @return {object} node
*/
  Document.prototype.getRef = function getRef(ref) {
    return this.nodeMap[ref];
  };

  /**
* Turn on batched updates.
*/
  Document.prototype.open = function open() {
    this.listener.batched = false;
  };

  /**
* Turn off batched updates.
*/
  Document.prototype.close = function close() {
    this.listener.batched = true;
  };

  /**
* Create the document element.
* @return {object} documentElement
*/
  Document.prototype.createDocumentElement = function createDocumentElement() {
    var this$1 = this;

    if (!this.documentElement) {
      var el = new Element('document');
      el.docId = this.id;
      el.ownerDocument = this;
      el.role = 'documentElement';
      el.depth = 0;
      el.ref = '_documentElement';
      this.nodeMap._documentElement = el;
      this.documentElement = el;

      Object.defineProperty(el, 'appendChild', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function(node) {
          appendBody(this$1, node);
        }
      });

      Object.defineProperty(el, 'insertBefore', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function(node, before) {
          appendBody(this$1, node, before);
        }
      });
    }

    return this.documentElement;
  };

  /**
* Create the body element.
* @param {string} type
* @param {objct} props
* @return {object} body element
*/
  Document.prototype.createBody = function createBody(type, props) {
    if (!this.body) {
      var el = new Element(type, props);
      setBody(this, el);
    }

    return this.body;
  };

  /**
* Create an element.
* @param {string} tagName
* @param {objct} props
* @return {object} element
*/
  Document.prototype.createElement = function createElement(tagName, props) {
    return new Element(tagName, props);
  };

  /**
* Create an comment.
* @param {string} text
* @return {object} comment
*/
  Document.prototype.createComment = function createComment(text) {
    return new Comment(text);
  };

  /**
* Register StyleSheets.
* @param {string} scopeId
* @return {array<object>} styleSheets
*/
  Document.prototype.registerStyleSheets = function registerStyleSheets(scopeId, styleSheets) {
    var sheets = Array.isArray(styleSheets) ? styleSheets : [styleSheets];
    if (this.taskCenter && sheets.length) {
      return this.taskCenter.send(
        'dom',
        { action: 'registerStyleSheets' },
        [scopeId, sheets]
      );
    }
  };

  /**
* Fire an event on specified element manually.
* @param {object} element
* @param {string} event type
* @param {object} event object
* @param {object} dom changes
* @param {object} options
* @return {} anything returned by handler function
*/
  Document.prototype.fireEvent = function fireEvent(el, type, event, domChanges, options) {
    if (!el) {
      return;
    }
    event = event || {};
    event.type = event.type || type;
    event.target = el;
    event.currentTarget = el;
    event.timestamp = Date.now();
    if (domChanges) {
      updateElement(el, domChanges);
    }
    var isBubble = this.getRef('_root').attr.bubble === 'true';
    return el.fireEvent(type, event, isBubble, options);
  };

  /**
* Destroy current document, and remove itself form docMap.
*/
  Document.prototype.destroy = function destroy() {
    this.taskCenter.destroyCallback();
    delete this.listener;
    delete this.nodeMap;
    delete this.taskCenter;
    removeDoc(this.id);
  };

  // default task handler
  Document.handler = null;

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var moduleProxies = {};

  function setId(weex, id) {
    Object.defineProperty(weex, '[[CurrentInstanceId]]', { value: id });
  }

  function getId(weex) {
    return weex['[[CurrentInstanceId]]'];
  }

  function moduleGetter(id, module, method) {
    var taskCenter = getTaskCenter(id);
    if (!taskCenter || typeof taskCenter.send !== 'function') {
      console.error('[JS Framework] Failed to find taskCenter (' + id + ').');
      return null;
    }
    return function() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return taskCenter.send('module', { module: module, method: method }, args);
    };
  }

  function moduleSetter(id, module, method, fn) {
    var taskCenter = getTaskCenter(id);
    if (!taskCenter || typeof taskCenter.send !== 'function') {
      console.error('[JS Framework] Failed to find taskCenter (' + id + ').');
      return null;
    }
    if (typeof fn !== 'function') {
      console.error('[JS Framework] ' + module + '.' + method + ' must be assigned as a function.');
      return null;
    }
    return function(fn) {
      return taskCenter.send('module', { module: module, method: method }, [fn]);
    };
  }

  var WeexInstance = function WeexInstance(id, config) {
    setId(this, String(id));
    this.config = config || {};
    this.document = new Document(id, this.config.bundleUrl);
    this.requireModule = this.requireModule.bind(this);
    this.isRegisteredModule = isRegisteredModule;
    this.isRegisteredComponent = isRegisteredComponent;
  };

  WeexInstance.prototype.requireModule = function requireModule(moduleName) {
    var id = getId(this);
    if (!(id && this.document && this.document.taskCenter)) {
      console.error('[JS Framework] Failed to requireModule("' + moduleName + '"), '
      + 'instance (' + id + ") doesn't exist anymore.");
      return;
    }

    // warn for unknown module
    if (!isRegisteredModule(moduleName)) {
      console.warn('[JS Framework] using unregistered weex module "' + moduleName + '"');
      return;
    }

    // create new module proxy
    var proxyName = moduleName + '#' + id;
    if (!moduleProxies[proxyName]) {
    // create registered module apis
      var moduleDefine = getModuleDescription(moduleName);
      var moduleApis = {};
      var loop = function( methodName ) {
        Object.defineProperty(moduleApis, methodName, {
          enumerable: true,
          configurable: true,
          get: function() {
            return moduleGetter(id, moduleName, methodName);
          },
          set: function(fn) {
            return moduleSetter(id, moduleName, methodName, fn);
          }
        });
      };

      for (var methodName in moduleDefine) loop( methodName );

      // create module Proxy
      if (typeof Proxy === 'function') {
        moduleProxies[proxyName] = new Proxy(moduleApis, {
          get: function get(target, methodName) {
            if (methodName in target) {
              return target[methodName];
            }
            console.warn('[JS Framework] using unregistered method "' + moduleName + '.' + methodName + '"');
            return moduleGetter(id, moduleName, methodName);
          }
        });
      } else {
        moduleProxies[proxyName] = moduleApis;
      }
    }

    return moduleProxies[proxyName];
  };

  WeexInstance.prototype.supports = function supports(condition) {
    if (typeof condition !== 'string') {
      return null;
    }

    var res = condition.match(/^@(\w+)\/(\w+)(\.(\w+))?$/i);
    if (res) {
      var type = res[1];
      var name = res[2];
      var method = res[4];
      switch (type) {
        case 'module': return isRegisteredModule(name, method);
        case 'component': return isRegisteredComponent(name);
      }
    }

    return null;
  };

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var frameworks;
  var runtimeConfig;

  var versionRegExp = /^\s*\/\/ *(\{[^}]*\}) *\r?\n/;

  /**
 * Detect a JS Bundle code and make sure which framework it's based to. Each JS
 * Bundle should make sure that it starts with a line of JSON comment and is
 * more that one line.
 * @param  {string} code
 * @return {object}
 */
  function getBundleType(code) {
    var result = versionRegExp.exec(code);
    if (result) {
      try {
        var info = JSON.parse(result[1]);
        return info.framework;
      } catch (e) {}
    }

    // default bundle type
    return 'Weex';
  }

  function createServices(id, env, config) {
  // Init JavaScript services for this instance.
    var serviceMap = Object.create(null);
    serviceMap.service = Object.create(null);
    services.forEach(function(ref) {
      var name = ref.name;
      var options = ref.options;

      {
        console.debug('[JS Runtime] create service ' + name + '.');
      }
      var create = options.create;
      if (create) {
        try {
          var result = create(id, env, config);
          Object.assign(serviceMap.service, result);
          Object.assign(serviceMap, result.instance);
        } catch (e) {
          console.error('[JS Runtime] Failed to create service ' + name + '.');
        }
      }
    });
    delete serviceMap.service.instance;
    Object.freeze(serviceMap.service);
    return serviceMap;
  }

  var instanceTypeMap = {};
  function getFrameworkType(id) {
    return instanceTypeMap[id];
  }

  function createInstanceContext(id, options, data) {
    if ( options === void 0 ) options = {};

    var weex = new WeexInstance(id, options);
    Object.freeze(weex);

    var bundleType = options.bundleType || 'Vue';
    instanceTypeMap[id] = bundleType;
    var framework = runtimeConfig.frameworks[bundleType];
    if (!framework) {
      return new Error('[JS Framework] Invalid bundle type "' + bundleType + '".');
    }
    track(id, 'bundleType', bundleType);

    // prepare js service
    var services$$1 = createServices(id, {
      weex: weex,
      config: options,
      created: Date.now(),
      framework: bundleType,
      bundleType: bundleType
    }, runtimeConfig);
    Object.freeze(services$$1);

    // prepare runtime context
    var runtimeContext = Object.create(null);
    Object.assign(runtimeContext, services$$1, {
      weex: weex,
      services: services$$1 // Temporary compatible with some legacy APIs in Rax
    });
    Object.freeze(runtimeContext);

    // prepare instance context
    var instanceContext = Object.assign({}, runtimeContext);
    if (typeof framework.createInstanceContext === 'function') {
      Object.assign(instanceContext, framework.createInstanceContext(id, runtimeContext, data));
    }
    Object.freeze(instanceContext);
    return instanceContext;
  }

  /**
 * Check which framework a certain JS Bundle code based to. And create instance
 * by this framework.
 * @param {string} id
 * @param {string} code
 * @param {object} config
 * @param {object} data
 */
  function createInstance(id, code, config, data) {
    if (instanceTypeMap[id]) {
      return new Error('The instance id "' + id + '" has already been used!');
    }

    // Init instance info.
    var bundleType = getBundleType(code);
    instanceTypeMap[id] = bundleType;

    // Init instance config.
    config.env = JSON.parse(JSON.stringify(global.WXEnvironment || {}));
    config.bundleType = bundleType;

    var framework = runtimeConfig.frameworks[bundleType];
    if (!framework) {
      return new Error('[JS Framework] Invalid bundle type "' + bundleType + '".');
    }
    if (bundleType === 'Weex') {
      console.error('[JS Framework] COMPATIBILITY WARNING: '
      + 'Weex DSL 1.0 (.we) framework is no longer supported! '
      + 'It will be removed in the next version of WeexSDK, '
      + 'your page would be crash if you still using the ".we" framework. '
      + 'Please upgrade it to Vue.js or Rax.');
    }


    let modules = {};
    var instanceContext = Object.assign({
      define: require('./define.weex')(modules),
      require: require('./require.weex')(modules),
      document: { // for mock
        open: () => {}
      }
    }, createInstanceContext(id, config, data));
    modules.rax = {
      factory: ModuleFactories.rax.bind(instanceContext),
      module: {exports: {}},
      isInitialized: false,
    };

    // if (typeof framework.createInstance === 'function') {
    //   // Temporary compatible with some legacy APIs in Rax,
    //   // some Rax page is using the legacy ".we" framework.
    //   if (bundleType === 'Rax' || bundleType === 'Weex') {
    //     var raxInstanceContext = Object.assign({
    //       config: config,
    //       created: Date.now(),
    //       framework: bundleType
    //     }, instanceContext);
    //     return framework.createInstance(id, code, config, data, raxInstanceContext)
    //   }
    //   return framework.createInstance(id, code, config, data, instanceContext)
    // }
    // console.error(`[JS Framework] Can't find available "createInstance" method in ${bundleType}!`)

    return runInContext(code, instanceContext);
  }

  /**
 * Run js code in a specific context.
 * @param {string} code
 * @param {object} context
 */
  function runInContext(code, context) {
    var keys = [];
    var args = [];

    for (var key in context) {
      keys.push(key);
      args.push(context[key]);
    }

    var bundle = '\n    (function (global) {\n      ' + code + '\n    })(Object.create(self))\n  ';
    return (new (Function.prototype.bind.apply( Function, [ null ].concat( keys, [bundle]) ))).apply(void 0, args);
  }

  /**
 * Get the JSON object of the root element.
 * @param {string} instanceId
 */
  function getRoot(instanceId) {
    var document = getDoc(instanceId);
    try {
      if (document && document.body) {
        return document.body.toJSON();
      }
    } catch (e) {
      console.error('[JS Framework] Failed to get the virtual dom tree.');
      return;
    }
  }

  var methods = {
    createInstance: createInstance,
    createInstanceContext: createInstanceContext,
    getRoot: getRoot,
    getDocument: getDoc,
    registerService: register,
    unregisterService: unregister,
    callJS: function callJS(id, tasks) {
      var framework = frameworks[getFrameworkType(id)];
      if (framework && typeof framework.receiveTasks === 'function') {
        return framework.receiveTasks(id, tasks);
      }
      return receiveTasks(id, tasks);
    }
  };

  /**
 * Register methods which will be called for each instance.
 * @param {string} methodName
 */
  function genInstance(methodName) {
    methods[methodName] = function() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var id = args[0];
      var type = getFrameworkType(id);
      if (type && frameworks[type]) {
        var result = (ref = frameworks[type])[methodName].apply(ref, args);
        var info = { framework: type };

        // Lifecycle methods
        if (methodName === 'refreshInstance') {
          services.forEach(function(service) {
            var refresh = service.options.refresh;
            if (refresh) {
              refresh(id, { info: info, runtime: runtimeConfig });
            }
          });
        } else if (methodName === 'destroyInstance') {
          services.forEach(function(service) {
            var destroy = service.options.destroy;
            if (destroy) {
              destroy(id, { info: info, runtime: runtimeConfig });
            }
          });
          delete instanceTypeMap[id];
        }

        return result;
      }
      return new Error('[JS Framework] Using invalid instance id '
      + '"' + id + '" when calling ' + methodName + '.');
      var ref;
    };
  }

  /**
 * Register methods which init each frameworks.
 * @param {string} methodName
 * @param {function} sharedMethod
 */
  function adaptMethod(methodName, sharedMethod) {
    methods[methodName] = function() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (typeof sharedMethod === 'function') {
        sharedMethod.apply(void 0, args);
      }

      // TODO: deprecated
      for (var name in runtimeConfig.frameworks) {
        var framework = runtimeConfig.frameworks[name];
        if (framework && framework[methodName]) {
          framework[methodName].apply(framework, args);
        }
      }
    };
  }

  function init$$1(config) {
    runtimeConfig = config || {};
    frameworks = runtimeConfig.frameworks || {};
    init$1();

    // Init each framework by `init` method and `config` which contains three
    // virtual-DOM Class: `Document`, `Element` & `Comment`, and a JS bridge method:
    // `sendTasks(...args)`.
    for (var name in frameworks) {
      var framework = frameworks[name];
      if (typeof framework.init === 'function') {
        try {
          framework.init(config);
        } catch (e) {}
      }
    }

    adaptMethod('registerComponents', registerComponents);
    adaptMethod('registerModules', registerModules);
    adaptMethod('registerMethods')

    ; ['destroyInstance', 'refreshInstance'].forEach(genInstance);

    return methods;
  }

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var config = {
    Document: Document, Element: Element, Comment: Comment, Listener: Listener,
    TaskCenter: TaskCenter,
    sendTasks: function sendTasks() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (typeof callNative === 'function') {
        return callNative.apply(void 0, args);
      }
      return (global.callNative || function() {}).apply(void 0, args);
    }
  };

  Document.handler = config.sendTasks;

  /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  /* istanbul ignore next */
  function freezePrototype() {
  // Object.freeze(config.Element)
    Object.freeze(config.Comment);
    Object.freeze(config.Listener);
    Object.freeze(config.Document.prototype);
    // Object.freeze(config.Element.prototype)
    Object.freeze(config.Comment.prototype);
    Object.freeze(config.Listener.prototype);
  }

  var index = {
    service: { register: register, unregister: unregister, has: has },
    freezePrototype: freezePrototype,
    init: init$$1,
    config: config
  };

  return index;
}));
// # sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3J1bnRpbWUvc2hhcmVkL3V0aWxzLmpzIiwiLi4vLi4vcnVudGltZS9icmlkZ2Uvbm9ybWFsaXplLmpzIiwiLi4vLi4vcnVudGltZS9icmlkZ2UvQ2FsbGJhY2tNYW5hZ2VyLmpzIiwiLi4vLi4vcnVudGltZS92ZG9tL29wZXJhdGlvbi5qcyIsIi4uLy4uL3J1bnRpbWUvdmRvbS9Ob2RlLmpzIiwiLi4vLi4vcnVudGltZS92ZG9tL1dlZXhFbGVtZW50LmpzIiwiLi4vLi4vcnVudGltZS92ZG9tL0VsZW1lbnQuanMiLCIuLi8uLi9ydW50aW1lL2JyaWRnZS9UYXNrQ2VudGVyLmpzIiwiLi4vLi4vcnVudGltZS9icmlkZ2UvcmVjZWl2ZXIuanMiLCIuLi8uLi9ydW50aW1lL2FwaS9tb2R1bGUuanMiLCIuLi8uLi9ydW50aW1lL2FwaS9jb21wb25lbnQuanMiLCIuLi8uLi9ydW50aW1lL2FwaS9zZXJ2aWNlLmpzIiwiLi4vLi4vcnVudGltZS9icmlkZ2UvZGVidWcuanMiLCIuLi8uLi9ydW50aW1lL3Zkb20vQ29tbWVudC5qcyIsIi4uLy4uL3J1bnRpbWUvYnJpZGdlL0xpc3RlbmVyLmpzIiwiLi4vLi4vcnVudGltZS9icmlkZ2UvSGFuZGxlci5qcyIsIi4uLy4uL3J1bnRpbWUvdmRvbS9Eb2N1bWVudC5qcyIsIi4uLy4uL3J1bnRpbWUvYXBpL1dlZXhJbnN0YW5jZS5qcyIsIi4uLy4uL3J1bnRpbWUvYXBpL2luaXQuanMiLCIuLi8uLi9ydW50aW1lL3Zkb20vaW5kZXguanMiLCIuLi8uLi9ydW50aW1lL2FwaS9jb25maWcuanMiLCIuLi8uLi9ydW50aW1lL2FwaS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBHZXQgYSB1bmlxdWUgaWQuXG4gKi9cbmxldCBuZXh0Tm9kZVJlZiA9IDFcbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVJZCAoKSB7XG4gIHJldHVybiAobmV4dE5vZGVSZWYrKykudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwb2YgKHYpIHtcbiAgY29uc3QgcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2KVxuICByZXR1cm4gcy5zdWJzdHJpbmcoOCwgcy5sZW5ndGggLSAxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVG9CYXNlNjQgKGJ1ZmZlcikge1xuICBpZiAodHlwZW9mIGJ0b2EgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuICBjb25zdCBzdHJpbmcgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXG4gICAgbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSxcbiAgICBjb2RlID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSlcbiAgKS5qb2luKCcnKVxuICByZXR1cm4gYnRvYShzdHJpbmcpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFRvQnVmZmVyIChiYXNlNjQpIHtcbiAgaWYgKHR5cGVvZiBhdG9iICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKVxuICB9XG4gIGNvbnN0IHN0cmluZyA9IGF0b2IoYmFzZTY0KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoc3RyaW5nLmxlbmd0aClcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChzdHJpbmcsIChjaCwgaSkgPT4ge1xuICAgIGFycmF5W2ldID0gY2guY2hhckNvZGVBdCgwKVxuICB9KVxuICByZXR1cm4gYXJyYXkuYnVmZmVyXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBwYXJhbSBpcyBmYWxzeSBvciBlbXB0eVxuICogQHBhcmFtIHthbnl9IGFueVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eSAoYW55KSB7XG4gIGlmICghYW55IHx8IHR5cGVvZiBhbnkgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIGFueSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYW55LCBrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyB0eXBvZiwgYnVmZmVyVG9CYXNlNjQsIGJhc2U2NFRvQnVmZmVyIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzJ1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHByaW1pdGl2ZSB2YWx1ZS5cbiAqIEBwYXJhbSAge2FueX0gICAgICAgIHZcbiAqIEByZXR1cm4ge3ByaW1pdGl2ZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVByaW1pdGl2ZSAodikge1xuICBjb25zdCB0eXBlID0gdHlwb2YodilcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdVbmRlZmluZWQnOlxuICAgIGNhc2UgJ051bGwnOlxuICAgICAgcmV0dXJuICcnXG5cbiAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgcmV0dXJuIHYudG9TdHJpbmcoKVxuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgcmV0dXJuIHYudG9JU09TdHJpbmcoKVxuXG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgIGNhc2UgJ0FycmF5JzpcbiAgICBjYXNlICdPYmplY3QnOlxuICAgICAgcmV0dXJuIHZcblxuICAgIGNhc2UgJ0FycmF5QnVmZmVyJzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdAdHlwZSc6ICdiaW5hcnknLFxuICAgICAgICBkYXRhVHlwZTogdHlwZSxcbiAgICAgICAgYmFzZTY0OiBidWZmZXJUb0Jhc2U2NCh2KVxuICAgICAgfVxuXG4gICAgY2FzZSAnSW50OEFycmF5JzpcbiAgICBjYXNlICdVaW50OEFycmF5JzpcbiAgICBjYXNlICdVaW50OENsYW1wZWRBcnJheSc6XG4gICAgY2FzZSAnSW50MTZBcnJheSc6XG4gICAgY2FzZSAnVWludDE2QXJyYXknOlxuICAgIGNhc2UgJ0ludDMyQXJyYXknOlxuICAgIGNhc2UgJ1VpbnQzMkFycmF5JzpcbiAgICBjYXNlICdGbG9hdDMyQXJyYXknOlxuICAgIGNhc2UgJ0Zsb2F0NjRBcnJheSc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAnQHR5cGUnOiAnYmluYXJ5JyxcbiAgICAgICAgZGF0YVR5cGU6IHR5cGUsXG4gICAgICAgIGJhc2U2NDogYnVmZmVyVG9CYXNlNjQodi5idWZmZXIpXG4gICAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZVByaW1pdGl2ZSAoZGF0YSkge1xuICBpZiAodHlwb2YoZGF0YSkgPT09ICdPYmplY3QnKSB7XG4gICAgLy8gZGVjb2RlIGJhc2U2NCBpbnRvIGJpbmFyeVxuICAgIGlmIChkYXRhWydAdHlwZSddICYmIGRhdGFbJ0B0eXBlJ10gPT09ICdiaW5hcnknKSB7XG4gICAgICByZXR1cm4gYmFzZTY0VG9CdWZmZXIoZGF0YS5iYXNlNjQgfHwgJycpXG4gICAgfVxuXG4gICAgY29uc3QgcmVhbERhdGEgPSB7fVxuICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgIHJlYWxEYXRhW2tleV0gPSBkZWNvZGVQcmltaXRpdmUoZGF0YVtrZXldKVxuICAgIH1cbiAgICByZXR1cm4gcmVhbERhdGFcbiAgfVxuICBpZiAodHlwb2YoZGF0YSkgPT09ICdBcnJheScpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoZGVjb2RlUHJpbWl0aXZlKVxuICB9XG4gIHJldHVybiBkYXRhXG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgZGVjb2RlUHJpbWl0aXZlIH0gZnJvbSAnLi9ub3JtYWxpemUnXG5cbmZ1bmN0aW9uIGdldEhvb2tLZXkgKGNvbXBvbmVudElkLCB0eXBlLCBob29rTmFtZSkge1xuICByZXR1cm4gYCR7dHlwZX1AJHtob29rTmFtZX0jJHtjb21wb25lbnRJZH1gXG59XG5cbi8qKlxuICogRm9yIGdlbmVyYWwgY2FsbGJhY2sgbWFuYWdlbWVudCBvZiBhIGNlcnRhaW4gV2VleCBpbnN0YW5jZS5cbiAqIEJlY2F1c2UgZnVuY3Rpb24gY2FuIG5vdCBwYXNzZWQgaW50byBuYXRpdmUsIHNvIHdlIGNyZWF0ZSBjYWxsYmFja1xuICogY2FsbGJhY2sgaWQgZm9yIGVhY2ggZnVuY3Rpb24gYW5kIHBhc3MgdGhlIGNhbGxiYWNrIGlkIGludG8gbmF0aXZlXG4gKiBpbiBmYWN0LiBBbmQgd2hlbiBhIGNhbGxiYWNrIGNhbGxlZCBmcm9tIG5hdGl2ZSwgd2UgY2FuIGZpbmQgdGhlIHJlYWxcbiAqIGNhbGxiYWNrIHRocm91Z2ggdGhlIGNhbGxiYWNrIGlkIHdlIGhhdmUgcGFzc2VkIGJlZm9yZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsbGJhY2tNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IgKGluc3RhbmNlSWQpIHtcbiAgICB0aGlzLmluc3RhbmNlSWQgPSBTdHJpbmcoaW5zdGFuY2VJZClcbiAgICB0aGlzLmxhc3RDYWxsYmFja0lkID0gMFxuICAgIHRoaXMuY2FsbGJhY2tzID0ge31cbiAgICB0aGlzLmhvb2tzID0ge31cbiAgfVxuICBhZGQgKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5sYXN0Q2FsbGJhY2tJZCsrXG4gICAgdGhpcy5jYWxsYmFja3NbdGhpcy5sYXN0Q2FsbGJhY2tJZF0gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLmxhc3RDYWxsYmFja0lkXG4gIH1cbiAgcmVtb3ZlIChjYWxsYmFja0lkKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tjYWxsYmFja0lkXVxuICAgIGRlbGV0ZSB0aGlzLmNhbGxiYWNrc1tjYWxsYmFja0lkXVxuICAgIHJldHVybiBjYWxsYmFja1xuICB9XG4gIHJlZ2lzdGVySG9vayAoY29tcG9uZW50SWQsIHR5cGUsIGhvb2tOYW1lLCBob29rRnVuY3Rpb24pIHtcbiAgICAvLyBUT0RPOiB2YWxpZGF0ZSBhcmd1bWVudHNcbiAgICBjb25zdCBrZXkgPSBnZXRIb29rS2V5KGNvbXBvbmVudElkLCB0eXBlLCBob29rTmFtZSlcbiAgICBpZiAodGhpcy5ob29rc1trZXldKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFtKUyBGcmFtZXdvcmtdIE92ZXJyaWRlIGFuIGV4aXN0aW5nIGNvbXBvbmVudCBob29rIFwiJHtrZXl9XCIuYClcbiAgICB9XG4gICAgdGhpcy5ob29rc1trZXldID0gaG9va0Z1bmN0aW9uXG4gIH1cbiAgdHJpZ2dlckhvb2sgKGNvbXBvbmVudElkLCB0eXBlLCBob29rTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gVE9ETzogdmFsaWRhdGUgYXJndW1lbnRzXG4gICAgY29uc3Qga2V5ID0gZ2V0SG9va0tleShjb21wb25lbnRJZCwgdHlwZSwgaG9va05hbWUpXG4gICAgY29uc3QgaG9va0Z1bmN0aW9uID0gdGhpcy5ob29rc1trZXldXG4gICAgaWYgKHR5cGVvZiBob29rRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIEludmFsaWQgaG9vayBmdW5jdGlvbiB0eXBlICgke3R5cGVvZiBob29rRnVuY3Rpb259KSBvbiBcIiR7a2V5fVwiLmApXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gbnVsbFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBob29rRnVuY3Rpb24uYXBwbHkobnVsbCwgb3B0aW9ucy5hcmdzIHx8IFtdKVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihgW0pTIEZyYW1ld29ya10gRmFpbGVkIHRvIGV4ZWN1dGUgdGhlIGhvb2sgZnVuY3Rpb24gb24gXCIke2tleX1cIi5gKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgY29uc3VtZSAoY2FsbGJhY2tJZCwgZGF0YSwgaWZLZWVwQWxpdmUpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2NhbGxiYWNrSWRdXG4gICAgaWYgKHR5cGVvZiBpZktlZXBBbGl2ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWZLZWVwQWxpdmUgPT09IGZhbHNlKSB7XG4gICAgICBkZWxldGUgdGhpcy5jYWxsYmFja3NbY2FsbGJhY2tJZF1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGRlY29kZVByaW1pdGl2ZShkYXRhKSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBFcnJvcihgaW52YWxpZCBjYWxsYmFjayBpZCBcIiR7Y2FsbGJhY2tJZH1cImApXG4gIH1cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMuY2FsbGJhY2tzID0ge31cbiAgICB0aGlzLmhvb2tzID0ge31cbiAgfVxufVxuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmNvbnN0IGRvY01hcCA9IHt9XG5cbi8qKlxuICogQWRkIGEgZG9jdW1lbnQgb2JqZWN0IGludG8gZG9jTWFwLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcGFyYW0ge29iamVjdH0gZG9jdW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERvYyAoaWQsIGRvYykge1xuICBpZiAoaWQpIHtcbiAgICBkb2NNYXBbaWRdID0gZG9jXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRvY3VtZW50IG9iamVjdCBieSBpZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RG9jIChpZCkge1xuICByZXR1cm4gZG9jTWFwW2lkXVxufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZG9jdW1lbnQgZnJvbSBkb2NNYXAgYnkgaWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURvYyAoaWQpIHtcbiAgZGVsZXRlIGRvY01hcFtpZF1cbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICogR2V0IGxpc3RlbmVyIGJ5IGRvY3VtZW50IGlkLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcmV0dXJuIHtvYmplY3R9IGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0ZW5lciAoaWQpIHtcbiAgY29uc3QgZG9jID0gZG9jTWFwW2lkXVxuICBpZiAoZG9jICYmIGRvYy5saXN0ZW5lcikge1xuICAgIHJldHVybiBkb2MubGlzdGVuZXJcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIEdldCBUYXNrQ2VudGVyIGluc3RhbmNlIGJ5IGlkLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcmV0dXJuIHtvYmplY3R9IFRhc2tDZW50ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRhc2tDZW50ZXIgKGlkKSB7XG4gIGNvbnN0IGRvYyA9IGRvY01hcFtpZF1cbiAgaWYgKGRvYyAmJiBkb2MudGFza0NlbnRlcikge1xuICAgIHJldHVybiBkb2MudGFza0NlbnRlclxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogQXBwZW5kIGJvZHkgbm9kZSB0byBkb2N1bWVudEVsZW1lbnQuXG4gKiBAcGFyYW0ge29iamVjdH0gZG9jdW1lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBub2RlXG4gKiBAcGFyYW0ge29iamVjdH0gYmVmb3JlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRCb2R5IChkb2MsIG5vZGUsIGJlZm9yZSkge1xuICBjb25zdCB7IGRvY3VtZW50RWxlbWVudCB9ID0gZG9jXG5cbiAgaWYgKGRvY3VtZW50RWxlbWVudC5wdXJlQ2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBub2RlLnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm5cbiAgfVxuICBjb25zdCBjaGlsZHJlbiA9IGRvY3VtZW50RWxlbWVudC5jaGlsZHJlblxuICBjb25zdCBiZWZvcmVJbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKVxuICBpZiAoYmVmb3JlSW5kZXggPCAwKSB7XG4gICAgY2hpbGRyZW4ucHVzaChub2RlKVxuICB9XG4gIGVsc2Uge1xuICAgIGNoaWxkcmVuLnNwbGljZShiZWZvcmVJbmRleCwgMCwgbm9kZSlcbiAgfVxuXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgaWYgKG5vZGUucm9sZSA9PT0gJ2JvZHknKSB7XG4gICAgICBub2RlLmRvY0lkID0gZG9jLmlkXG4gICAgICBub2RlLm93bmVyRG9jdW1lbnQgPSBkb2NcbiAgICAgIG5vZGUucGFyZW50Tm9kZSA9IGRvY3VtZW50RWxlbWVudFxuICAgICAgbGlua1BhcmVudChub2RlLCBkb2N1bWVudEVsZW1lbnQpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgY2hpbGQucGFyZW50Tm9kZSA9IG5vZGVcbiAgICAgIH0pXG4gICAgICBzZXRCb2R5KGRvYywgbm9kZSlcbiAgICAgIG5vZGUuZG9jSWQgPSBkb2MuaWRcbiAgICAgIG5vZGUub3duZXJEb2N1bWVudCA9IGRvY1xuICAgICAgbGlua1BhcmVudChub2RlLCBkb2N1bWVudEVsZW1lbnQpXG4gICAgICBkZWxldGUgZG9jLm5vZGVNYXBbbm9kZS5ub2RlSWRdXG4gICAgfVxuICAgIGRvY3VtZW50RWxlbWVudC5wdXJlQ2hpbGRyZW4ucHVzaChub2RlKVxuICAgIHNlbmRCb2R5KGRvYywgbm9kZSlcbiAgfVxuICBlbHNlIHtcbiAgICBub2RlLnBhcmVudE5vZGUgPSBkb2N1bWVudEVsZW1lbnRcbiAgICBkb2Mubm9kZU1hcFtub2RlLnJlZl0gPSBub2RlXG4gIH1cbn1cblxuZnVuY3Rpb24gc2VuZEJvZHkgKGRvYywgbm9kZSkge1xuICBjb25zdCBib2R5ID0gbm9kZS50b0pTT04oKVxuICBpZiAoZG9jICYmIGRvYy50YXNrQ2VudGVyICYmIHR5cGVvZiBkb2MudGFza0NlbnRlci5zZW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZG9jLnRhc2tDZW50ZXIuc2VuZCgnZG9tJywgeyBhY3Rpb246ICdjcmVhdGVCb2R5JyB9LCBbYm9keV0pXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdXAgYm9keSBub2RlLlxuICogQHBhcmFtIHtvYmplY3R9IGRvY3VtZW50XG4gKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Qm9keSAoZG9jLCBlbCkge1xuICBlbC5yb2xlID0gJ2JvZHknXG4gIGVsLmRlcHRoID0gMVxuICBkZWxldGUgZG9jLm5vZGVNYXBbZWwubm9kZUlkXVxuICBlbC5yZWYgPSAnX3Jvb3QnXG4gIGRvYy5ub2RlTWFwLl9yb290ID0gZWxcbiAgZG9jLmJvZHkgPSBlbFxufVxuXG4vKipcbiAqIEVzdGFibGlzaCB0aGUgY29ubmVjdGlvbiBiZXR3ZWVuIHBhcmVudCBhbmQgY2hpbGQgbm9kZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBjaGlsZCBub2RlXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyZW50IG5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbmtQYXJlbnQgKG5vZGUsIHBhcmVudCkge1xuICBub2RlLnBhcmVudE5vZGUgPSBwYXJlbnRcbiAgaWYgKHBhcmVudC5kb2NJZCkge1xuICAgIG5vZGUuZG9jSWQgPSBwYXJlbnQuZG9jSWRcbiAgICBub2RlLm93bmVyRG9jdW1lbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudFxuICAgIG5vZGUub3duZXJEb2N1bWVudC5ub2RlTWFwW25vZGUubm9kZUlkXSA9IG5vZGVcbiAgICBub2RlLmRlcHRoID0gcGFyZW50LmRlcHRoICsgMVxuICB9XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgbGlua1BhcmVudChjaGlsZCwgbm9kZSlcbiAgfSlcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG5leHQgc2libGluZyBlbGVtZW50LlxuICogQHBhcmFtIHtvYmplY3R9IG5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRFbGVtZW50IChub2RlKSB7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgfVxuICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHByZXZpb3VzIHNpYmxpbmcgZWxlbWVudC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBub2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmV2aW91c0VsZW1lbnQgKG5vZGUpIHtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgbm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBub2RlIGludG8gbGlzdCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICogQHBhcmFtIHtvYmplY3R9IHRhcmdldCBub2RlXG4gKiBAcGFyYW0ge2FycmF5fSBsaXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbmV3SW5kZXhcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hhbmdlU2libGluZ1xuICogQHJldHVybiB7bnVtYmVyfSBuZXdJbmRleFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0SW5kZXggKHRhcmdldCwgbGlzdCwgbmV3SW5kZXgsIGNoYW5nZVNpYmxpbmcpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKG5ld0luZGV4IDwgMCkge1xuICAgIG5ld0luZGV4ID0gMFxuICB9XG4gIGNvbnN0IGJlZm9yZSA9IGxpc3RbbmV3SW5kZXggLSAxXVxuICBjb25zdCBhZnRlciA9IGxpc3RbbmV3SW5kZXhdXG4gIGxpc3Quc3BsaWNlKG5ld0luZGV4LCAwLCB0YXJnZXQpXG4gIGlmIChjaGFuZ2VTaWJsaW5nKSB7XG4gICAgYmVmb3JlICYmIChiZWZvcmUubmV4dFNpYmxpbmcgPSB0YXJnZXQpXG4gICAgdGFyZ2V0LnByZXZpb3VzU2libGluZyA9IGJlZm9yZVxuICAgIHRhcmdldC5uZXh0U2libGluZyA9IGFmdGVyXG4gICAgYWZ0ZXIgJiYgKGFmdGVyLnByZXZpb3VzU2libGluZyA9IHRhcmdldClcbiAgfVxuICByZXR1cm4gbmV3SW5kZXhcbn1cblxuLyoqXG4gKiBNb3ZlIHRoZSBub2RlIHRvIGEgbmV3IGluZGV4IGluIGxpc3QuXG4gKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0IG5vZGVcbiAqIEBwYXJhbSB7YXJyYXl9IGxpc3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZXdJbmRleFxuICogQHBhcmFtIHtib29sZWFufSBjaGFuZ2VTaWJsaW5nXG4gKiBAcmV0dXJuIHtudW1iZXJ9IG5ld0luZGV4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlSW5kZXggKHRhcmdldCwgbGlzdCwgbmV3SW5kZXgsIGNoYW5nZVNpYmxpbmcpIHtcbiAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2YodGFyZ2V0KVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKGNoYW5nZVNpYmxpbmcpIHtcbiAgICBjb25zdCBiZWZvcmUgPSBsaXN0W2luZGV4IC0gMV1cbiAgICBjb25zdCBhZnRlciA9IGxpc3RbaW5kZXggKyAxXVxuICAgIGJlZm9yZSAmJiAoYmVmb3JlLm5leHRTaWJsaW5nID0gYWZ0ZXIpXG4gICAgYWZ0ZXIgJiYgKGFmdGVyLnByZXZpb3VzU2libGluZyA9IGJlZm9yZSlcbiAgfVxuICBsaXN0LnNwbGljZShpbmRleCwgMSlcbiAgbGV0IG5ld0luZGV4QWZ0ZXIgPSBuZXdJbmRleFxuICBpZiAoaW5kZXggPD0gbmV3SW5kZXgpIHtcbiAgICBuZXdJbmRleEFmdGVyID0gbmV3SW5kZXggLSAxXG4gIH1cbiAgY29uc3QgYmVmb3JlTmV3ID0gbGlzdFtuZXdJbmRleEFmdGVyIC0gMV1cbiAgY29uc3QgYWZ0ZXJOZXcgPSBsaXN0W25ld0luZGV4QWZ0ZXJdXG4gIGxpc3Quc3BsaWNlKG5ld0luZGV4QWZ0ZXIsIDAsIHRhcmdldClcbiAgaWYgKGNoYW5nZVNpYmxpbmcpIHtcbiAgICBiZWZvcmVOZXcgJiYgKGJlZm9yZU5ldy5uZXh0U2libGluZyA9IHRhcmdldClcbiAgICB0YXJnZXQucHJldmlvdXNTaWJsaW5nID0gYmVmb3JlTmV3XG4gICAgdGFyZ2V0Lm5leHRTaWJsaW5nID0gYWZ0ZXJOZXdcbiAgICBhZnRlck5ldyAmJiAoYWZ0ZXJOZXcucHJldmlvdXNTaWJsaW5nID0gdGFyZ2V0KVxuICB9XG4gIGlmIChpbmRleCA9PT0gbmV3SW5kZXhBZnRlcikge1xuICAgIHJldHVybiAtMVxuICB9XG4gIHJldHVybiBuZXdJbmRleFxufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgbm9kZSBmcm9tIGxpc3QuXG4gKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0IG5vZGVcbiAqIEBwYXJhbSB7YXJyYXl9IGxpc3RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hhbmdlU2libGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSW5kZXggKHRhcmdldCwgbGlzdCwgY2hhbmdlU2libGluZykge1xuICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZih0YXJnZXQpXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoY2hhbmdlU2libGluZykge1xuICAgIGNvbnN0IGJlZm9yZSA9IGxpc3RbaW5kZXggLSAxXVxuICAgIGNvbnN0IGFmdGVyID0gbGlzdFtpbmRleCArIDFdXG4gICAgYmVmb3JlICYmIChiZWZvcmUubmV4dFNpYmxpbmcgPSBhZnRlcilcbiAgICBhZnRlciAmJiAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nID0gYmVmb3JlKVxuICB9XG4gIGxpc3Quc3BsaWNlKGluZGV4LCAxKVxufVxuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHVuaXF1ZUlkIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0RG9jIH0gZnJvbSAnLi9vcGVyYXRpb24nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGUge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5ub2RlSWQgPSB1bmlxdWVJZCgpXG4gICAgdGhpcy5yZWYgPSB0aGlzLm5vZGVJZFxuICAgIHRoaXMuY2hpbGRyZW4gPSBbXVxuICAgIHRoaXMucHVyZUNoaWxkcmVuID0gW11cbiAgICB0aGlzLnBhcmVudE5vZGUgPSBudWxsXG4gICAgdGhpcy5uZXh0U2libGluZyA9IG51bGxcbiAgICB0aGlzLnByZXZpb3VzU2libGluZyA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAqIERlc3Ryb3kgY3VycmVudCBub2RlLCBhbmQgcmVtb3ZlIGl0c2VsZiBmb3JtIG5vZGVNYXAuXG4gICovXG4gIGRlc3Ryb3kgKCkge1xuICAgIGNvbnN0IGRvYyA9IGdldERvYyh0aGlzLmRvY0lkKVxuICAgIGlmIChkb2MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmRvY0lkXG4gICAgICBkZWxldGUgZG9jLm5vZGVNYXBbdGhpcy5ub2RlSWRdXG4gICAgfVxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBjaGlsZC5kZXN0cm95KClcbiAgICB9KVxuICB9XG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7IGdldFRhc2tDZW50ZXIgfSBmcm9tICcuL29wZXJhdGlvbidcblxubGV0IEVsZW1lbnRcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEVsZW1lbnQgKEVsKSB7XG4gIEVsZW1lbnQgPSBFbFxufVxuXG4vKipcbiAqIEEgbWFwIHdoaWNoIHN0b3JlcyBhbGwgdHlwZSBvZiBlbGVtZW50cy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IHJlZ2lzdGVyZWRFbGVtZW50cyA9IHt9XG5cbi8qKlxuICogUmVnaXN0ZXIgYW4gZXh0ZW5kZWQgZWxlbWVudCB0eXBlIHdpdGggY29tcG9uZW50IG1ldGhvZHMuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHR5cGUgICAgY29tcG9uZW50IHR5cGVcbiAqIEBwYXJhbSAge2FycmF5fSAgbWV0aG9kcyBhIGxpc3Qgb2YgbWV0aG9kIG5hbWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckVsZW1lbnQgKHR5cGUsIG1ldGhvZHMpIHtcbiAgLy8gU2tpcCB3aGVuIG5vIHNwZWNpYWwgY29tcG9uZW50IG1ldGhvZHMuXG4gIGlmICghbWV0aG9kcyB8fCAhbWV0aG9kcy5sZW5ndGgpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIEluaXQgY29uc3RydWN0b3IuXG4gIGNsYXNzIFdlZXhFbGVtZW50IGV4dGVuZHMgRWxlbWVudCB7fVxuXG4gIC8vIEFkZCBtZXRob2RzIHRvIHByb3RvdHlwZS5cbiAgbWV0aG9kcy5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIFdlZXhFbGVtZW50LnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICBjb25zdCB0YXNrQ2VudGVyID0gZ2V0VGFza0NlbnRlcih0aGlzLmRvY0lkKVxuICAgICAgaWYgKHRhc2tDZW50ZXIpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tDZW50ZXIuc2VuZCgnY29tcG9uZW50Jywge1xuICAgICAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICAgICAgY29tcG9uZW50OiB0eXBlLFxuICAgICAgICAgIG1ldGhvZDogbWV0aG9kTmFtZVxuICAgICAgICB9LCBhcmdzKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICAvLyBBZGQgdG8gZWxlbWVudCB0eXBlIG1hcC5cbiAgcmVnaXN0ZXJlZEVsZW1lbnRzW3R5cGVdID0gV2VleEVsZW1lbnRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJFbGVtZW50ICh0eXBlKSB7XG4gIGRlbGV0ZSByZWdpc3RlcmVkRWxlbWVudHNbdHlwZV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlZXhFbGVtZW50ICh0eXBlKSB7XG4gIHJldHVybiByZWdpc3RlcmVkRWxlbWVudHNbdHlwZV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2VleEVsZW1lbnQgKHR5cGUpIHtcbiAgcmV0dXJuICEhcmVnaXN0ZXJlZEVsZW1lbnRzW3R5cGVdXG59XG5cbi8qKlxuICogQ2xlYXIgYWxsIGVsZW1lbnQgdHlwZXMuIE9ubHkgZm9yIHRlc3RpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhcldlZXhFbGVtZW50cyAoKSB7XG4gIGZvciAoY29uc3QgdHlwZSBpbiByZWdpc3RlcmVkRWxlbWVudHMpIHtcbiAgICB1bnJlZ2lzdGVyRWxlbWVudCh0eXBlKVxuICB9XG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IE5vZGUgZnJvbSAnLi9Ob2RlJ1xuaW1wb3J0IHtcbiAgZ2V0RG9jLFxuICBnZXRUYXNrQ2VudGVyLFxuICBsaW5rUGFyZW50LFxuICBuZXh0RWxlbWVudCxcbiAgcHJldmlvdXNFbGVtZW50LFxuICBpbnNlcnRJbmRleCxcbiAgbW92ZUluZGV4LFxuICByZW1vdmVJbmRleFxufSBmcm9tICcuL29wZXJhdGlvbidcbmltcG9ydCB7IHVuaXF1ZUlkLCBpc0VtcHR5IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0V2VleEVsZW1lbnQsIHNldEVsZW1lbnQgfSBmcm9tICcuL1dlZXhFbGVtZW50J1xuXG5jb25zdCBERUZBVUxUX1RBR19OQU1FID0gJ2RpdidcbmNvbnN0IEJVQkJMRV9FVkVOVFMgPSBbXG4gICdjbGljaycsICdsb25ncHJlc3MnLCAndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hlbmQnLFxuICAncGFuc3RhcnQnLCAncGFubW92ZScsICdwYW5lbmQnLCAnaG9yaXpvbnRhbHBhbicsICd2ZXJ0aWNhbHBhbicsICdzd2lwZSdcbl1cblxuZnVuY3Rpb24gcmVnaXN0ZXJOb2RlIChkb2NJZCwgbm9kZSkge1xuICBjb25zdCBkb2MgPSBnZXREb2MoZG9jSWQpXG4gIGRvYy5ub2RlTWFwW25vZGUubm9kZUlkXSA9IG5vZGVcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudCBleHRlbmRzIE5vZGUge1xuICBjb25zdHJ1Y3RvciAodHlwZSA9IERFRkFVTFRfVEFHX05BTUUsIHByb3BzLCBpc0V4dGVuZGVkKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgY29uc3QgV2VleEVsZW1lbnQgPSBnZXRXZWV4RWxlbWVudCh0eXBlKVxuICAgIGlmIChXZWV4RWxlbWVudCAmJiAhaXNFeHRlbmRlZCkge1xuICAgICAgcmV0dXJuIG5ldyBXZWV4RWxlbWVudCh0eXBlLCBwcm9wcywgdHJ1ZSlcbiAgICB9XG5cbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9XG4gICAgdGhpcy5ub2RlVHlwZSA9IDFcbiAgICB0aGlzLm5vZGVJZCA9IHVuaXF1ZUlkKClcbiAgICB0aGlzLnJlZiA9IHRoaXMubm9kZUlkXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIHRoaXMuYXR0ciA9IHByb3BzLmF0dHIgfHwge31cbiAgICB0aGlzLnN0eWxlID0gcHJvcHMuc3R5bGUgfHwge31cbiAgICB0aGlzLmNsYXNzU3R5bGUgPSBwcm9wcy5jbGFzc1N0eWxlIHx8IHt9XG4gICAgdGhpcy5jbGFzc0xpc3QgPSBwcm9wcy5jbGFzc0xpc3QgfHwgW11cbiAgICB0aGlzLmV2ZW50ID0ge31cbiAgICB0aGlzLmNoaWxkcmVuID0gW11cbiAgICB0aGlzLnB1cmVDaGlsZHJlbiA9IFtdXG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIGEgY2hpbGQgbm9kZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5vZGVcbiAgICogQHJldHVybiB7dW5kZWZpbmVkIHwgbnVtYmVyfSB0aGUgc2lnbmFsIHNlbnQgYnkgbmF0aXZlXG4gICAqL1xuICBhcHBlbmRDaGlsZCAobm9kZSkge1xuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoIW5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgbGlua1BhcmVudChub2RlLCB0aGlzKVxuICAgICAgaW5zZXJ0SW5kZXgobm9kZSwgdGhpcy5jaGlsZHJlbiwgdGhpcy5jaGlsZHJlbi5sZW5ndGgsIHRydWUpXG4gICAgICBpZiAodGhpcy5kb2NJZCkge1xuICAgICAgICByZWdpc3Rlck5vZGUodGhpcy5kb2NJZCwgbm9kZSlcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIGluc2VydEluZGV4KG5vZGUsIHRoaXMucHVyZUNoaWxkcmVuLCB0aGlzLnB1cmVDaGlsZHJlbi5sZW5ndGgpXG4gICAgICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgICAgIGlmICh0YXNrQ2VudGVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgICAgICdkb20nLFxuICAgICAgICAgICAgeyBhY3Rpb246ICdhZGRFbGVtZW50JyB9LFxuICAgICAgICAgICAgW3RoaXMucmVmLCBub2RlLnRvSlNPTigpLCAtMV1cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtb3ZlSW5kZXgobm9kZSwgdGhpcy5jaGlsZHJlbiwgdGhpcy5jaGlsZHJlbi5sZW5ndGgsIHRydWUpXG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IG1vdmVJbmRleChub2RlLCB0aGlzLnB1cmVDaGlsZHJlbiwgdGhpcy5wdXJlQ2hpbGRyZW4ubGVuZ3RoKVxuICAgICAgICBjb25zdCB0YXNrQ2VudGVyID0gZ2V0VGFza0NlbnRlcih0aGlzLmRvY0lkKVxuICAgICAgICBpZiAodGFza0NlbnRlciAmJiBpbmRleCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgICAgICdkb20nLFxuICAgICAgICAgICAgeyBhY3Rpb246ICdtb3ZlRWxlbWVudCcgfSxcbiAgICAgICAgICAgIFtub2RlLnJlZiwgdGhpcy5yZWYsIGluZGV4XVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBub2RlIGJlZm9yZSBzcGVjaWZpZWQgbm9kZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGJlZm9yZVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIGluc2VydEJlZm9yZSAobm9kZSwgYmVmb3JlKSB7XG4gICAgaWYgKG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUgIT09IHRoaXMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAobm9kZSA9PT0gYmVmb3JlIHx8IChub2RlLm5leHRTaWJsaW5nICYmIG5vZGUubmV4dFNpYmxpbmcgPT09IGJlZm9yZSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIW5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgbGlua1BhcmVudChub2RlLCB0aGlzKVxuICAgICAgaW5zZXJ0SW5kZXgobm9kZSwgdGhpcy5jaGlsZHJlbiwgdGhpcy5jaGlsZHJlbi5pbmRleE9mKGJlZm9yZSksIHRydWUpXG4gICAgICBpZiAodGhpcy5kb2NJZCkge1xuICAgICAgICByZWdpc3Rlck5vZGUodGhpcy5kb2NJZCwgbm9kZSlcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHB1cmVCZWZvcmUgPSBuZXh0RWxlbWVudChiZWZvcmUpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gaW5zZXJ0SW5kZXgoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICB0aGlzLnB1cmVDaGlsZHJlbixcbiAgICAgICAgICBwdXJlQmVmb3JlXG4gICAgICAgICAgICA/IHRoaXMucHVyZUNoaWxkcmVuLmluZGV4T2YocHVyZUJlZm9yZSlcbiAgICAgICAgICAgIDogdGhpcy5wdXJlQ2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgdGFza0NlbnRlciA9IGdldFRhc2tDZW50ZXIodGhpcy5kb2NJZClcbiAgICAgICAgaWYgKHRhc2tDZW50ZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFza0NlbnRlci5zZW5kKFxuICAgICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgICB7IGFjdGlvbjogJ2FkZEVsZW1lbnQnIH0sXG4gICAgICAgICAgICBbdGhpcy5yZWYsIG5vZGUudG9KU09OKCksIGluZGV4XVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1vdmVJbmRleChub2RlLCB0aGlzLmNoaWxkcmVuLCB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKSwgdHJ1ZSlcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHB1cmVCZWZvcmUgPSBuZXh0RWxlbWVudChiZWZvcmUpXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGNvbnN0IGluZGV4ID0gbW92ZUluZGV4KFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgdGhpcy5wdXJlQ2hpbGRyZW4sXG4gICAgICAgICAgcHVyZUJlZm9yZVxuICAgICAgICAgICAgPyB0aGlzLnB1cmVDaGlsZHJlbi5pbmRleE9mKHB1cmVCZWZvcmUpXG4gICAgICAgICAgICA6IHRoaXMucHVyZUNoaWxkcmVuLmxlbmd0aFxuICAgICAgICApXG4gICAgICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgICAgIGlmICh0YXNrQ2VudGVyICYmIGluZGV4ID49IDApIHtcbiAgICAgICAgICByZXR1cm4gdGFza0NlbnRlci5zZW5kKFxuICAgICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgICB7IGFjdGlvbjogJ21vdmVFbGVtZW50JyB9LFxuICAgICAgICAgICAgW25vZGUucmVmLCB0aGlzLnJlZiwgaW5kZXhdXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5vZGUgYWZ0ZXIgc3BlY2lmaWVkIG5vZGUuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBub2RlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhZnRlclxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIGluc2VydEFmdGVyIChub2RlLCBhZnRlcikge1xuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IGFmdGVyIHx8IChub2RlLnByZXZpb3VzU2libGluZyAmJiBub2RlLnByZXZpb3VzU2libGluZyA9PT0gYWZ0ZXIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgIGxpbmtQYXJlbnQobm9kZSwgdGhpcylcbiAgICAgIGluc2VydEluZGV4KG5vZGUsIHRoaXMuY2hpbGRyZW4sIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhZnRlcikgKyAxLCB0cnVlKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0aGlzLmRvY0lkKSB7XG4gICAgICAgIHJlZ2lzdGVyTm9kZSh0aGlzLmRvY0lkLCBub2RlKVxuICAgICAgfVxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpbnNlcnRJbmRleChcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIHRoaXMucHVyZUNoaWxkcmVuLFxuICAgICAgICAgIHRoaXMucHVyZUNoaWxkcmVuLmluZGV4T2YocHJldmlvdXNFbGVtZW50KGFmdGVyKSkgKyAxXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgdGFza0NlbnRlciA9IGdldFRhc2tDZW50ZXIodGhpcy5kb2NJZClcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKHRhc2tDZW50ZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFza0NlbnRlci5zZW5kKFxuICAgICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgICB7IGFjdGlvbjogJ2FkZEVsZW1lbnQnIH0sXG4gICAgICAgICAgICBbdGhpcy5yZWYsIG5vZGUudG9KU09OKCksIGluZGV4XVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1vdmVJbmRleChub2RlLCB0aGlzLmNoaWxkcmVuLCB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYWZ0ZXIpICsgMSwgdHJ1ZSlcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gbW92ZUluZGV4KFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgdGhpcy5wdXJlQ2hpbGRyZW4sXG4gICAgICAgICAgdGhpcy5wdXJlQ2hpbGRyZW4uaW5kZXhPZihwcmV2aW91c0VsZW1lbnQoYWZ0ZXIpKSArIDFcbiAgICAgICAgKVxuICAgICAgICBjb25zdCB0YXNrQ2VudGVyID0gZ2V0VGFza0NlbnRlcih0aGlzLmRvY0lkKVxuICAgICAgICBpZiAodGFza0NlbnRlciAmJiBpbmRleCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgICAgICdkb20nLFxuICAgICAgICAgICAgeyBhY3Rpb246ICdtb3ZlRWxlbWVudCcgfSxcbiAgICAgICAgICAgIFtub2RlLnJlZiwgdGhpcy5yZWYsIGluZGV4XVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjaGlsZCBub2RlLCBhbmQgZGVjaWRlIHdoZXRoZXIgaXQgc2hvdWxkIGJlIGRlc3Ryb3llZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5vZGVcbiAgICogQHBhcmFtIHtib29sZWFufSBwcmVzZXJ2ZWRcbiAgICovXG4gIHJlbW92ZUNoaWxkIChub2RlLCBwcmVzZXJ2ZWQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICByZW1vdmVJbmRleChub2RlLCB0aGlzLmNoaWxkcmVuLCB0cnVlKVxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgcmVtb3ZlSW5kZXgobm9kZSwgdGhpcy5wdXJlQ2hpbGRyZW4pXG4gICAgICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgICAgIGlmICh0YXNrQ2VudGVyKSB7XG4gICAgICAgICAgdGFza0NlbnRlci5zZW5kKFxuICAgICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgICB7IGFjdGlvbjogJ3JlbW92ZUVsZW1lbnQnIH0sXG4gICAgICAgICAgICBbbm9kZS5yZWZdXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcHJlc2VydmVkKSB7XG4gICAgICBub2RlLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbGwgY2hpbGQgbm9kZXMuXG4gICAqL1xuICBjbGVhciAoKSB7XG4gICAgY29uc3QgdGFza0NlbnRlciA9IGdldFRhc2tDZW50ZXIodGhpcy5kb2NJZClcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICh0YXNrQ2VudGVyKSB7XG4gICAgICB0aGlzLnB1cmVDaGlsZHJlbi5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICB0YXNrQ2VudGVyLnNlbmQoXG4gICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgeyBhY3Rpb246ICdyZW1vdmVFbGVtZW50JyB9LFxuICAgICAgICAgIFtub2RlLnJlZl1cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgbm9kZS5kZXN0cm95KClcbiAgICB9KVxuICAgIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID0gMFxuICAgIHRoaXMucHVyZUNoaWxkcmVuLmxlbmd0aCA9IDBcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gYXR0cmlidXRlLCBhbmQgZGVjaWRlIHdoZXRoZXIgdGhlIHRhc2sgc2hvdWxkIGJlIHNlbmQgdG8gbmF0aXZlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuICAgKi9cbiAgc2V0QXR0ciAoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYgKHRoaXMuYXR0cltrZXldID09PSB2YWx1ZSAmJiBzaWxlbnQgIT09IGZhbHNlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5hdHRyW2tleV0gPSB2YWx1ZVxuICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgaWYgKCFzaWxlbnQgJiYgdGFza0NlbnRlcikge1xuICAgICAgY29uc3QgcmVzdWx0ID0ge31cbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgJ2RvbScsXG4gICAgICAgIHsgYWN0aW9uOiAndXBkYXRlQXR0cnMnIH0sXG4gICAgICAgIFt0aGlzLnJlZiwgcmVzdWx0XVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYmF0Y2hlZCBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gYmF0Y2hlZEF0dHJzXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2lsZW50XG4gICAqL1xuICBzZXRBdHRycyAoYmF0Y2hlZEF0dHJzLCBzaWxlbnQpIHtcbiAgICBpZiAoaXNFbXB0eShiYXRjaGVkQXR0cnMpKSByZXR1cm5cbiAgICBjb25zdCBtdXRhdGlvbnMgPSB7fVxuICAgIGZvciAoY29uc3Qga2V5IGluIGJhdGNoZWRBdHRycykge1xuICAgICAgaWYgKHRoaXMuYXR0cltrZXldICE9PSBiYXRjaGVkQXR0cnNba2V5XSkge1xuICAgICAgICB0aGlzLmF0dHJba2V5XSA9IGJhdGNoZWRBdHRyc1trZXldXG4gICAgICAgIG11dGF0aW9uc1trZXldID0gYmF0Y2hlZEF0dHJzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFpc0VtcHR5KG11dGF0aW9ucykpIHtcbiAgICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgICBpZiAoIXNpbGVudCAmJiB0YXNrQ2VudGVyKSB7XG4gICAgICAgIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgICAnZG9tJyxcbiAgICAgICAgICB7IGFjdGlvbjogJ3VwZGF0ZUF0dHJzJyB9LFxuICAgICAgICAgIFt0aGlzLnJlZiwgbXV0YXRpb25zXVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhIHN0eWxlIHByb3BlcnR5LCBhbmQgZGVjaWRlIHdoZXRoZXIgdGhlIHRhc2sgc2hvdWxkIGJlIHNlbmQgdG8gbmF0aXZlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuICAgKi9cbiAgc2V0U3R5bGUgKGtleSwgdmFsdWUsIHNpbGVudCkge1xuICAgIGlmICh0aGlzLnN0eWxlW2tleV0gPT09IHZhbHVlICYmIHNpbGVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnN0eWxlW2tleV0gPSB2YWx1ZVxuICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgaWYgKCFzaWxlbnQgJiYgdGFza0NlbnRlcikge1xuICAgICAgY29uc3QgcmVzdWx0ID0ge31cbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgJ2RvbScsXG4gICAgICAgIHsgYWN0aW9uOiAndXBkYXRlU3R5bGUnIH0sXG4gICAgICAgIFt0aGlzLnJlZiwgcmVzdWx0XVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYmF0Y2hlZCBzdHlsZSBwcm9wZXJ0aWVzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gYmF0Y2hlZFN0eWxlc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuICAgKi9cbiAgc2V0U3R5bGVzIChiYXRjaGVkU3R5bGVzLCBzaWxlbnQpIHtcbiAgICBpZiAoaXNFbXB0eShiYXRjaGVkU3R5bGVzKSkgcmV0dXJuXG4gICAgY29uc3QgbXV0YXRpb25zID0ge31cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBiYXRjaGVkU3R5bGVzKSB7XG4gICAgICBpZiAodGhpcy5zdHlsZVtrZXldICE9PSBiYXRjaGVkU3R5bGVzW2tleV0pIHtcbiAgICAgICAgdGhpcy5zdHlsZVtrZXldID0gYmF0Y2hlZFN0eWxlc1trZXldXG4gICAgICAgIG11dGF0aW9uc1trZXldID0gYmF0Y2hlZFN0eWxlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIGlmICghaXNFbXB0eShtdXRhdGlvbnMpKSB7XG4gICAgICBjb25zdCB0YXNrQ2VudGVyID0gZ2V0VGFza0NlbnRlcih0aGlzLmRvY0lkKVxuICAgICAgaWYgKCFzaWxlbnQgJiYgdGFza0NlbnRlcikge1xuICAgICAgICB0YXNrQ2VudGVyLnNlbmQoXG4gICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgeyBhY3Rpb246ICd1cGRhdGVTdHlsZScgfSxcbiAgICAgICAgICBbdGhpcy5yZWYsIG11dGF0aW9uc11cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUT0RPOiBkZXByZWNhdGVkXG4gICAqIFNldCBzdHlsZSBwcm9wZXJ0aWVzIGZyb20gY2xhc3MuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjbGFzc1N0eWxlXG4gICAqL1xuICBzZXRDbGFzc1N0eWxlIChjbGFzc1N0eWxlKSB7XG4gICAgLy8gcmVzZXQgcHJldmlvdXMgY2xhc3Mgc3R5bGUgdG8gZW1wdHkgc3RyaW5nXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5jbGFzc1N0eWxlKSB7XG4gICAgICB0aGlzLmNsYXNzU3R5bGVba2V5XSA9ICcnXG4gICAgfVxuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmNsYXNzU3R5bGUsIGNsYXNzU3R5bGUpXG4gICAgY29uc3QgdGFza0NlbnRlciA9IGdldFRhc2tDZW50ZXIodGhpcy5kb2NJZClcbiAgICBpZiAodGFza0NlbnRlcikge1xuICAgICAgdGFza0NlbnRlci5zZW5kKFxuICAgICAgICAnZG9tJyxcbiAgICAgICAgeyBhY3Rpb246ICd1cGRhdGVTdHlsZScgfSxcbiAgICAgICAgW3RoaXMucmVmLCB0aGlzLnRvU3R5bGUoKV1cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNsYXNzIGxpc3QuXG4gICAqIEBwYXJhbSB7YXJyYXl9IGNsYXNzTGlzdFxuICAgKi9cbiAgc2V0Q2xhc3NMaXN0IChjbGFzc0xpc3QpIHtcbiAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTGlzdCA9PT0gJ3N0cmluZydcbiAgICAgID8gY2xhc3NMaXN0LnNwbGl0KC9cXHMrLylcbiAgICAgIDogQXJyYXkuZnJvbShjbGFzc0xpc3QpXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykgJiYgY2xhc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdCA9IGNsYXNzZXNcbiAgICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgICBpZiAodGFza0NlbnRlcikge1xuICAgICAgICB0YXNrQ2VudGVyLnNlbmQoXG4gICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgeyBhY3Rpb246ICd1cGRhdGVDbGFzc0xpc3QnIH0sXG4gICAgICAgICAgW3RoaXMucmVmLCB0aGlzLmNsYXNzTGlzdC5zbGljZSgpXVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBldmVudCBoYW5kbGVyLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgdHlwZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudCBoYW5kbGVyXG4gICAqL1xuICBhZGRFdmVudCAodHlwZSwgaGFuZGxlciwgcGFyYW1zKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50KSB7XG4gICAgICB0aGlzLmV2ZW50ID0ge31cbiAgICB9XG4gICAgaWYgKCF0aGlzLmV2ZW50W3R5cGVdKSB7XG4gICAgICB0aGlzLmV2ZW50W3R5cGVdID0geyBoYW5kbGVyLCBwYXJhbXMgfVxuICAgICAgY29uc3QgdGFza0NlbnRlciA9IGdldFRhc2tDZW50ZXIodGhpcy5kb2NJZClcbiAgICAgIGlmICh0YXNrQ2VudGVyKSB7XG4gICAgICAgIHRhc2tDZW50ZXIuc2VuZChcbiAgICAgICAgICAnZG9tJyxcbiAgICAgICAgICB7IGFjdGlvbjogJ2FkZEV2ZW50JyB9LFxuICAgICAgICAgIFt0aGlzLnJlZiwgdHlwZV1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgaGFuZGxlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IHR5cGVcbiAgICovXG4gIHJlbW92ZUV2ZW50ICh0eXBlKSB7XG4gICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudFt0eXBlXSkge1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRbdHlwZV1cbiAgICAgIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKHRoaXMuZG9jSWQpXG4gICAgICBpZiAodGFza0NlbnRlcikge1xuICAgICAgICB0YXNrQ2VudGVyLnNlbmQoXG4gICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgeyBhY3Rpb246ICdyZW1vdmVFdmVudCcgfSxcbiAgICAgICAgICBbdGhpcy5yZWYsIHR5cGVdXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmlyZSBhbiBldmVudCBtYW51YWxseS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgdHlwZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudCBoYW5kbGVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNCdWJibGUgd2hldGhlciBvciBub3QgZXZlbnQgYnViYmxlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHt9IGFueXRoaW5nIHJldHVybmVkIGJ5IGhhbmRsZXIgZnVuY3Rpb25cbiAgICovXG4gIGZpcmVFdmVudCAodHlwZSwgZXZlbnQsIGlzQnViYmxlLCBvcHRpb25zKSB7XG4gICAgbGV0IHJlc3VsdCA9IG51bGxcbiAgICBsZXQgaXNTdG9wUHJvcGFnYXRpb24gPSBmYWxzZVxuICAgIGNvbnN0IGV2ZW50RGVzYyA9IHRoaXMuZXZlbnRbdHlwZV1cbiAgICBpZiAoZXZlbnREZXNjICYmIGV2ZW50KSB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gZXZlbnREZXNjLmhhbmRsZXJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaXNTdG9wUHJvcGFnYXRpb24gPSB0cnVlXG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnBhcmFtcykge1xuICAgICAgICByZXN1bHQgPSBoYW5kbGVyLmNhbGwodGhpcywgLi4ub3B0aW9ucy5wYXJhbXMsIGV2ZW50KVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGhhbmRsZXIuY2FsbCh0aGlzLCBldmVudClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzU3RvcFByb3BhZ2F0aW9uXG4gICAgICAmJiBpc0J1YmJsZVxuICAgICAgJiYgKEJVQkJMRV9FVkVOVFMuaW5kZXhPZih0eXBlKSAhPT0gLTEpXG4gICAgICAmJiB0aGlzLnBhcmVudE5vZGVcbiAgICAgICYmIHRoaXMucGFyZW50Tm9kZS5maXJlRXZlbnQpIHtcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSB0aGlzLnBhcmVudE5vZGVcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5maXJlRXZlbnQodHlwZSwgZXZlbnQsIGlzQnViYmxlKSAvLyBubyBvcHRpb25zXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgc3R5bGVzIG9mIGN1cnJlbnQgZWxlbWVudC5cbiAgICogQHJldHVybiB7b2JqZWN0fSBzdHlsZVxuICAgKi9cbiAgdG9TdHlsZSAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY2xhc3NTdHlsZSwgdGhpcy5zdHlsZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGN1cnJlbnQgZWxlbWVudCB0byBKU09OIGxpa2Ugb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IGVsZW1lbnRcbiAgICovXG4gIHRvSlNPTiAoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgcmVmOiB0aGlzLnJlZi50b1N0cmluZygpLFxuICAgICAgdHlwZTogdGhpcy50eXBlXG4gICAgfVxuICAgIGlmICghaXNFbXB0eSh0aGlzLmF0dHIpKSB7XG4gICAgICByZXN1bHQuYXR0ciA9IHRoaXMuYXR0clxuICAgIH1cbiAgICBpZiAodGhpcy5jbGFzc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmNsYXNzTGlzdCA9IHRoaXMuY2xhc3NMaXN0LnNsaWNlKClcbiAgICB9XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnRvU3R5bGUoKVxuICAgIGlmICghaXNFbXB0eShzdHlsZSkpIHtcbiAgICAgIHJlc3VsdC5zdHlsZSA9IHN0eWxlXG4gICAgfVxuICAgIGNvbnN0IGV2ZW50ID0gW11cbiAgICBmb3IgKGNvbnN0IHR5cGUgaW4gdGhpcy5ldmVudCkge1xuICAgICAgY29uc3QgeyBwYXJhbXMgfSA9IHRoaXMuZXZlbnRbdHlwZV1cbiAgICAgIGlmICghcGFyYW1zKSB7XG4gICAgICAgIGV2ZW50LnB1c2godHlwZSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBldmVudC5wdXNoKHsgdHlwZSwgcGFyYW1zIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChldmVudC5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5ldmVudCA9IGV2ZW50XG4gICAgfVxuICAgIGlmICh0aGlzLnB1cmVDaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5jaGlsZHJlbiA9IHRoaXMucHVyZUNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGNoaWxkLnRvSlNPTigpKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCB0byBIVE1MIGVsZW1lbnQgdGFnIHN0cmluZy5cbiAgICogQHJldHVybiB7c3Rpcm5nfSBodG1sXG4gICAqL1xuICB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuICc8JyArIHRoaXMudHlwZSArXG4gICAgJyBhdHRyPScgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmF0dHIpICtcbiAgICAnIHN0eWxlPScgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvU3R5bGUoKSkgKyAnPicgK1xuICAgIHRoaXMucHVyZUNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGNoaWxkLnRvU3RyaW5nKCkpLmpvaW4oJycpICtcbiAgICAnPC8nICsgdGhpcy50eXBlICsgJz4nXG4gIH1cbn1cblxuc2V0RWxlbWVudChFbGVtZW50KVxuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBDYWxsYmFja01hbmFnZXIgZnJvbSAnLi9DYWxsYmFja01hbmFnZXInXG5pbXBvcnQgRWxlbWVudCBmcm9tICcuLi92ZG9tL0VsZW1lbnQnXG5pbXBvcnQgeyB0eXBvZiB9IGZyb20gJy4uL3NoYXJlZC91dGlscydcbmltcG9ydCB7IG5vcm1hbGl6ZVByaW1pdGl2ZSB9IGZyb20gJy4vbm9ybWFsaXplJ1xuXG5sZXQgZmFsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fVxuXG4vLyBUaGUgQVBJIG9mIFRhc2tDZW50ZXIgd291bGQgYmUgcmUtZGVzaWduLlxuZXhwb3J0IGNsYXNzIFRhc2tDZW50ZXIge1xuICBjb25zdHJ1Y3RvciAoaWQsIHNlbmRUYXNrcykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaW5zdGFuY2VJZCcsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogU3RyaW5nKGlkKVxuICAgIH0pXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjYWxsYmFja01hbmFnZXInLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IG5ldyBDYWxsYmFja01hbmFnZXIoaWQpXG4gICAgfSlcbiAgICBmYWxsYmFjayA9IHNlbmRUYXNrcyB8fCBmdW5jdGlvbiAoKSB7fVxuICB9XG5cbiAgY2FsbGJhY2sgKGNhbGxiYWNrSWQsIGRhdGEsIGlmS2VlcEFsaXZlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsbGJhY2tNYW5hZ2VyLmNvbnN1bWUoY2FsbGJhY2tJZCwgZGF0YSwgaWZLZWVwQWxpdmUpXG4gIH1cblxuICByZWdpc3Rlckhvb2sgKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFja01hbmFnZXIucmVnaXN0ZXJIb29rKC4uLmFyZ3MpXG4gIH1cblxuICB0cmlnZ2VySG9vayAoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmNhbGxiYWNrTWFuYWdlci50cmlnZ2VySG9vayguLi5hcmdzKVxuICB9XG5cbiAgdXBkYXRlRGF0YSAoY29tcG9uZW50SWQsIG5ld0RhdGEsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZW5kKCdtb2R1bGUnLCB7XG4gICAgICBtb2R1bGU6ICdkb20nLFxuICAgICAgbWV0aG9kOiAndXBkYXRlQ29tcG9uZW50RGF0YSdcbiAgICB9LCBbY29tcG9uZW50SWQsIG5ld0RhdGEsIGNhbGxiYWNrXSlcbiAgfVxuXG4gIGRlc3Ryb3lDYWxsYmFjayAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsbGJhY2tNYW5hZ2VyLmNsb3NlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemUgYSB2YWx1ZS4gU3BlY2lhbGx5LCBpZiB0aGUgdmFsdWUgaXMgYSBmdW5jdGlvbiwgdGhlbiBnZW5lcmF0ZSBhIGZ1bmN0aW9uIGlkXG4gICAqIGFuZCBzYXZlIGl0IHRvIGBDYWxsYmFja01hbmFnZXJgLCBhdCBsYXN0IHJldHVybiB0aGUgZnVuY3Rpb24gaWQuXG4gICAqIEBwYXJhbSAge2FueX0gICAgICAgIHZcbiAgICogQHJldHVybiB7cHJpbWl0aXZlfVxuICAgKi9cbiAgbm9ybWFsaXplICh2KSB7XG4gICAgY29uc3QgdHlwZSA9IHR5cG9mKHYpXG4gICAgaWYgKHYgJiYgdiBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB2LnJlZlxuICAgIH1cbiAgICBpZiAodiAmJiB2Ll9pc1Z1ZSAmJiB2LiRlbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB2LiRlbC5yZWZcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdGdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbGxiYWNrTWFuYWdlci5hZGQodikudG9TdHJpbmcoKVxuICAgIH1cbiAgICByZXR1cm4gbm9ybWFsaXplUHJpbWl0aXZlKHYpXG4gIH1cblxuICBzZW5kICh0eXBlLCBwYXJhbXMsIGFyZ3MsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGFjdGlvbiwgY29tcG9uZW50LCByZWYsIG1vZHVsZSwgbWV0aG9kIH0gPSBwYXJhbXNcblxuICAgIGFyZ3MgPSBhcmdzLm1hcChhcmcgPT4gdGhpcy5ub3JtYWxpemUoYXJnKSlcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnZG9tJzpcbiAgICAgICAgcmV0dXJuIHRoaXNbYWN0aW9uXSh0aGlzLmluc3RhbmNlSWQsIGFyZ3MpXG4gICAgICBjYXNlICdjb21wb25lbnQnOlxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRIYW5kbGVyKHRoaXMuaW5zdGFuY2VJZCwgcmVmLCBtZXRob2QsIGFyZ3MsIE9iamVjdC5hc3NpZ24oeyBjb21wb25lbnQgfSwgb3B0aW9ucykpXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy5tb2R1bGVIYW5kbGVyKHRoaXMuaW5zdGFuY2VJZCwgbW9kdWxlLCBtZXRob2QsIGFyZ3MsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgY2FsbERPTSAoYWN0aW9uLCBhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXNbYWN0aW9uXSh0aGlzLmluc3RhbmNlSWQsIGFyZ3MpXG4gIH1cblxuICBjYWxsQ29tcG9uZW50IChyZWYsIG1ldGhvZCwgYXJncywgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEhhbmRsZXIodGhpcy5pbnN0YW5jZUlkLCByZWYsIG1ldGhvZCwgYXJncywgb3B0aW9ucylcbiAgfVxuXG4gIGNhbGxNb2R1bGUgKG1vZHVsZSwgbWV0aG9kLCBhcmdzLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlSGFuZGxlcih0aGlzLmluc3RhbmNlSWQsIG1vZHVsZSwgbWV0aG9kLCBhcmdzLCBvcHRpb25zKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0ICgpIHtcbiAgY29uc3QgRE9NX01FVEhPRFMgPSB7XG4gICAgY3JlYXRlRmluaXNoOiBnbG9iYWwuY2FsbENyZWF0ZUZpbmlzaCxcbiAgICB1cGRhdGVGaW5pc2g6IGdsb2JhbC5jYWxsVXBkYXRlRmluaXNoLFxuICAgIHJlZnJlc2hGaW5pc2g6IGdsb2JhbC5jYWxsUmVmcmVzaEZpbmlzaCxcblxuICAgIGNyZWF0ZUJvZHk6IGdsb2JhbC5jYWxsQ3JlYXRlQm9keSxcbiAgICByZWdpc3RlclN0eWxlU2hlZXRzOiBnbG9iYWwuY2FsbFJlZ2lzdGVyU3R5bGVTaGVldHMsXG4gICAgYWRkRWxlbWVudDogZ2xvYmFsLmNhbGxBZGRFbGVtZW50LFxuICAgIHJlbW92ZUVsZW1lbnQ6IGdsb2JhbC5jYWxsUmVtb3ZlRWxlbWVudCxcbiAgICBtb3ZlRWxlbWVudDogZ2xvYmFsLmNhbGxNb3ZlRWxlbWVudCxcbiAgICB1cGRhdGVBdHRyczogZ2xvYmFsLmNhbGxVcGRhdGVBdHRycyxcbiAgICB1cGRhdGVTdHlsZTogZ2xvYmFsLmNhbGxVcGRhdGVTdHlsZSxcbiAgICB1cGRhdGVDbGFzc0xpc3Q6IGdsb2JhbC5jYWxsVXBkYXRlQ2xhc3NMaXN0LFxuXG4gICAgYWRkRXZlbnQ6IGdsb2JhbC5jYWxsQWRkRXZlbnQsXG4gICAgcmVtb3ZlRXZlbnQ6IGdsb2JhbC5jYWxsUmVtb3ZlRXZlbnRcbiAgfVxuICBjb25zdCBwcm90byA9IFRhc2tDZW50ZXIucHJvdG90eXBlXG5cbiAgZm9yIChjb25zdCBuYW1lIGluIERPTV9NRVRIT0RTKSB7XG4gICAgY29uc3QgbWV0aG9kID0gRE9NX01FVEhPRFNbbmFtZV1cbiAgICBwcm90b1tuYW1lXSA9IG1ldGhvZCA/XG4gICAgICAoaWQsIGFyZ3MpID0+IG1ldGhvZChpZCwgLi4uYXJncykgOlxuICAgICAgKGlkLCBhcmdzKSA9PiBmYWxsYmFjayhpZCwgW3sgbW9kdWxlOiAnZG9tJywgbWV0aG9kOiBuYW1lLCBhcmdzIH1dLCAnLTEnKVxuICB9XG5cbiAgcHJvdG8uY29tcG9uZW50SGFuZGxlciA9IGdsb2JhbC5jYWxsTmF0aXZlQ29tcG9uZW50IHx8XG4gICAgKChpZCwgcmVmLCBtZXRob2QsIGFyZ3MsIG9wdGlvbnMpID0+XG4gICAgICBmYWxsYmFjayhpZCwgW3sgY29tcG9uZW50OiBvcHRpb25zLmNvbXBvbmVudCwgcmVmLCBtZXRob2QsIGFyZ3MgfV0pKVxuXG4gIHByb3RvLm1vZHVsZUhhbmRsZXIgPSBnbG9iYWwuY2FsbE5hdGl2ZU1vZHVsZSB8fFxuICAgICgoaWQsIG1vZHVsZSwgbWV0aG9kLCBhcmdzKSA9PlxuICAgICAgZmFsbGJhY2soaWQsIFt7IG1vZHVsZSwgbWV0aG9kLCBhcmdzIH1dKSlcbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBnZXREb2MgfSBmcm9tICcuLi92ZG9tL29wZXJhdGlvbidcblxuZnVuY3Rpb24gZmlyZUV2ZW50IChkb2N1bWVudCwgbm9kZUlkLCB0eXBlLCBldmVudCwgZG9tQ2hhbmdlcywgcGFyYW1zKSB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0UmVmKG5vZGVJZClcbiAgaWYgKGVsKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmZpcmVFdmVudChlbCwgdHlwZSwgZXZlbnQsIGRvbUNoYW5nZXMsIHBhcmFtcylcbiAgfVxuICByZXR1cm4gbmV3IEVycm9yKGBpbnZhbGlkIGVsZW1lbnQgcmVmZXJlbmNlIFwiJHtub2RlSWR9XCJgKVxufVxuXG5mdW5jdGlvbiBjYWxsYmFjayAoZG9jdW1lbnQsIGNhbGxiYWNrSWQsIGRhdGEsIGlmS2VlcEFsaXZlKSB7XG4gIHJldHVybiBkb2N1bWVudC50YXNrQ2VudGVyLmNhbGxiYWNrKGNhbGxiYWNrSWQsIGRhdGEsIGlmS2VlcEFsaXZlKVxufVxuXG5mdW5jdGlvbiBjb21wb25lbnRIb29rIChkb2N1bWVudCwgY29tcG9uZW50SWQsIHR5cGUsIGhvb2ssIG9wdGlvbnMpIHtcbiAgaWYgKCFkb2N1bWVudCB8fCAhZG9jdW1lbnQudGFza0NlbnRlcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIENhbid0IGZpbmQgXCJkb2N1bWVudFwiIG9yIFwidGFza0NlbnRlclwiLmApXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBsZXQgcmVzdWx0ID0gbnVsbFxuICB0cnkge1xuICAgIHJlc3VsdCA9IGRvY3VtZW50LnRhc2tDZW50ZXIudHJpZ2dlckhvb2soY29tcG9uZW50SWQsIHR5cGUsIGhvb2ssIG9wdGlvbnMpXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbSlMgRnJhbWV3b3JrXSBGYWlsZWQgdG8gdHJpZ2dlciB0aGUgXCIke3R5cGV9QCR7aG9va31cIiBob29rIG9uICR7Y29tcG9uZW50SWR9LmApXG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIEFjY2VwdCBjYWxscyBmcm9tIG5hdGl2ZSAoZXZlbnQgb3IgY2FsbGJhY2spLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gaWRcbiAqIEBwYXJhbSAge2FycmF5fSB0YXNrcyBsaXN0IHdpdGggYG1ldGhvZGAgYW5kIGBhcmdzYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjZWl2ZVRhc2tzIChpZCwgdGFza3MpIHtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2MoaWQpXG4gIGlmICghZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKGBbSlMgRnJhbWV3b3JrXSBGYWlsZWQgdG8gcmVjZWl2ZVRhc2tzLCBgXG4gICAgICArIGBpbnN0YW5jZSAoJHtpZH0pIGlzIG5vdCBhdmFpbGFibGUuYClcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheSh0YXNrcykpIHtcbiAgICByZXR1cm4gdGFza3MubWFwKHRhc2sgPT4ge1xuICAgICAgc3dpdGNoICh0YXNrLm1ldGhvZCkge1xuICAgICAgICBjYXNlICdjYWxsYmFjayc6IHJldHVybiBjYWxsYmFjayhkb2N1bWVudCwgLi4udGFzay5hcmdzKVxuICAgICAgICBjYXNlICdmaXJlRXZlbnRTeW5jJzpcbiAgICAgICAgY2FzZSAnZmlyZUV2ZW50JzogcmV0dXJuIGZpcmVFdmVudChkb2N1bWVudCwgLi4udGFzay5hcmdzKVxuICAgICAgICBjYXNlICdjb21wb25lbnRIb29rJzogcmV0dXJuIGNvbXBvbmVudEhvb2soZG9jdW1lbnQsIC4uLnRhc2suYXJncylcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY29uc3Qgd2VleE1vZHVsZXMgPSB7fVxuXG4vKipcbiAqIFJlZ2lzdGVyIG5hdGl2ZSBtb2R1bGVzIGluZm9ybWF0aW9uLlxuICogQHBhcmFtIHtvYmplY3R9IG5ld01vZHVsZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyTW9kdWxlcyAobmV3TW9kdWxlcykge1xuICBmb3IgKGNvbnN0IG5hbWUgaW4gbmV3TW9kdWxlcykge1xuICAgIGlmICghd2VleE1vZHVsZXNbbmFtZV0pIHtcbiAgICAgIHdlZXhNb2R1bGVzW25hbWVdID0ge31cbiAgICB9XG4gICAgbmV3TW9kdWxlc1tuYW1lXS5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgd2VleE1vZHVsZXNbbmFtZV1bbWV0aG9kXSA9IHRydWVcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3ZWV4TW9kdWxlc1tuYW1lXVttZXRob2QubmFtZV0gPSBtZXRob2QuYXJnc1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBtb2R1bGUgb3IgdGhlIG1ldGhvZCBoYXMgYmVlbiByZWdpc3RlcmVkLlxuICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIG5hbWUgKG9wdGlvbmFsKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNSZWdpc3RlcmVkTW9kdWxlIChuYW1lLCBtZXRob2QpIHtcbiAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuICEhKHdlZXhNb2R1bGVzW25hbWVdICYmIHdlZXhNb2R1bGVzW25hbWVdW21ldGhvZF0pXG4gIH1cbiAgcmV0dXJuICEhd2VleE1vZHVsZXNbbmFtZV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZHVsZURlc2NyaXB0aW9uIChuYW1lKSB7XG4gIHJldHVybiB3ZWV4TW9kdWxlc1tuYW1lXVxufVxuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJy4uL3Zkb20vV2VleEVsZW1lbnQnXG5cbmNvbnN0IHdlZXhDb21wb25lbnRzID0ge31cblxuLyoqXG4gKiBSZWdpc3RlciBuYXRpdmUgY29tcG9uZW50cyBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7YXJyYXl9IG5ld0NvbXBvbmVudHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50cyAobmV3Q29tcG9uZW50cykge1xuICBpZiAoQXJyYXkuaXNBcnJheShuZXdDb21wb25lbnRzKSkge1xuICAgIG5ld0NvbXBvbmVudHMuZm9yRWFjaChjb21wb25lbnQgPT4ge1xuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgd2VleENvbXBvbmVudHNbY29tcG9uZW50XSA9IHRydWVcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIHR5cGVvZiBjb21wb25lbnQudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgd2VleENvbXBvbmVudHNbY29tcG9uZW50LnR5cGVdID0gY29tcG9uZW50XG4gICAgICAgIHJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQudHlwZSwgY29tcG9uZW50Lm1ldGhvZHMpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiByZWdpc3RlcmVkLlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbXBvbmVudCBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1JlZ2lzdGVyZWRDb21wb25lbnQgKG5hbWUpIHtcbiAgcmV0dXJuICEhd2VleENvbXBvbmVudHNbbmFtZV1cbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLyBKUyBTZXJ2aWNlc1xuXG5leHBvcnQgY29uc3Qgc2VydmljZXMgPSBbXVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgSmF2YVNjcmlwdCBzZXJ2aWNlLlxuICogQSBKYXZhU2NyaXB0IHNlcnZpY2Ugb3B0aW9ucyBjb3VsZCBoYXZlIGEgc2V0IG9mIGxpZmVjeWNsZSBtZXRob2RzXG4gKiBmb3IgZWFjaCBXZWV4IGluc3RhbmNlLiBGb3IgZXhhbXBsZTogY3JlYXRlLCByZWZyZXNoLCBkZXN0cm95LlxuICogRm9yIHRoZSBKUyBmcmFtZXdvcmsgbWFpbnRhaW5lciBpZiB5b3Ugd2FudCB0byBzdXBwbHkgc29tZSBmZWF0dXJlc1xuICogd2hpY2ggbmVlZCB0byB3b3JrIHdlbGwgaW4gZGlmZmVyZW50IFdlZXggaW5zdGFuY2VzLCBldmVuIGluIGRpZmZlcmVudFxuICogZnJhbWV3b3JrcyBzZXBhcmF0ZWx5LiBZb3UgY2FuIG1ha2UgYSBKYXZhU2NyaXB0IHNlcnZpY2UgdG8gaW5pdFxuICogaXRzIHZhcmlhYmxlcyBvciBjbGFzc2VzIGZvciBlYWNoIFdlZXggaW5zdGFuY2Ugd2hlbiBpdCdzIGNyZWF0ZWRcbiAqIGFuZCByZWN5Y2xlIHRoZW0gd2hlbiBpdCdzIGRlc3Ryb3llZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvdWxkIGhhdmUgeyBjcmVhdGUsIHJlZnJlc2gsIGRlc3Ryb3kgfVxuICogICAgICAgICAgICAgICAgICAgICAgICAgbGlmZWN5Y2xlIG1ldGhvZHMuIEluIGNyZWF0ZSBtZXRob2QgaXQgc2hvdWxkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW4gb2JqZWN0IG9mIHdoYXQgdmFyaWFibGVzIG9yIGNsYXNzZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkIGJlIGluamVjdGVkIGludG8gdGhlIFdlZXggaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlciAobmFtZSwgb3B0aW9ucykge1xuICBpZiAoaGFzKG5hbWUpKSB7XG4gICAgY29uc29sZS53YXJuKGBTZXJ2aWNlIFwiJHtuYW1lfVwiIGhhcyBiZWVuIHJlZ2lzdGVyZWQgYWxyZWFkeSFgKVxuICB9XG4gIGVsc2Uge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKVxuICAgIHNlcnZpY2VzLnB1c2goeyBuYW1lLCBvcHRpb25zIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBVbnJlZ2lzdGVyIGEgSmF2YVNjcmlwdCBzZXJ2aWNlIGJ5IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyIChuYW1lKSB7XG4gIHNlcnZpY2VzLnNvbWUoKHNlcnZpY2UsIGluZGV4KSA9PiB7XG4gICAgaWYgKHNlcnZpY2UubmFtZSA9PT0gbmFtZSkge1xuICAgICAgc2VydmljZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBKYXZhU2NyaXB0IHNlcnZpY2Ugd2l0aCBhIGNlcnRhaW4gbmFtZSBleGlzdGVkLlxuICogQHBhcmFtICB7c3RyaW5nfSAgbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhcyAobmFtZSkge1xuICByZXR1cm4gaW5kZXhPZihuYW1lKSA+PSAwXG59XG5cbi8qKlxuICogRmluZCB0aGUgaW5kZXggb2YgYSBKYXZhU2NyaXB0IHNlcnZpY2UgYnkgbmFtZVxuICogQHBhcmFtICB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGluZGV4T2YgKG5hbWUpIHtcbiAgcmV0dXJuIHNlcnZpY2VzLm1hcChzZXJ2aWNlID0+IHNlcnZpY2UubmFtZSkuaW5kZXhPZihuYW1lKVxufVxuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGdldFRhc2tDZW50ZXIgfSBmcm9tICcuLi92ZG9tL29wZXJhdGlvbidcbmltcG9ydCB7IGlzUmVnaXN0ZXJlZE1vZHVsZSB9IGZyb20gJy4uL2FwaS9tb2R1bGUnXG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFjayAoaWQsIHR5cGUsIHZhbHVlKSB7XG4gIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKGlkKVxuICBpZiAoIXRhc2tDZW50ZXIgfHwgdHlwZW9mIHRhc2tDZW50ZXIuc2VuZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIEZhaWxlZCB0byBjcmVhdGUgdHJhY2tlciFgKVxuICAgIHJldHVyblxuICB9XG4gIGlmICghdHlwZSB8fCAhdmFsdWUpIHtcbiAgICBjb25zb2xlLndhcm4oYFtKUyBGcmFtZXdvcmtdIEludmFsaWQgdHJhY2sgdHlwZSAoJHt0eXBlfSkgb3IgdmFsdWUgKCR7dmFsdWV9KWApXG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgbGFiZWwgPSBganNmbS4ke3R5cGV9LiR7dmFsdWV9YFxuICB0cnkge1xuICAgIGlmIChpc1JlZ2lzdGVyZWRNb2R1bGUoJ3VzZXJUcmFjaycsICdhZGRQZXJmUG9pbnQnKSkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgIG1lc3NhZ2VbbGFiZWxdID0gJzQnXG4gICAgICB0YXNrQ2VudGVyLnNlbmQoJ21vZHVsZScsIHtcbiAgICAgICAgbW9kdWxlOiAndXNlclRyYWNrJyxcbiAgICAgICAgbWV0aG9kOiAnYWRkUGVyZlBvaW50J1xuICAgICAgfSwgW21lc3NhZ2VdKVxuICAgIH1cbiAgfVxuICBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0pTIEZyYW1ld29ya10gRmFpbGVkIHRvIHRyYWNlIFwiJHtsYWJlbH1cIiFgKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcnJvciAoLi4ubWVzc2FnZXMpIHtcbiAgaWYgKHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0pTIEZyYW1ld29ya10gYCwgLi4ubWVzc2FnZXMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUV4Y2VwdGlvbiAoZXJyKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci50b1N0cmluZygpKVxuICAgIH1cbiAgICBjYXRjaCAoZSkge31cbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHRocm93IGVyclxuICB9XG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IE5vZGUgZnJvbSAnLi9Ob2RlJ1xuaW1wb3J0IHsgdW5pcXVlSWQgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBOb2RlIHtcbiAgY29uc3RydWN0b3IgKHZhbHVlKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5ub2RlVHlwZSA9IDhcbiAgICB0aGlzLm5vZGVJZCA9IHVuaXF1ZUlkKClcbiAgICB0aGlzLnJlZiA9IHRoaXMubm9kZUlkXG4gICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdXG4gICAgdGhpcy5wdXJlQ2hpbGRyZW4gPSBbXVxuICB9XG5cbiAgLyoqXG4gICogQ29udmVydCB0byBIVE1MIGNvbW1lbnQgc3RyaW5nLlxuICAqIEByZXR1cm4ge3N0aXJuZ30gaHRtbFxuICAqL1xuICB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuICc8IS0tICcgKyB0aGlzLnZhbHVlICsgJyAtLT4nXG4gIH1cbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiogQ3JlYXRlIHRoZSBhY3Rpb24gb2JqZWN0LlxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuKiBAcGFyYW0ge2FycmF5fSBhcmd1bWVudHNcbiogQHJldHVybiB7b2JqZWN0fSBhY3Rpb25cbiovXG5mdW5jdGlvbiBjcmVhdGVBY3Rpb24gKG5hbWUsIGFyZ3MgPSBbXSkge1xuICByZXR1cm4geyBtb2R1bGU6ICdkb20nLCBtZXRob2Q6IG5hbWUsIGFyZ3M6IGFyZ3MgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0ZW5lciB7XG4gIGNvbnN0cnVjdG9yIChpZCwgaGFuZGxlcikge1xuICAgIHRoaXMuaWQgPSBpZFxuICAgIHRoaXMuYmF0Y2hlZCA9IGZhbHNlXG4gICAgdGhpcy51cGRhdGVzID0gW11cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaGFuZGxlcicsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGhhbmRsZXJcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignW0pTIFJ1bnRpbWVdIGludmFsaWQgcGFyYW1ldGVyLCBoYW5kbGVyIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgdGhlIFwiY3JlYXRlRmluaXNoXCIgc2lnbmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIGNyZWF0ZUZpbmlzaCAoY2FsbGJhY2spIHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVyXG4gICAgcmV0dXJuIGhhbmRsZXIoW2NyZWF0ZUFjdGlvbignY3JlYXRlRmluaXNoJyldLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHRoZSBcInVwZGF0ZUZpbmlzaFwiIHNpZ25hbC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7dW5kZWZpbmVkIHwgbnVtYmVyfSB0aGUgc2lnbmFsIHNlbnQgYnkgbmF0aXZlXG4gICAqL1xuICB1cGRhdGVGaW5pc2ggKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlclxuICAgIHJldHVybiBoYW5kbGVyKFtjcmVhdGVBY3Rpb24oJ3VwZGF0ZUZpbmlzaCcpXSwgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgXCJyZWZyZXNoRmluaXNoXCIgc2lnbmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIHJlZnJlc2hGaW5pc2ggKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlclxuICAgIHJldHVybiBoYW5kbGVyKFtjcmVhdGVBY3Rpb24oJ3JlZnJlc2hGaW5pc2gnKV0sIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgdGhlIFwiY3JlYXRlQm9keVwiIHNpZ25hbC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRcbiAgICogQHJldHVybiB7dW5kZWZpbmVkIHwgbnVtYmVyfSB0aGUgc2lnbmFsIHNlbnQgYnkgbmF0aXZlXG4gICAqL1xuICBjcmVhdGVCb2R5IChlbGVtZW50KSB7XG4gICAgY29uc3QgYm9keSA9IGVsZW1lbnQudG9KU09OKClcbiAgICBjb25zdCBjaGlsZHJlbiA9IGJvZHkuY2hpbGRyZW5cbiAgICBkZWxldGUgYm9keS5jaGlsZHJlblxuICAgIGNvbnN0IGFjdGlvbnMgPSBbY3JlYXRlQWN0aW9uKCdjcmVhdGVCb2R5JywgW2JvZHldKV1cbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgIGFjdGlvbnMucHVzaC5hcHBseShhY3Rpb25zLCBjaGlsZHJlbi5tYXAoY2hpbGQgPT4ge1xuICAgICAgICByZXR1cm4gY3JlYXRlQWN0aW9uKCdhZGRFbGVtZW50JywgW2JvZHkucmVmLCBjaGlsZCwgLTFdKVxuICAgICAgfSkpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFkZEFjdGlvbnMoYWN0aW9ucylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHRoZSBcImFkZEVsZW1lbnRcIiBzaWduYWwuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50XG4gICAqIEBwYXJhbSB7c3Rpcm5nfSByZWZlcmVuY2UgaWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZCB8IG51bWJlcn0gdGhlIHNpZ25hbCBzZW50IGJ5IG5hdGl2ZVxuICAgKi9cbiAgYWRkRWxlbWVudCAoZWxlbWVudCwgcmVmLCBpbmRleCkge1xuICAgIGlmICghKGluZGV4ID49IDApKSB7XG4gICAgICBpbmRleCA9IC0xXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFkZEFjdGlvbnMoY3JlYXRlQWN0aW9uKCdhZGRFbGVtZW50JywgW3JlZiwgZWxlbWVudC50b0pTT04oKSwgaW5kZXhdKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHRoZSBcInJlbW92ZUVsZW1lbnRcIiBzaWduYWwuXG4gICAqIEBwYXJhbSB7c3Rpcm5nfSByZWZlcmVuY2UgaWRcbiAgICogQHJldHVybiB7dW5kZWZpbmVkIHwgbnVtYmVyfSB0aGUgc2lnbmFsIHNlbnQgYnkgbmF0aXZlXG4gICAqL1xuICByZW1vdmVFbGVtZW50IChyZWYpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWYpKSB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gcmVmLm1hcCgocikgPT4gY3JlYXRlQWN0aW9uKCdyZW1vdmVFbGVtZW50JywgW3JdKSlcbiAgICAgIHJldHVybiB0aGlzLmFkZEFjdGlvbnMoYWN0aW9ucylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWRkQWN0aW9ucyhjcmVhdGVBY3Rpb24oJ3JlbW92ZUVsZW1lbnQnLCBbcmVmXSkpXG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgXCJtb3ZlRWxlbWVudFwiIHNpZ25hbC5cbiAgICogQHBhcmFtIHtzdGlybmd9IHRhcmdldCByZWZlcmVuY2UgaWRcbiAgICogQHBhcmFtIHtzdGlybmd9IHBhcmVudCByZWZlcmVuY2UgaWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZCB8IG51bWJlcn0gdGhlIHNpZ25hbCBzZW50IGJ5IG5hdGl2ZVxuICAgKi9cbiAgbW92ZUVsZW1lbnQgKHRhcmdldFJlZiwgcGFyZW50UmVmLCBpbmRleCkge1xuICAgIHJldHVybiB0aGlzLmFkZEFjdGlvbnMoY3JlYXRlQWN0aW9uKCdtb3ZlRWxlbWVudCcsIFt0YXJnZXRSZWYsIHBhcmVudFJlZiwgaW5kZXhdKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHRoZSBcInVwZGF0ZUF0dHJzXCIgc2lnbmFsLlxuICAgKiBAcGFyYW0ge3N0aXJuZ30gcmVmZXJlbmNlIGlkXG4gICAqIEBwYXJhbSB7c3Rpcm5nfSBrZXlcbiAgICogQHBhcmFtIHtzdGlybmd9IHZhbHVlXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZCB8IG51bWJlcn0gdGhlIHNpZ25hbCBzZW50IGJ5IG5hdGl2ZVxuICAgKi9cbiAgc2V0QXR0ciAocmVmLCBrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge31cbiAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgcmV0dXJuIHRoaXMuYWRkQWN0aW9ucyhjcmVhdGVBY3Rpb24oJ3VwZGF0ZUF0dHJzJywgW3JlZiwgcmVzdWx0XSkpXG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgXCJ1cGRhdGVTdHlsZVwiIHNpZ25hbCwgdXBkYXRlIGEgc29sZSBzdHlsZS5cbiAgICogQHBhcmFtIHtzdGlybmd9IHJlZmVyZW5jZSBpZFxuICAgKiBAcGFyYW0ge3N0aXJuZ30ga2V5XG4gICAqIEBwYXJhbSB7c3Rpcm5nfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIHNldFN0eWxlIChyZWYsIGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fVxuICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpcy5hZGRBY3Rpb25zKGNyZWF0ZUFjdGlvbigndXBkYXRlU3R5bGUnLCBbcmVmLCByZXN1bHRdKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHRoZSBcInVwZGF0ZVN0eWxlXCIgc2lnbmFsLlxuICAgKiBAcGFyYW0ge3N0aXJuZ30gcmVmZXJlbmNlIGlkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIHNldFN0eWxlcyAocmVmLCBzdHlsZSkge1xuICAgIHJldHVybiB0aGlzLmFkZEFjdGlvbnMoY3JlYXRlQWN0aW9uKCd1cGRhdGVTdHlsZScsIFtyZWYsIHN0eWxlXSkpXG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgXCJhZGRFdmVudFwiIHNpZ25hbC5cbiAgICogQHBhcmFtIHtzdGlybmd9IHJlZmVyZW5jZSBpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgdHlwZVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIGFkZEV2ZW50IChyZWYsIHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRBY3Rpb25zKGNyZWF0ZUFjdGlvbignYWRkRXZlbnQnLCBbcmVmLCB0eXBlXSkpXG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgXCJyZW1vdmVFdmVudFwiIHNpZ25hbC5cbiAgICogQHBhcmFtIHtzdGlybmd9IHJlZmVyZW5jZSBpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgdHlwZVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWQgfCBudW1iZXJ9IHRoZSBzaWduYWwgc2VudCBieSBuYXRpdmVcbiAgICovXG4gIHJlbW92ZUV2ZW50IChyZWYsIHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRBY3Rpb25zKGNyZWF0ZUFjdGlvbigncmVtb3ZlRXZlbnQnLCBbcmVmLCB0eXBlXSkpXG4gIH1cblxuICAvKipcbiAgICogRGVmYXVsdCBoYW5kbGVyLlxuICAgKiBAcGFyYW0ge29iamVjdCB8IGFycmF5fSBhY3Rpb25zXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge30gYW55dGhpbmcgcmV0dXJuZWQgYnkgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIGhhbmRsZXIgKGFjdGlvbnMsIGNiKSB7XG4gICAgcmV0dXJuIGNiICYmIGNiKClcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYWN0aW9ucyBpbnRvIHVwZGF0ZXMuXG4gICAqIEBwYXJhbSB7b2JqZWN0IHwgYXJyYXl9IGFjdGlvbnNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkIHwgbnVtYmVyfSB0aGUgc2lnbmFsIHNlbnQgYnkgbmF0aXZlXG4gICAqL1xuICBhZGRBY3Rpb25zIChhY3Rpb25zKSB7XG4gICAgY29uc3QgdXBkYXRlcyA9IHRoaXMudXBkYXRlc1xuICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShhY3Rpb25zKSkge1xuICAgICAgYWN0aW9ucyA9IFthY3Rpb25zXVxuICAgIH1cblxuICAgIGlmICh0aGlzLmJhdGNoZWQpIHtcbiAgICAgIHVwZGF0ZXMucHVzaC5hcHBseSh1cGRhdGVzLCBhY3Rpb25zKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBoYW5kbGVyKGFjdGlvbnMpXG4gICAgfVxuICB9XG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBUYXNrIGhhbmRsZXIgZm9yIGNvbW11bmljYXRpb24gYmV0d2VlbiBqYXZhc2NyaXB0IGFuZCBuYXRpdmUuXG4gKi9cblxuY29uc3QgaGFuZGxlck1hcCA9IHtcbiAgY3JlYXRlQm9keTogJ2NhbGxDcmVhdGVCb2R5JyxcbiAgYWRkRWxlbWVudDogJ2NhbGxBZGRFbGVtZW50JyxcbiAgcmVtb3ZlRWxlbWVudDogJ2NhbGxSZW1vdmVFbGVtZW50JyxcbiAgbW92ZUVsZW1lbnQ6ICdjYWxsTW92ZUVsZW1lbnQnLFxuICB1cGRhdGVBdHRyczogJ2NhbGxVcGRhdGVBdHRycycsXG4gIHVwZGF0ZVN0eWxlOiAnY2FsbFVwZGF0ZVN0eWxlJyxcbiAgYWRkRXZlbnQ6ICdjYWxsQWRkRXZlbnQnLFxuICByZW1vdmVFdmVudDogJ2NhbGxSZW1vdmVFdmVudCdcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSB0YXNrIGhhbmRsZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSB0YXNrSGFuZGxlclxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSGFuZGxlciAoaWQsIGhhbmRsZXIpIHtcbiAgY29uc3QgZGVmYXVsdEhhbmRsZXIgPSBoYW5kbGVyIHx8IGdsb2JhbC5jYWxsTmF0aXZlXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICh0eXBlb2YgZGVmYXVsdEhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbSlMgUnVudGltZV0gbm8gZGVmYXVsdCBoYW5kbGVyJylcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiB0YXNrSGFuZGxlciAodGFza3MpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGFza3MpKSB7XG4gICAgICB0YXNrcyA9IFt0YXNrc11cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSBkaXNwYXRjaFRhc2soaWQsIHRhc2tzW2ldLCBkZWZhdWx0SGFuZGxlcilcbiAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlcmUgaXMgYSBjb3JyZXNwb25kaW5nIGF2YWlsYWJsZSBoYW5kbGVyIGluIHRoZSBlbnZpcm9ubWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0F2YWlsYWJsZUhhbmRsZXIgKG1vZHVsZSwgbWV0aG9kKSB7XG4gIHJldHVybiBtb2R1bGUgPT09ICdkb20nXG4gICAgJiYgaGFuZGxlck1hcFttZXRob2RdXG4gICAgJiYgdHlwZW9mIGdsb2JhbFtoYW5kbGVyTWFwW21ldGhvZF1dID09PSAnZnVuY3Rpb24nXG59XG5cbi8qKlxuICogRGlzcGF0Y2ggdGhlIHRhc2sgdG8gdGhlIHNwZWNpZmllZCBoYW5kbGVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcGFyYW0ge29iamVjdH0gdGFza1xuICogQHBhcmFtIHtmdW5jdGlvbn0gZGVmYXVsdEhhbmRsZXJcbiAqIEByZXR1cm4ge251bWJlcn0gc2lnbmFsIHJldHVybmVkIGZyb20gbmF0aXZlXG4gKi9cbmZ1bmN0aW9uIGRpc3BhdGNoVGFzayAoaWQsIHRhc2ssIGRlZmF1bHRIYW5kbGVyKSB7XG4gIGNvbnN0IHsgbW9kdWxlLCBtZXRob2QsIGFyZ3MgfSA9IHRhc2tcblxuICBpZiAoaGFzQXZhaWxhYmxlSGFuZGxlcihtb2R1bGUsIG1ldGhvZCkpIHtcbiAgICByZXR1cm4gZ2xvYmFsW2hhbmRsZXJNYXBbbWV0aG9kXV0oaWQsIC4uLmFyZ3MsICctMScpXG4gIH1cblxuICByZXR1cm4gZGVmYXVsdEhhbmRsZXIoaWQsIFt0YXNrXSwgJy0xJylcbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQ29tbWVudCBmcm9tICcuL0NvbW1lbnQnXG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL0VsZW1lbnQnXG5pbXBvcnQgTGlzdGVuZXIgZnJvbSAnLi4vYnJpZGdlL0xpc3RlbmVyJ1xuaW1wb3J0IHsgVGFza0NlbnRlciB9IGZyb20gJy4uL2JyaWRnZS9UYXNrQ2VudGVyJ1xuaW1wb3J0IHsgY3JlYXRlSGFuZGxlciB9IGZyb20gJy4uL2JyaWRnZS9IYW5kbGVyJ1xuaW1wb3J0IHsgYWRkRG9jLCByZW1vdmVEb2MsIGFwcGVuZEJvZHksIHNldEJvZHkgfSBmcm9tICcuL29wZXJhdGlvbidcblxuLyoqXG4gKiBVcGRhdGUgYWxsIGNoYW5nZXMgZm9yIGFuIGVsZW1lbnQuXG4gKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IGNoYW5nZXNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRWxlbWVudCAoZWwsIGNoYW5nZXMpIHtcbiAgY29uc3QgYXR0cnMgPSBjaGFuZ2VzLmF0dHJzIHx8IHt9XG4gIGZvciAoY29uc3QgbmFtZSBpbiBhdHRycykge1xuICAgIGVsLnNldEF0dHIobmFtZSwgYXR0cnNbbmFtZV0sIHRydWUpXG4gIH1cbiAgY29uc3Qgc3R5bGUgPSBjaGFuZ2VzLnN0eWxlIHx8IHt9XG4gIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZSkge1xuICAgIGVsLnNldFN0eWxlKG5hbWUsIHN0eWxlW25hbWVdLCB0cnVlKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvY3VtZW50IHtcbiAgY29uc3RydWN0b3IgKGlkLCB1cmwsIGhhbmRsZXIpIHtcbiAgICBpZCA9IGlkID8gaWQudG9TdHJpbmcoKSA6ICcnXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5VUkwgPSB1cmxcblxuICAgIGFkZERvYyhpZCwgdGhpcylcbiAgICB0aGlzLm5vZGVNYXAgPSB7fVxuICAgIGNvbnN0IEwgPSBEb2N1bWVudC5MaXN0ZW5lciB8fCBMaXN0ZW5lclxuICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgTChpZCwgaGFuZGxlciB8fCBjcmVhdGVIYW5kbGVyKGlkLCBEb2N1bWVudC5oYW5kbGVyKSkgLy8gZGVwcmVjYXRlZFxuICAgIHRoaXMudGFza0NlbnRlciA9IG5ldyBUYXNrQ2VudGVyKGlkLCBoYW5kbGVyID8gKGlkLCAuLi5hcmdzKSA9PiBoYW5kbGVyKC4uLmFyZ3MpIDogRG9jdW1lbnQuaGFuZGxlcilcbiAgICB0aGlzLmNyZWF0ZURvY3VtZW50RWxlbWVudCgpXG4gIH1cblxuICAvKipcbiAgKiBHZXQgdGhlIG5vZGUgZnJvbSBub2RlTWFwLlxuICAqIEBwYXJhbSB7c3RyaW5nfSByZWZlcmVuY2UgaWRcbiAgKiBAcmV0dXJuIHtvYmplY3R9IG5vZGVcbiAgKi9cbiAgZ2V0UmVmIChyZWYpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlTWFwW3JlZl1cbiAgfVxuXG4gIC8qKlxuICAqIFR1cm4gb24gYmF0Y2hlZCB1cGRhdGVzLlxuICAqL1xuICBvcGVuICgpIHtcbiAgICB0aGlzLmxpc3RlbmVyLmJhdGNoZWQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICogVHVybiBvZmYgYmF0Y2hlZCB1cGRhdGVzLlxuICAqL1xuICBjbG9zZSAoKSB7XG4gICAgdGhpcy5saXN0ZW5lci5iYXRjaGVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIHRoZSBkb2N1bWVudCBlbGVtZW50LlxuICAqIEByZXR1cm4ge29iamVjdH0gZG9jdW1lbnRFbGVtZW50XG4gICovXG4gIGNyZWF0ZURvY3VtZW50RWxlbWVudCAoKSB7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgY29uc3QgZWwgPSBuZXcgRWxlbWVudCgnZG9jdW1lbnQnKVxuICAgICAgZWwuZG9jSWQgPSB0aGlzLmlkXG4gICAgICBlbC5vd25lckRvY3VtZW50ID0gdGhpc1xuICAgICAgZWwucm9sZSA9ICdkb2N1bWVudEVsZW1lbnQnXG4gICAgICBlbC5kZXB0aCA9IDBcbiAgICAgIGVsLnJlZiA9ICdfZG9jdW1lbnRFbGVtZW50J1xuICAgICAgdGhpcy5ub2RlTWFwLl9kb2N1bWVudEVsZW1lbnQgPSBlbFxuICAgICAgdGhpcy5kb2N1bWVudEVsZW1lbnQgPSBlbFxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsICdhcHBlbmRDaGlsZCcsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IChub2RlKSA9PiB7XG4gICAgICAgICAgYXBwZW5kQm9keSh0aGlzLCBub2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsICdpbnNlcnRCZWZvcmUnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAobm9kZSwgYmVmb3JlKSA9PiB7XG4gICAgICAgICAgYXBwZW5kQm9keSh0aGlzLCBub2RlLCBiZWZvcmUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRFbGVtZW50XG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGUgdGhlIGJvZHkgZWxlbWVudC5cbiAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAqIEBwYXJhbSB7b2JqY3R9IHByb3BzXG4gICogQHJldHVybiB7b2JqZWN0fSBib2R5IGVsZW1lbnRcbiAgKi9cbiAgY3JlYXRlQm9keSAodHlwZSwgcHJvcHMpIHtcbiAgICBpZiAoIXRoaXMuYm9keSkge1xuICAgICAgY29uc3QgZWwgPSBuZXcgRWxlbWVudCh0eXBlLCBwcm9wcylcbiAgICAgIHNldEJvZHkodGhpcywgZWwpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYm9keVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGFuIGVsZW1lbnQuXG4gICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWVcbiAgKiBAcGFyYW0ge29iamN0fSBwcm9wc1xuICAqIEByZXR1cm4ge29iamVjdH0gZWxlbWVudFxuICAqL1xuICBjcmVhdGVFbGVtZW50ICh0YWdOYW1lLCBwcm9wcykge1xuICAgIHJldHVybiBuZXcgRWxlbWVudCh0YWdOYW1lLCBwcm9wcylcbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBhbiBjb21tZW50LlxuICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICogQHJldHVybiB7b2JqZWN0fSBjb21tZW50XG4gICovXG4gIGNyZWF0ZUNvbW1lbnQgKHRleHQpIHtcbiAgICByZXR1cm4gbmV3IENvbW1lbnQodGV4dClcbiAgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIFN0eWxlU2hlZXRzLlxuICAqIEBwYXJhbSB7c3RyaW5nfSBzY29wZUlkXG4gICogQHJldHVybiB7YXJyYXk8b2JqZWN0Pn0gc3R5bGVTaGVldHNcbiAgKi9cbiAgcmVnaXN0ZXJTdHlsZVNoZWV0cyAoc2NvcGVJZCwgc3R5bGVTaGVldHMpIHtcbiAgICBjb25zdCBzaGVldHMgPSBBcnJheS5pc0FycmF5KHN0eWxlU2hlZXRzKSA/IHN0eWxlU2hlZXRzIDogW3N0eWxlU2hlZXRzXVxuICAgIGlmICh0aGlzLnRhc2tDZW50ZXIgJiYgc2hlZXRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFza0NlbnRlci5zZW5kKFxuICAgICAgICAnZG9tJyxcbiAgICAgICAgeyBhY3Rpb246ICdyZWdpc3RlclN0eWxlU2hlZXRzJyB9LFxuICAgICAgICBbc2NvcGVJZCwgc2hlZXRzXVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEZpcmUgYW4gZXZlbnQgb24gc3BlY2lmaWVkIGVsZW1lbnQgbWFudWFsbHkuXG4gICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRcbiAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgdHlwZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBvYmplY3RcbiAgKiBAcGFyYW0ge29iamVjdH0gZG9tIGNoYW5nZXNcbiAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICAqIEByZXR1cm4ge30gYW55dGhpbmcgcmV0dXJuZWQgYnkgaGFuZGxlciBmdW5jdGlvblxuICAqL1xuICBmaXJlRXZlbnQgKGVsLCB0eXBlLCBldmVudCwgZG9tQ2hhbmdlcywgb3B0aW9ucykge1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBldmVudCA9IGV2ZW50IHx8IHt9XG4gICAgZXZlbnQudHlwZSA9IGV2ZW50LnR5cGUgfHwgdHlwZVxuICAgIGV2ZW50LnRhcmdldCA9IGVsXG4gICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGVsXG4gICAgZXZlbnQudGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGlmIChkb21DaGFuZ2VzKSB7XG4gICAgICB1cGRhdGVFbGVtZW50KGVsLCBkb21DaGFuZ2VzKVxuICAgIH1cbiAgICBjb25zdCBpc0J1YmJsZSA9IHRoaXMuZ2V0UmVmKCdfcm9vdCcpLmF0dHJbJ2J1YmJsZSddID09PSAndHJ1ZSdcbiAgICByZXR1cm4gZWwuZmlyZUV2ZW50KHR5cGUsIGV2ZW50LCBpc0J1YmJsZSwgb3B0aW9ucylcbiAgfVxuXG4gIC8qKlxuICAqIERlc3Ryb3kgY3VycmVudCBkb2N1bWVudCwgYW5kIHJlbW92ZSBpdHNlbGYgZm9ybSBkb2NNYXAuXG4gICovXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMudGFza0NlbnRlci5kZXN0cm95Q2FsbGJhY2soKVxuICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyXG4gICAgZGVsZXRlIHRoaXMubm9kZU1hcFxuICAgIGRlbGV0ZSB0aGlzLnRhc2tDZW50ZXJcbiAgICByZW1vdmVEb2ModGhpcy5pZClcbiAgfVxufVxuXG4vLyBkZWZhdWx0IHRhc2sgaGFuZGxlclxuRG9jdW1lbnQuaGFuZGxlciA9IG51bGxcbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi4vdmRvbS9Eb2N1bWVudCdcbmltcG9ydCB7IGlzUmVnaXN0ZXJlZE1vZHVsZSwgZ2V0TW9kdWxlRGVzY3JpcHRpb24gfSBmcm9tICcuL21vZHVsZSdcbmltcG9ydCB7IGlzUmVnaXN0ZXJlZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0VGFza0NlbnRlciB9IGZyb20gJy4uL3Zkb20vb3BlcmF0aW9uJ1xuXG5jb25zdCBtb2R1bGVQcm94aWVzID0ge31cblxuZnVuY3Rpb24gc2V0SWQgKHdlZXgsIGlkKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3ZWV4LCAnW1tDdXJyZW50SW5zdGFuY2VJZF1dJywgeyB2YWx1ZTogaWQgfSlcbn1cblxuZnVuY3Rpb24gZ2V0SWQgKHdlZXgpIHtcbiAgcmV0dXJuIHdlZXhbJ1tbQ3VycmVudEluc3RhbmNlSWRdXSddXG59XG5cbmZ1bmN0aW9uIG1vZHVsZUdldHRlciAoaWQsIG1vZHVsZSwgbWV0aG9kKSB7XG4gIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKGlkKVxuICBpZiAoIXRhc2tDZW50ZXIgfHwgdHlwZW9mIHRhc2tDZW50ZXIuc2VuZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIEZhaWxlZCB0byBmaW5kIHRhc2tDZW50ZXIgKCR7aWR9KS5gKVxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuICguLi5hcmdzKSA9PiB0YXNrQ2VudGVyLnNlbmQoJ21vZHVsZScsIHsgbW9kdWxlLCBtZXRob2QgfSwgYXJncylcbn1cblxuZnVuY3Rpb24gbW9kdWxlU2V0dGVyIChpZCwgbW9kdWxlLCBtZXRob2QsIGZuKSB7XG4gIGNvbnN0IHRhc2tDZW50ZXIgPSBnZXRUYXNrQ2VudGVyKGlkKVxuICBpZiAoIXRhc2tDZW50ZXIgfHwgdHlwZW9mIHRhc2tDZW50ZXIuc2VuZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIEZhaWxlZCB0byBmaW5kIHRhc2tDZW50ZXIgKCR7aWR9KS5gKVxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdICR7bW9kdWxlfS4ke21ldGhvZH0gbXVzdCBiZSBhc3NpZ25lZCBhcyBhIGZ1bmN0aW9uLmApXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gZm4gPT4gdGFza0NlbnRlci5zZW5kKCdtb2R1bGUnLCB7IG1vZHVsZSwgbWV0aG9kIH0sIFtmbl0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlZXhJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChpZCwgY29uZmlnKSB7XG4gICAgc2V0SWQodGhpcywgU3RyaW5nKGlkKSlcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB7fVxuICAgIHRoaXMuZG9jdW1lbnQgPSBuZXcgRG9jdW1lbnQoaWQsIHRoaXMuY29uZmlnLmJ1bmRsZVVybClcbiAgICB0aGlzLnJlcXVpcmVNb2R1bGUgPSB0aGlzLnJlcXVpcmVNb2R1bGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaXNSZWdpc3RlcmVkTW9kdWxlID0gaXNSZWdpc3RlcmVkTW9kdWxlXG4gICAgdGhpcy5pc1JlZ2lzdGVyZWRDb21wb25lbnQgPSBpc1JlZ2lzdGVyZWRDb21wb25lbnRcbiAgfVxuXG4gIHJlcXVpcmVNb2R1bGUgKG1vZHVsZU5hbWUpIHtcbiAgICBjb25zdCBpZCA9IGdldElkKHRoaXMpXG4gICAgaWYgKCEoaWQgJiYgdGhpcy5kb2N1bWVudCAmJiB0aGlzLmRvY3VtZW50LnRhc2tDZW50ZXIpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbSlMgRnJhbWV3b3JrXSBGYWlsZWQgdG8gcmVxdWlyZU1vZHVsZShcIiR7bW9kdWxlTmFtZX1cIiksIGBcbiAgICAgICAgKyBgaW5zdGFuY2UgKCR7aWR9KSBkb2Vzbid0IGV4aXN0IGFueW1vcmUuYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHdhcm4gZm9yIHVua25vd24gbW9kdWxlXG4gICAgaWYgKCFpc1JlZ2lzdGVyZWRNb2R1bGUobW9kdWxlTmFtZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgW0pTIEZyYW1ld29ya10gdXNpbmcgdW5yZWdpc3RlcmVkIHdlZXggbW9kdWxlIFwiJHttb2R1bGVOYW1lfVwiYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBuZXcgbW9kdWxlIHByb3h5XG4gICAgY29uc3QgcHJveHlOYW1lID0gYCR7bW9kdWxlTmFtZX0jJHtpZH1gXG4gICAgaWYgKCFtb2R1bGVQcm94aWVzW3Byb3h5TmFtZV0pIHtcbiAgICAgIC8vIGNyZWF0ZSByZWdpc3RlcmVkIG1vZHVsZSBhcGlzXG4gICAgICBjb25zdCBtb2R1bGVEZWZpbmUgPSBnZXRNb2R1bGVEZXNjcmlwdGlvbihtb2R1bGVOYW1lKVxuICAgICAgY29uc3QgbW9kdWxlQXBpcyA9IHt9XG4gICAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgaW4gbW9kdWxlRGVmaW5lKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGVBcGlzLCBtZXRob2ROYW1lLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAoKSA9PiBtb2R1bGVHZXR0ZXIoaWQsIG1vZHVsZU5hbWUsIG1ldGhvZE5hbWUpLFxuICAgICAgICAgIHNldDogZm4gPT4gbW9kdWxlU2V0dGVyKGlkLCBtb2R1bGVOYW1lLCBtZXRob2ROYW1lLCBmbilcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gY3JlYXRlIG1vZHVsZSBQcm94eVxuICAgICAgaWYgKHR5cGVvZiBQcm94eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtb2R1bGVQcm94aWVzW3Byb3h5TmFtZV0gPSBuZXcgUHJveHkobW9kdWxlQXBpcywge1xuICAgICAgICAgIGdldCAodGFyZ2V0LCBtZXRob2ROYW1lKSB7XG4gICAgICAgICAgICBpZiAobWV0aG9kTmFtZSBpbiB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFttZXRob2ROYW1lXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbSlMgRnJhbWV3b3JrXSB1c2luZyB1bnJlZ2lzdGVyZWQgbWV0aG9kIFwiJHttb2R1bGVOYW1lfS4ke21ldGhvZE5hbWV9XCJgKVxuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZUdldHRlcihpZCwgbW9kdWxlTmFtZSwgbWV0aG9kTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbW9kdWxlUHJveGllc1twcm94eU5hbWVdID0gbW9kdWxlQXBpc1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVQcm94aWVzW3Byb3h5TmFtZV1cbiAgfVxuXG4gIHN1cHBvcnRzIChjb25kaXRpb24pIHtcbiAgICBpZiAodHlwZW9mIGNvbmRpdGlvbiAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsXG5cbiAgICBjb25zdCByZXMgPSBjb25kaXRpb24ubWF0Y2goL15AKFxcdyspXFwvKFxcdyspKFxcLihcXHcrKSk/JC9pKVxuICAgIGlmIChyZXMpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSByZXNbMV1cbiAgICAgIGNvbnN0IG5hbWUgPSByZXNbMl1cbiAgICAgIGNvbnN0IG1ldGhvZCA9IHJlc1s0XVxuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ21vZHVsZSc6IHJldHVybiBpc1JlZ2lzdGVyZWRNb2R1bGUobmFtZSwgbWV0aG9kKVxuICAgICAgICBjYXNlICdjb21wb25lbnQnOiByZXR1cm4gaXNSZWdpc3RlcmVkQ29tcG9uZW50KG5hbWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIHJlZ2lzdGVyU3R5bGVTaGVldCAoc3R5bGVzKSB7XG4gIC8vICAgaWYgKHRoaXMuZG9jdW1lbnQpIHtcbiAgLy8gICAgIHRoaXMuZG9jdW1lbnQucmVnaXN0ZXJTdHlsZVNoZWV0KHN0eWxlcylcbiAgLy8gICB9XG4gIC8vIH1cbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBpbml0IGFzIGluaXRUYXNrSGFuZGxlciB9IGZyb20gJy4uL2JyaWRnZS9UYXNrQ2VudGVyJ1xuaW1wb3J0IHsgcmVjZWl2ZVRhc2tzIH0gZnJvbSAnLi4vYnJpZGdlL3JlY2VpdmVyJ1xuaW1wb3J0IHsgcmVnaXN0ZXJNb2R1bGVzIH0gZnJvbSAnLi9tb2R1bGUnXG5pbXBvcnQgeyByZWdpc3RlckNvbXBvbmVudHMgfSBmcm9tICcuL2NvbXBvbmVudCdcbmltcG9ydCB7IHNlcnZpY2VzLCByZWdpc3RlciwgdW5yZWdpc3RlciB9IGZyb20gJy4vc2VydmljZSdcbmltcG9ydCB7IHRyYWNrIH0gZnJvbSAnLi4vYnJpZGdlL2RlYnVnJ1xuaW1wb3J0IFdlZXhJbnN0YW5jZSBmcm9tICcuL1dlZXhJbnN0YW5jZSdcbmltcG9ydCB7IGdldERvYyB9IGZyb20gJy4uL3Zkb20vb3BlcmF0aW9uJ1xuXG5sZXQgZnJhbWV3b3Jrc1xubGV0IHJ1bnRpbWVDb25maWdcblxuY29uc3QgdmVyc2lvblJlZ0V4cCA9IC9eXFxzKlxcL1xcLyAqKFxce1tefV0qXFx9KSAqXFxyP1xcbi9cblxuLyoqXG4gKiBEZXRlY3QgYSBKUyBCdW5kbGUgY29kZSBhbmQgbWFrZSBzdXJlIHdoaWNoIGZyYW1ld29yayBpdCdzIGJhc2VkIHRvLiBFYWNoIEpTXG4gKiBCdW5kbGUgc2hvdWxkIG1ha2Ugc3VyZSB0aGF0IGl0IHN0YXJ0cyB3aXRoIGEgbGluZSBvZiBKU09OIGNvbW1lbnQgYW5kIGlzXG4gKiBtb3JlIHRoYXQgb25lIGxpbmUuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGNvZGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gZ2V0QnVuZGxlVHlwZSAoY29kZSkge1xuICBjb25zdCByZXN1bHQgPSB2ZXJzaW9uUmVnRXhwLmV4ZWMoY29kZSlcbiAgaWYgKHJlc3VsdCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbmZvID0gSlNPTi5wYXJzZShyZXN1bHRbMV0pXG4gICAgICByZXR1cm4gaW5mby5mcmFtZXdvcmtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHt9XG4gIH1cblxuICAvLyBkZWZhdWx0IGJ1bmRsZSB0eXBlXG4gIHJldHVybiAnV2VleCdcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZXMgKGlkLCBlbnYsIGNvbmZpZykge1xuICAvLyBJbml0IEphdmFTY3JpcHQgc2VydmljZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gIGNvbnN0IHNlcnZpY2VNYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHNlcnZpY2VNYXAuc2VydmljZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgc2VydmljZXMuZm9yRWFjaCgoeyBuYW1lLCBvcHRpb25zIH0pID0+IHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoYFtKUyBSdW50aW1lXSBjcmVhdGUgc2VydmljZSAke25hbWV9LmApXG4gICAgfVxuICAgIGNvbnN0IGNyZWF0ZSA9IG9wdGlvbnMuY3JlYXRlXG4gICAgaWYgKGNyZWF0ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlKGlkLCBlbnYsIGNvbmZpZylcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzZXJ2aWNlTWFwLnNlcnZpY2UsIHJlc3VsdClcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzZXJ2aWNlTWFwLCByZXN1bHQuaW5zdGFuY2UpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBbSlMgUnVudGltZV0gRmFpbGVkIHRvIGNyZWF0ZSBzZXJ2aWNlICR7bmFtZX0uYClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIGRlbGV0ZSBzZXJ2aWNlTWFwLnNlcnZpY2UuaW5zdGFuY2VcbiAgT2JqZWN0LmZyZWV6ZShzZXJ2aWNlTWFwLnNlcnZpY2UpXG4gIHJldHVybiBzZXJ2aWNlTWFwXG59XG5cbmNvbnN0IGluc3RhbmNlVHlwZU1hcCA9IHt9XG5mdW5jdGlvbiBnZXRGcmFtZXdvcmtUeXBlIChpZCkge1xuICByZXR1cm4gaW5zdGFuY2VUeXBlTWFwW2lkXVxufVxuXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZUNvbnRleHQgKGlkLCBvcHRpb25zID0ge30sIGRhdGEpIHtcbiAgY29uc3Qgd2VleCA9IG5ldyBXZWV4SW5zdGFuY2UoaWQsIG9wdGlvbnMpXG4gIE9iamVjdC5mcmVlemUod2VleClcblxuICBjb25zdCBidW5kbGVUeXBlID0gb3B0aW9ucy5idW5kbGVUeXBlIHx8ICdWdWUnXG4gIGluc3RhbmNlVHlwZU1hcFtpZF0gPSBidW5kbGVUeXBlXG4gIGNvbnN0IGZyYW1ld29yayA9IHJ1bnRpbWVDb25maWcuZnJhbWV3b3Jrc1tidW5kbGVUeXBlXVxuICBpZiAoIWZyYW1ld29yaykge1xuICAgIHJldHVybiBuZXcgRXJyb3IoYFtKUyBGcmFtZXdvcmtdIEludmFsaWQgYnVuZGxlIHR5cGUgXCIke2J1bmRsZVR5cGV9XCIuYClcbiAgfVxuICB0cmFjayhpZCwgJ2J1bmRsZVR5cGUnLCBidW5kbGVUeXBlKVxuXG4gIC8vIHByZXBhcmUganMgc2VydmljZVxuICBjb25zdCBzZXJ2aWNlcyA9IGNyZWF0ZVNlcnZpY2VzKGlkLCB7XG4gICAgd2VleCxcbiAgICBjb25maWc6IG9wdGlvbnMsXG4gICAgY3JlYXRlZDogRGF0ZS5ub3coKSxcbiAgICBmcmFtZXdvcms6IGJ1bmRsZVR5cGUsXG4gICAgYnVuZGxlVHlwZVxuICB9LCBydW50aW1lQ29uZmlnKVxuICBPYmplY3QuZnJlZXplKHNlcnZpY2VzKVxuXG4gIC8vIHByZXBhcmUgcnVudGltZSBjb250ZXh0XG4gIGNvbnN0IHJ1bnRpbWVDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICBPYmplY3QuYXNzaWduKHJ1bnRpbWVDb250ZXh0LCBzZXJ2aWNlcywge1xuICAgIHdlZXgsXG4gICAgc2VydmljZXMgLy8gVGVtcG9yYXJ5IGNvbXBhdGlibGUgd2l0aCBzb21lIGxlZ2FjeSBBUElzIGluIFJheFxuICB9KVxuICBPYmplY3QuZnJlZXplKHJ1bnRpbWVDb250ZXh0KVxuXG4gIC8vIHByZXBhcmUgaW5zdGFuY2UgY29udGV4dFxuICBjb25zdCBpbnN0YW5jZUNvbnRleHQgPSBPYmplY3QuYXNzaWduKHt9LCBydW50aW1lQ29udGV4dClcbiAgaWYgKHR5cGVvZiBmcmFtZXdvcmsuY3JlYXRlSW5zdGFuY2VDb250ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgT2JqZWN0LmFzc2lnbihpbnN0YW5jZUNvbnRleHQsIGZyYW1ld29yay5jcmVhdGVJbnN0YW5jZUNvbnRleHQoaWQsIHJ1bnRpbWVDb250ZXh0LCBkYXRhKSlcbiAgfVxuICBPYmplY3QuZnJlZXplKGluc3RhbmNlQ29udGV4dClcbiAgcmV0dXJuIGluc3RhbmNlQ29udGV4dFxufVxuXG4vKipcbiAqIENoZWNrIHdoaWNoIGZyYW1ld29yayBhIGNlcnRhaW4gSlMgQnVuZGxlIGNvZGUgYmFzZWQgdG8uIEFuZCBjcmVhdGUgaW5zdGFuY2VcbiAqIGJ5IHRoaXMgZnJhbWV3b3JrLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcGFyYW0ge3N0cmluZ30gY29kZVxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UgKGlkLCBjb2RlLCBjb25maWcsIGRhdGEpIHtcbiAgaWYgKGluc3RhbmNlVHlwZU1hcFtpZF0pIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKGBUaGUgaW5zdGFuY2UgaWQgXCIke2lkfVwiIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCFgKVxuICB9XG5cbiAgLy8gSW5pdCBpbnN0YW5jZSBpbmZvLlxuICBjb25zdCBidW5kbGVUeXBlID0gZ2V0QnVuZGxlVHlwZShjb2RlKVxuICBpbnN0YW5jZVR5cGVNYXBbaWRdID0gYnVuZGxlVHlwZVxuXG4gIC8vIEluaXQgaW5zdGFuY2UgY29uZmlnLlxuICBjb25maWcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNvbmZpZyB8fCB7fSkpXG4gIGNvbmZpZy5lbnYgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbC5XWEVudmlyb25tZW50IHx8IHt9KSlcbiAgY29uZmlnLmJ1bmRsZVR5cGUgPSBidW5kbGVUeXBlXG5cbiAgY29uc3QgZnJhbWV3b3JrID0gcnVudGltZUNvbmZpZy5mcmFtZXdvcmtzW2J1bmRsZVR5cGVdXG4gIGlmICghZnJhbWV3b3JrKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihgW0pTIEZyYW1ld29ya10gSW52YWxpZCBidW5kbGUgdHlwZSBcIiR7YnVuZGxlVHlwZX1cIi5gKVxuICB9XG4gIGlmIChidW5kbGVUeXBlID09PSAnV2VleCcpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbSlMgRnJhbWV3b3JrXSBDT01QQVRJQklMSVRZIFdBUk5JTkc6IGBcbiAgICAgICsgYFdlZXggRFNMIDEuMCAoLndlKSBmcmFtZXdvcmsgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCEgYFxuICAgICAgKyBgSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IHZlcnNpb24gb2YgV2VleFNESywgYFxuICAgICAgKyBgeW91ciBwYWdlIHdvdWxkIGJlIGNyYXNoIGlmIHlvdSBzdGlsbCB1c2luZyB0aGUgXCIud2VcIiBmcmFtZXdvcmsuIGBcbiAgICAgICsgYFBsZWFzZSB1cGdyYWRlIGl0IHRvIFZ1ZS5qcyBvciBSYXguYClcbiAgfVxuXG4gIGNvbnN0IGluc3RhbmNlQ29udGV4dCA9IGNyZWF0ZUluc3RhbmNlQ29udGV4dChpZCwgY29uZmlnLCBkYXRhKVxuICBpZiAodHlwZW9mIGZyYW1ld29yay5jcmVhdGVJbnN0YW5jZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFRlbXBvcmFyeSBjb21wYXRpYmxlIHdpdGggc29tZSBsZWdhY3kgQVBJcyBpbiBSYXgsXG4gICAgLy8gc29tZSBSYXggcGFnZSBpcyB1c2luZyB0aGUgbGVnYWN5IFwiLndlXCIgZnJhbWV3b3JrLlxuICAgIGlmIChidW5kbGVUeXBlID09PSAnUmF4JyB8fCBidW5kbGVUeXBlID09PSAnV2VleCcpIHtcbiAgICAgIGNvbnN0IHJheEluc3RhbmNlQ29udGV4dCA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICBjb25maWcsXG4gICAgICAgIGNyZWF0ZWQ6IERhdGUubm93KCksXG4gICAgICAgIGZyYW1ld29yazogYnVuZGxlVHlwZVxuICAgICAgfSwgaW5zdGFuY2VDb250ZXh0KVxuICAgICAgcmV0dXJuIGZyYW1ld29yay5jcmVhdGVJbnN0YW5jZShpZCwgY29kZSwgY29uZmlnLCBkYXRhLCByYXhJbnN0YW5jZUNvbnRleHQpXG4gICAgfVxuICAgIHJldHVybiBmcmFtZXdvcmsuY3JlYXRlSW5zdGFuY2UoaWQsIGNvZGUsIGNvbmZpZywgZGF0YSwgaW5zdGFuY2VDb250ZXh0KVxuICB9XG4gIC8vIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIENhbid0IGZpbmQgYXZhaWxhYmxlIFwiY3JlYXRlSW5zdGFuY2VcIiBtZXRob2QgaW4gJHtidW5kbGVUeXBlfSFgKVxuICBydW5JbkNvbnRleHQoY29kZSwgaW5zdGFuY2VDb250ZXh0KVxufVxuXG4vKipcbiAqIFJ1biBqcyBjb2RlIGluIGEgc3BlY2lmaWMgY29udGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlXG4gKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICovXG5mdW5jdGlvbiBydW5JbkNvbnRleHQgKGNvZGUsIGNvbnRleHQpIHtcbiAgY29uc3Qga2V5cyA9IFtdXG4gIGNvbnN0IGFyZ3MgPSBbXVxuICBmb3IgKGNvbnN0IGtleSBpbiBjb250ZXh0KSB7XG4gICAga2V5cy5wdXNoKGtleSlcbiAgICBhcmdzLnB1c2goY29udGV4dFtrZXldKVxuICB9XG5cbiAgY29uc3QgYnVuZGxlID0gYFxuICAgIChmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gICAgICAke2NvZGV9XG4gICAgfSkoT2JqZWN0LmNyZWF0ZSh0aGlzKSlcbiAgYFxuXG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKC4uLmtleXMsIGJ1bmRsZSkpKC4uLmFyZ3MpXG59XG5cbi8qKlxuICogR2V0IHRoZSBKU09OIG9iamVjdCBvZiB0aGUgcm9vdCBlbGVtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGluc3RhbmNlSWRcbiAqL1xuZnVuY3Rpb24gZ2V0Um9vdCAoaW5zdGFuY2VJZCkge1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvYyhpbnN0YW5jZUlkKVxuICB0cnkge1xuICAgIGlmIChkb2N1bWVudCAmJiBkb2N1bWVudC5ib2R5KSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS50b0pTT04oKVxuICAgIH1cbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtKUyBGcmFtZXdvcmtdIEZhaWxlZCB0byBnZXQgdGhlIHZpcnR1YWwgZG9tIHRyZWUuYClcbiAgICByZXR1cm5cbiAgfVxufVxuXG5jb25zdCBtZXRob2RzID0ge1xuICBjcmVhdGVJbnN0YW5jZSxcbiAgY3JlYXRlSW5zdGFuY2VDb250ZXh0LFxuICBnZXRSb290LFxuICBnZXREb2N1bWVudDogZ2V0RG9jLFxuICByZWdpc3RlclNlcnZpY2U6IHJlZ2lzdGVyLFxuICB1bnJlZ2lzdGVyU2VydmljZTogdW5yZWdpc3RlcixcbiAgY2FsbEpTIChpZCwgdGFza3MpIHtcbiAgICBjb25zdCBmcmFtZXdvcmsgPSBmcmFtZXdvcmtzW2dldEZyYW1ld29ya1R5cGUoaWQpXVxuICAgIGlmIChmcmFtZXdvcmsgJiYgdHlwZW9mIGZyYW1ld29yay5yZWNlaXZlVGFza3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBmcmFtZXdvcmsucmVjZWl2ZVRhc2tzKGlkLCB0YXNrcylcbiAgICB9XG4gICAgcmV0dXJuIHJlY2VpdmVUYXNrcyhpZCwgdGFza3MpXG4gIH1cbn1cblxuLyoqXG4gKiBSZWdpc3RlciBtZXRob2RzIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGluc3RhbmNlLlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAqL1xuZnVuY3Rpb24gZ2VuSW5zdGFuY2UgKG1ldGhvZE5hbWUpIHtcbiAgbWV0aG9kc1ttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY29uc3QgaWQgPSBhcmdzWzBdXG4gICAgY29uc3QgdHlwZSA9IGdldEZyYW1ld29ya1R5cGUoaWQpXG4gICAgaWYgKHR5cGUgJiYgZnJhbWV3b3Jrc1t0eXBlXSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZnJhbWV3b3Jrc1t0eXBlXVttZXRob2ROYW1lXSguLi5hcmdzKVxuICAgICAgY29uc3QgaW5mbyA9IHsgZnJhbWV3b3JrOiB0eXBlIH1cblxuICAgICAgLy8gTGlmZWN5Y2xlIG1ldGhvZHNcbiAgICAgIGlmIChtZXRob2ROYW1lID09PSAncmVmcmVzaEluc3RhbmNlJykge1xuICAgICAgICBzZXJ2aWNlcy5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlZnJlc2ggPSBzZXJ2aWNlLm9wdGlvbnMucmVmcmVzaFxuICAgICAgICAgIGlmIChyZWZyZXNoKSB7XG4gICAgICAgICAgICByZWZyZXNoKGlkLCB7IGluZm8sIHJ1bnRpbWU6IHJ1bnRpbWVDb25maWcgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnZGVzdHJveUluc3RhbmNlJykge1xuICAgICAgICBzZXJ2aWNlcy5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgICAgIGNvbnN0IGRlc3Ryb3kgPSBzZXJ2aWNlLm9wdGlvbnMuZGVzdHJveVxuICAgICAgICAgIGlmIChkZXN0cm95KSB7XG4gICAgICAgICAgICBkZXN0cm95KGlkLCB7IGluZm8sIHJ1bnRpbWU6IHJ1bnRpbWVDb25maWcgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGRlbGV0ZSBpbnN0YW5jZVR5cGVNYXBbaWRdXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBFcnJvcihgW0pTIEZyYW1ld29ya10gVXNpbmcgaW52YWxpZCBpbnN0YW5jZSBpZCBgXG4gICAgICArIGBcIiR7aWR9XCIgd2hlbiBjYWxsaW5nICR7bWV0aG9kTmFtZX0uYClcbiAgfVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIG1ldGhvZHMgd2hpY2ggaW5pdCBlYWNoIGZyYW1ld29ya3MuXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gc2hhcmVkTWV0aG9kXG4gKi9cbmZ1bmN0aW9uIGFkYXB0TWV0aG9kIChtZXRob2ROYW1lLCBzaGFyZWRNZXRob2QpIHtcbiAgbWV0aG9kc1ttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgaWYgKHR5cGVvZiBzaGFyZWRNZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNoYXJlZE1ldGhvZCguLi5hcmdzKVxuICAgIH1cblxuICAgIC8vIFRPRE86IGRlcHJlY2F0ZWRcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcnVudGltZUNvbmZpZy5mcmFtZXdvcmtzKSB7XG4gICAgICBjb25zdCBmcmFtZXdvcmsgPSBydW50aW1lQ29uZmlnLmZyYW1ld29ya3NbbmFtZV1cbiAgICAgIGlmIChmcmFtZXdvcmsgJiYgZnJhbWV3b3JrW21ldGhvZE5hbWVdKSB7XG4gICAgICAgIGZyYW1ld29ya1ttZXRob2ROYW1lXSguLi5hcmdzKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0IChjb25maWcpIHtcbiAgcnVudGltZUNvbmZpZyA9IGNvbmZpZyB8fCB7fVxuICBmcmFtZXdvcmtzID0gcnVudGltZUNvbmZpZy5mcmFtZXdvcmtzIHx8IHt9XG4gIGluaXRUYXNrSGFuZGxlcigpXG5cbiAgLy8gSW5pdCBlYWNoIGZyYW1ld29yayBieSBgaW5pdGAgbWV0aG9kIGFuZCBgY29uZmlnYCB3aGljaCBjb250YWlucyB0aHJlZVxuICAvLyB2aXJ0dWFsLURPTSBDbGFzczogYERvY3VtZW50YCwgYEVsZW1lbnRgICYgYENvbW1lbnRgLCBhbmQgYSBKUyBicmlkZ2UgbWV0aG9kOlxuICAvLyBgc2VuZFRhc2tzKC4uLmFyZ3MpYC5cbiAgZm9yIChjb25zdCBuYW1lIGluIGZyYW1ld29ya3MpIHtcbiAgICBjb25zdCBmcmFtZXdvcmsgPSBmcmFtZXdvcmtzW25hbWVdXG4gICAgaWYgKHR5cGVvZiBmcmFtZXdvcmsuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZnJhbWV3b3JrLmluaXQoY29uZmlnKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHt9XG4gICAgfVxuICB9XG5cbiAgYWRhcHRNZXRob2QoJ3JlZ2lzdGVyQ29tcG9uZW50cycsIHJlZ2lzdGVyQ29tcG9uZW50cylcbiAgYWRhcHRNZXRob2QoJ3JlZ2lzdGVyTW9kdWxlcycsIHJlZ2lzdGVyTW9kdWxlcylcbiAgYWRhcHRNZXRob2QoJ3JlZ2lzdGVyTWV0aG9kcycpXG5cbiAgOyBbJ2Rlc3Ryb3lJbnN0YW5jZScsICdyZWZyZXNoSW5zdGFuY2UnXS5mb3JFYWNoKGdlbkluc3RhbmNlKVxuXG4gIHJldHVybiBtZXRob2RzXG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IE5vZGUgZnJvbSAnLi9Ob2RlJ1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9FbGVtZW50J1xuaW1wb3J0IENvbW1lbnQgZnJvbSAnLi9Db21tZW50J1xuaW1wb3J0IERvY3VtZW50IGZyb20gJy4vRG9jdW1lbnQnXG5cbmV4cG9ydCB7XG4gIHJlZ2lzdGVyRWxlbWVudCxcbiAgdW5yZWdpc3RlckVsZW1lbnQsXG4gIGlzV2VleEVsZW1lbnQsXG4gIGNsZWFyV2VleEVsZW1lbnRzXG59IGZyb20gJy4vV2VleEVsZW1lbnQnXG5cbmV4cG9ydCB7XG4gIERvY3VtZW50LFxuICBOb2RlLFxuICBFbGVtZW50LFxuICBDb21tZW50XG59XG4iLCIvKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRG9jdW1lbnQsIEVsZW1lbnQsIENvbW1lbnQgfSBmcm9tICcuLi92ZG9tJ1xuaW1wb3J0IExpc3RlbmVyIGZyb20gJy4uL2JyaWRnZS9MaXN0ZW5lcidcbmltcG9ydCB7IFRhc2tDZW50ZXIgfSBmcm9tICcuLi9icmlkZ2UvVGFza0NlbnRlcidcblxuY29uc3QgY29uZmlnID0ge1xuICBEb2N1bWVudCwgRWxlbWVudCwgQ29tbWVudCwgTGlzdGVuZXIsXG4gIFRhc2tDZW50ZXIsXG4gIHNlbmRUYXNrcyAoLi4uYXJncykge1xuICAgIGlmICh0eXBlb2YgY2FsbE5hdGl2ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNhbGxOYXRpdmUoLi4uYXJncylcbiAgICB9XG4gICAgcmV0dXJuIChnbG9iYWwuY2FsbE5hdGl2ZSB8fCAoKCkgPT4ge30pKSguLi5hcmdzKVxuICB9XG59XG5cbkRvY3VtZW50LmhhbmRsZXIgPSBjb25maWcuc2VuZFRhc2tzXG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBpbml0IGZyb20gJy4vaW5pdCdcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnXG5pbXBvcnQgeyByZWdpc3RlciwgdW5yZWdpc3RlciwgaGFzIH0gZnJvbSAnLi9zZXJ2aWNlJ1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZnVuY3Rpb24gZnJlZXplUHJvdG90eXBlICgpIHtcbiAgLy8gT2JqZWN0LmZyZWV6ZShjb25maWcuRWxlbWVudClcbiAgT2JqZWN0LmZyZWV6ZShjb25maWcuQ29tbWVudClcbiAgT2JqZWN0LmZyZWV6ZShjb25maWcuTGlzdGVuZXIpXG4gIE9iamVjdC5mcmVlemUoY29uZmlnLkRvY3VtZW50LnByb3RvdHlwZSlcbiAgLy8gT2JqZWN0LmZyZWV6ZShjb25maWcuRWxlbWVudC5wcm90b3R5cGUpXG4gIE9iamVjdC5mcmVlemUoY29uZmlnLkNvbW1lbnQucHJvdG90eXBlKVxuICBPYmplY3QuZnJlZXplKGNvbmZpZy5MaXN0ZW5lci5wcm90b3R5cGUpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2VydmljZTogeyByZWdpc3RlciwgdW5yZWdpc3RlciwgaGFzIH0sXG4gIGZyZWV6ZVByb3RvdHlwZSxcbiAgaW5pdCxcbiAgY29uZmlnXG59XG4iXSwibmFtZXMiOlsibGV0IiwiY29uc3QiLCJFbGVtZW50Iiwic3VwZXIiLCJ0YXNrQ2VudGVyIiwicHVyZUJlZm9yZSIsImluZGV4IiwidGhpcyIsImluaXQiLCJuYW1lIiwic2VydmljZXMiLCJpbml0VGFza0hhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7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
