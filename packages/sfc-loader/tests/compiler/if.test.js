/* eslint-disable */
const { createElement } = require('rax');
const renderer = require('rax-test-renderer');

import { compile } from './utils';

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
  const { render, renderFn } = compile(`
    <view class="foo foo2" :class="{ active: 0 > 1 ? a : b}">
      <text>Bar</text>
      <a-b></a-b>
      <a_b></a_b>
      <aB></aB>
      <Ab></Ab>
      <ab></ab>
      <ab-></ab->
    </view>
  `);
  // todo
});

