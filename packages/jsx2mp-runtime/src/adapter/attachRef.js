// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp } from 'universal-env';

export default function(instance, bindComRef) {
  if (bindComRef) {
    if (instance.__isReactiveComponent && !instance._render._forwardRef) {
      console.warn('Warning: Do not attach ref to function component because they don’t have instances.');
    }
    triggerSetRef(instance, bindComRef);
  }
}

function triggerSetRef(instance, bindComRef) {
  // In function component, it shouldn't return component instance, so return null
  const current = instance.__isReactiveComponent ? null : instance;
  if (isMiniApp) {
    bindComRef(current);
  } else if (isWeChatMiniProgram || isByteDanceMicroApp) {
    // If is function component, it will use the triggerEvent in useImperativeHandle
    instance._internal.triggerEvent('ComRef', current);
  }
}
