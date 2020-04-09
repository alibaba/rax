// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';
import nextTick from '../nextTick';

export default function(instance, bindComRef) {
  if (bindComRef) {
    if (instance.isFunctionComponent) {
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
  } else if (isWeChatMiniProgram) {
    // Wait register ref in parent componnent
    nextTick(() => {
      instance._internal.triggerEvent('ComRef', instance);
    });
  }
}
