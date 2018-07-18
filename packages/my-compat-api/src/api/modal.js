import modal from '@core/modal';
import { callWithCallback } from '../util';

export function alert(options) {
  callWithCallback(modal.alert, options, {
    message: options.content || options.title,
    okTitle: options.buttonText
  });
}

export function confirm(options) {
  callWithCallback(modal.confirm, options, {
    message: options.content || options.title,
    okTitle: options.confirmButtonText,
    cancelTitle: options.cancelButtonText
  }, res => {
    return {
      confirm: res.data === options.confirmButtonText
    };
  });
}

export function showToast(options) {
  if (!options.duration) {
    options.duration = 2000;
  }
  callWithCallback(modal.toast, options, {
    message: options.content,
    duration: options.duration / 1000
  });
}
