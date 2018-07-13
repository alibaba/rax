import path from 'path';
import navigator from '@core/navigator';
import { $emit } from '../eventHub';

export function navigateTo(params) {
  let url = params.url;

  url = path.basename(url);

  $emit('PageNavigate', { to: url });
  navigator.push({
    url
  });
}

export function navigateBack(params) {
  $emit('PageNavigate', { type: 'pop' });
  navigator.pop();
}
