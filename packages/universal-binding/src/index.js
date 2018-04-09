/** @jsx createElement */

'use strict';

import {isWeex, isWeb} from 'universal-env';
import {parse} from './mods/expression_parser';

let isSupportNewBinding = true;
let isSupportBinding = true;
let WeexBinding;
let WebBinding = {};
if (isWeb) {
  WebBinding = require('./mods/binding');
}
try {
  WeexBinding = __weex_require__('@weex-module/binding');
  isSupportNewBinding = typeof WeexBinding.bind === 'function'
    && typeof WeexBinding.unbind === 'function'
    && typeof WeexBinding.unbindAll === 'function'
    && typeof WeexBinding.getComputedStyle === 'function';
} catch (e) {
  isSupportNewBinding = false;
}

if (!isSupportNewBinding) {
  try {
    WeexBinding = __weex_require__('@weex-module/expressionBinding');
  } catch (err) {
    isSupportBinding = false;
  }
}


function formatExpression(expression) {
  if (expression && expression.origin) {
    expression.transformed = expression.transformed || parse(expression.origin);
  }
  return expression;
}

// 统一回调参数
function fixCallback(callback) {
  return function(params = {}) {
    if (typeof callback === 'function') {
      return callback({
        state: params.state === 'end' ? 'exit' : params.state,
        t: params.t !== undefined ? params.t : params.deltaT
      });
    }
  };
}


export default {
  // 是否支持新版本的binding
  isSupportNewBinding,
  // 是否支持binding
  isSupportBinding,
  _bindingInstances: [],
  /**
   * 绑定
   * @param options 参数
   * @example
   {
     anchor:blockRef,
     eventType:'pan',
     props: [
     {
       element:blockRef,
       property:'transform.translateX',
       expression:{
         origin:"x+1",
         transformed:"{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":1}]}"
       }
     }
    ]
   }
   */
  bind(options, callback = function() {
  }) {
    if (!options) {
      throw new Error('should pass options for binding');
    }

    options.exitExpression = formatExpression(options.exitExpression);

    if (options.props) {
      options.props.forEach((prop) => {
        prop.expression = formatExpression(prop.expression);
      });
    }

    if (isWeex && WeexBinding) {
      if (isSupportNewBinding) {
        return WeexBinding.bind(options, options && options.eventType === 'timing' ? fixCallback(callback) : callback);
      } else {
        WeexBinding.enableBinding(options.anchor, options.eventType);
        // 处理expression的参数格式
        let expressionArgs = options.props.map((prop) => {
          return {
            element: prop.element,
            property: prop.property,
            expression: prop.expression.transformed
          };
        });
        WeexBinding.createBinding(options.anchor, options.eventType, '', expressionArgs, callback);
        return;
      }
    }

    return WebBinding.bind(options, callback);
  },
  /**
   *  @param {object} options
   *  @example
   *  {eventType:'pan',
   *   token:self.gesToken}
   */
  unbind(options) {
    if (!options) {
      throw new Error('should pass options for binding');
    }
    if (isWeex && WeexBinding) {
      if (isSupportNewBinding) {
        return WeexBinding.unbind(options);
      } else {
        return WeexBinding.disableBinding(options.anchor, options.eventType);
      }
      return;
    }
    return WebBinding.unbind(options);
  },
  unbindAll() {
    if (isWeex && WeexBinding) {
      if (isSupportNewBinding) {
        return WeexBinding.unbindAll();
      } else {
        return WeexBinding.disableAll();
      }
      return;
    }
    return WebBinding.unbindAll();
  },
  getComputedStyle(el) {
    if (isWeex) {
      if (isSupportNewBinding) {
        return WeexBinding.getComputedStyle(el);
      } else {
        return {};
      }
    } else {
      return WebBinding.getComputedStyle(el);
    }
  }
};


