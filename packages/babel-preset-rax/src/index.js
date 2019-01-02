import { declare } from '@babel/helper-plugin-utils';
import transformReactJSX from '@babel/plugin-transform-react-jsx';
import transformReactDisplayName from '@babel/plugin-transform-react-display-name';
import transformReactJSXSource from '@babel/plugin-transform-react-jsx-source';
import transformReactJSXSelf from '@babel/plugin-transform-react-jsx-self';

export default declare((api, opts) => {
  api.assertVersion(7);

  const pragma = opts.pragma || 'createElement';
  const pragmaFrag = opts.pragmaFrag || 'Fragment';
  const throwIfNamespace = opts.throwIfNamespace === undefined ? true : Boolean(opts.throwIfNamespace);
  const useBuiltIns = Boolean(opts.useBuiltIns);
  const development = opts.development;

  if (typeof development !== 'boolean') {
    throw new Error(
      "@babel/preset-rax 'development' option must be a boolean.",
    );
  }

  return {
    plugins: [
      [
        transformReactJSX,
        { pragma, pragmaFrag, throwIfNamespace, useBuiltIns },
      ],
      transformReactDisplayName,

      development && transformReactJSXSource,
      development && transformReactJSXSelf,
    ].filter(Boolean),
  };
});