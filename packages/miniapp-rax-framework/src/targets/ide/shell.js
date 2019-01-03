import { createElement, render } from 'rax';
import getAppConfig from './container/getAppConfig';
import Container from './container';

/**
 * DOM with master
 */
export function renderShell() {
  return render(<Container config={getAppConfig()} />);
}
