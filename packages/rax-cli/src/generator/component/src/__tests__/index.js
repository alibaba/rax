/* eslint-env jest */
import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import MyComponent from '../';

describe('MyComponent', () => {
  it('typeof MyComponent is "function"', () => {
    expect(typeof MyComponent).toEqual('function');
  });
});
