import Clipboard from '@core/clipboard';
import { callWithCallback } from '../util';

export function getClipboard(options) {
  callWithCallback(Clipboard.readText, options);
}

export function setClipboard(options) {
  callWithCallback(Clipboard.writeText, options, {
    text: options.text
  });
}
