import { render, createElement, findDOMNode } from 'rax';
// import WorkerDriver from './worker-driver';
import Counter from './pages/counter.html';

render(
  <Counter p1={'p1'} p2={'p2'} my-message="hello!">
    There are children of Counter.
    <view>This is a child view</view>
    <view slot="named">This is named slot</view>
  </Counter>
);
