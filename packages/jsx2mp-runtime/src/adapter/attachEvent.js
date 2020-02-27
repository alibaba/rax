/* global PROPS */
// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';

export default function(eventName, ...args) {
  if (isQuickApp) {
    // `this` point to page/component instance.
    const event = args[0];
    const et = event && (event.currentTarget || event._target);
    let dataset = et ? et.dataset : {};

    // when this.instance === null, it point to ux inner component
    if (this && !this.instance && this._parent) {
      this.instance = this._parent;
      if (dataset && JSON.stringify(dataset) === '{}') {
        const attrKeys = Object.keys(this._attrs);
        if (attrKeys.length > 0) {
          attrKeys.forEach((key) => {
            if (/data\W?/.test(key)) {
              const value = this._attrs[key];
              let _key = key.replace(/data/g, '');
              _key = _key.replace(/\w/, _key[0].toLowerCase());
              dataset[_key] = value;
            }
          });
        }
      }
    }
    let context = this.instance; // Context default to Rax component instance.

    const datasetArgs = [];
    // Universal event args
    const datasetKeys = Object.keys(dataset);
    if (datasetKeys.length > 0) {
      datasetKeys.forEach((key) => {
        if ('argContext' === key || 'arg-context' === key) {
          context = dataset[key] === 'this' ? this.instance : dataset[key];
        } else if (isDatasetArg(key)) {
          // eg. arg0, arg1, arg-0, arg-1
          const index = DATASET_ARG_REG.exec(key)[1];
          datasetArgs[index] = dataset[key];
        }
      });
    } else {
      const formatName = formatEventName(eventName);
      Object.keys(this[PROPS]).forEach(key => {
        if (`data-${formatName}-arg-context` === key) {
          context = this[PROPS][key] === 'this' ? this.instance : this[PROPS][key];
        } else if (isDatasetKebabArg(key)) {
          // `data-arg-` length is 9.
          const len = `data-${formatName}-arg-`.length;
          datasetArgs[key.slice(len)] = this[PROPS][key];
        }
      });
    }

    // quickapp
    const evt = Object.assign({}, args[0]);
    if (args[0] && args[0]._target && !args[0].currentTarget) {
      evt.currentTarget = Object.assign({}, args[0]._target);
      evt.currentTarget.dataset = args[0]._target._dataset;
    }

    const __args = datasetArgs.concat([evt, ...args.slice(1)]);

    if (this.instance._methods[eventName]) {
      return this.instance._methods[eventName].apply(context, __args);
    } else {
      console.warn(`instance._methods['${eventName}'] not exists.`);
    }
  } else {
    // `this` point to page/component instance.
    const event = args[0];
    let context = this.instance; // Context default to Rax component instance.

    const dataset = event && event.currentTarget ? event.currentTarget.dataset : {};
    const datasetArgs = [];
    // Universal event args
    const datasetKeys = Object.keys(dataset);
    if (datasetKeys.length > 0) {
      datasetKeys.forEach((key) => {
        if ('argContext' === key || 'arg-context' === key) {
          context = dataset[key] === 'this' ? this.instance : dataset[key];
        } else if (isDatasetArg(key)) {
          // eg. arg0, arg1, arg-0, arg-1
          const index = DATASET_ARG_REG.exec(key)[1];
          datasetArgs[index] = dataset[key];
        }
      });
    } else {
      const formatName = formatEventName(eventName);
      Object.keys(this[PROPS]).forEach(key => {
        if (`data-${formatName}-arg-context` === key) {
          context = this[PROPS][key] === 'this' ? this.instance : this[PROPS][key];
        } else if (isDatasetKebabArg(key)) {
          // `data-arg-` length is 9.
          const len = `data-${formatName}-arg-`.length;
          datasetArgs[key.slice(len)] = this[PROPS][key];
        }
      });
    }
    // Concat args.
    args = datasetArgs.concat(args);
    if (this.instance._methods[eventName]) {
      return this.instance._methods[eventName].apply(context, args);
    } else {
      console.warn(`instance._methods['${eventName}'] not exists.`);
    }
  }
};

const DATASET_KEBAB_ARG_REG = /data-\w+\d+-arg-\d+/;

function isDatasetKebabArg(str) {
  return DATASET_KEBAB_ARG_REG.test(str);
}

const DATASET_ARG_REG = /\w+-?[aA]rg?-?(\d+)/;

function isDatasetArg(str) {
  return DATASET_ARG_REG.test(str);
}

function formatEventName(name) {
  return name.replace('_', '');
}
