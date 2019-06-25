---
order: 1
---

# 基本

基础使用方式

```js
import { createElement, render } from 'rax';
import * as DriverWeex from 'driver-weex';
import * as DriverDom from 'driver-dom';
import MyComponent from '../src';
import { isWeex } from 'universal-env';

render(<MyComponent />, document.body, { driver: isWeex ? DriverWeex : DriverDom });
```
