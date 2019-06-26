---
order: 1
---

# 基本

基础使用方式

```js
import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import MyComponent from '../src';

render(<MyComponent />, null, { driver: DriverUniversal });
```
