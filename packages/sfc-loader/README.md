# sfc-loader
> SFC is a Vue-like DSL that will compile to rax component.

## SFC(Single File Component) DSL

```html
<!-- hello.sfc -->
<template>
  <view class="hello">
    <text class="title" @click="change">Hello {{name}}</text>
  </view>
</template>

<script>
  export default {
    data: function () {
      return {
        name: 'world'
      }
    },
    methods: {
      change () {
        this.name = 'rax';
      }
    }
  }
</script>

<style>
  .hello {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 40px;
    text-align: center;
  }
</style>
```

```js
// app.js
import {render} from 'rax';
import Hello from './hello';

render(<Hello name="world" />);
```

## 与 Vue 相比暂未支持的特性
> 除本表列明外不支持的特性，都是 Bug，请提交 issue

- v-model
- v-html
- v-show
- 指令修饰符
- 模板中的函数调用语法，如 `{{ foo() }}`
- 更高级的 watch
  - 仅支持以下语法
  ```js
  export default {
    watch: {
      // 当且仅当 a.b.c 的值发生变化时触发
      'a.b.c': function(newVal, oldVal) {}
    }
  }
  ```

## Development

### run example
```bash
npm i
npm start
```

### run test
```bash
npm test
```