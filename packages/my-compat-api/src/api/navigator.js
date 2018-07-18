import Navigator from '@core/navigator';
import resolve from 'resolve-pathname';
import { callWithCallback } from '../util';

export function navigateTo(options, basePath = '') {
  let url = resolve(options.url, basePath);
  // absolute path
  if (url[0] === '/') {
    url = url.slice(1);
  }
  callWithCallback(Navigator.push, options, {
    url
  });
}

export function navigateBack(options) {
  callWithCallback(Navigator.pop, options);
}
