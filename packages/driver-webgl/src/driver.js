import * as THREE from 'three';
import ThreeComponent from './components';

const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const ID = 'uuid';
const nodeMaps = {};

let renderer = null;
let scene = null;
let camera = null;

function createElement(type, props) {
  return ThreeComponent[type].init(props);
}

const Driver = {
  getElementById(id) {
    return nodeMaps[id];
  },

  createBody() {
    if (document.getElementsByTagName('canvas').length !== 0) {
      return document.getElementsByName('canvas').shift();
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
  },

  createEmpty() {
    return createElement({
      type: 'object-3d'
    });
  },

  createElement(type, props) {
    let node = createElement(type, props);
    this.setNativeProps(node, props);
    return node;
  },

  appendChild(node, parent) {
    if (node.type === 'Scene') {
      node.renderer = renderer;
      scene = node;
      return;
    }
    if (node.isCamera) {
      camera = node;
      return;
    }
    if (parent.type === 'Scene' && node.isObject3D) {
      parent.add(node);
    } else {
      if (parent.isObject3D) {
        if (node.isGeometry || node.isBufferGeometry) parent.geometry = node;
        if (node.isMaterial) parent.material = node;
      }
    }
    return renderer.render(scene, camera);
  },

  removeChild(node, parent) {
    parent = parent || node.parent;
    let id = node[ID];
    if (id != null) {
      nodeMaps[id] = null;
    }
    return parent.remove(node);
  },

  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parent;
    this.removeChild(oldChild, parent);
    this.appendChild(newChild, parent);
  },

  addEventListener(node, eventName, eventHandler) {
    if (node.type === 'Scene') {
      return document.body.addEventListener(eventName, eventHandler);
    }
    return node;
  },

  removeEventListener(node, eventName, eventHandler) {
    if (node.type === 'Scene') {
      return document.body.removeEventListener(eventName, eventHandler);
    }
    return node;
  },

  removeAttribute(node, propKey, propValue) {
    // Noop
  },

  setAttribute(node, propKey, propValue) {
    if (propKey == ID) {
      nodeMaps[propValue] = node;
    }
    node.updateProperty(propKey, propValue);
    return node;
  },

  afterRender() {
    render();
  },

  setNativeProps(node, props) {
    for (let prop in props) {
      let value = props[prop];
      if (prop === CHILDREN) {
        continue;
      }
      if (value != null) {
        if (EVENT_PREFIX_REGEXP.test(prop)) {
          let eventName = prop.slice(2).toLowerCase();
          this.addEventListener(node, eventName, value);
        } else {
          this.setAttribute(node, prop, value);
        }
      }
    }
  }
};

const render = () => {
  window.requestAnimationFrame(render);
  renderer.render(scene, camera);
  scene.onFrame();
};

export default Driver;
