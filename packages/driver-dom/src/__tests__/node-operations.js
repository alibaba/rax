import { createElement, render } from 'rax';
import * as DriverDOM from '../../';

describe('NodeOperations', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  it('should append child', () => {
    // TODO
  });
});