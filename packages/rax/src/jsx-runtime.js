import { jsxWithValidation, jsxWithValidationDynamic, jsxWithValidationStatic } from './vdom/jsxValidator';
import { jsxRuntime as jsxProd } from './vdom/jsx';

/**
 * This module is adapted to react's jsx-runtime module.
 * @see：[introducing-the-new-jsx-transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.htm)
 */
const __DEV__ = process.env.NODE_ENV !== 'production';

const jsx = __DEV__ ? jsxWithValidationDynamic : jsxProd;
const jsxs = __DEV__ ? jsxWithValidationStatic : jsxProd;
const jsxDEV = __DEV__ ? jsxWithValidation : undefined;

export {
  jsx,
  jsxs,
  jsxDEV
};

