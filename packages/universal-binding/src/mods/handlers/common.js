import _ from 'simple-lodash';
import {prefixStyle} from '../utils';


export default class TimingHandler {

  binding = null;

  constructor(binding) {
    this.binding = binding;
    let {props} = binding.options;

    _.map(props, (prop) => {
      let {element, config} = prop;
      if (config && element) {
        if (config.perspective) {
          if (element.parentNode) {
            element.parentNode.style[prefixStyle('transformStyle')] = 'preserve-3d';
            element.parentNode.style[prefixStyle('perspective')] = config.perspective + 'px';
            element.parentNode.style[prefixStyle('perspectiveOrigin')] = '0 0';
          }
        }
        if (config.transformOrigin) {
          element.style[prefixStyle('transformOrigin')] = config.transformOrigin;
        }
      }
    });
  }

  destroy() {

  }
};