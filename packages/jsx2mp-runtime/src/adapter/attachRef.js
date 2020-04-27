// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp } from 'universal-env';

export default function(instance, bindComRef) {
  if (bindComRef) {
    if (instance.isFunctionComponent && !instance._render._forwardRef) {
      console.warn('Warning: Do not attach ref to function component because they don’t have instances.');
      triggerSetRef(null, bindComRef);
    } else {
      triggerSetRef(instance, bindComRef);
    }
  }
}

function triggerSetRef(instance, bindComRef) {
  if (isMiniApp) {
    bindComRef(instance);
  } else if (isWeChatMiniProgram || isByteDanceMicroApp) {
    instance._internal.triggerEvent('ComRef', instance);
  }
}
