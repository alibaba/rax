# SFC-Loader

轻框架 DSL Loader

Vue 语法参照 Vue 2.x 文档

### run example

```bash
npm i
npm start
```
### run test

```bash
npm test
```
### 与 Vue 相比暂不支持的特性

>  除本表列明外不支持的特性，都是 Bug，请提交 issue

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
      'a.b.c': function(newVal, oldVal) {}
    }
  }
  // 当且仅当 a.b.c 的值发生变化时触发
  ```

### 测试

- compiler
  - 使用 jest 对 AST 转译器进行单元测试
  - `npm run test:jest`
- runtime
  - 使用 karma 进行 UI 测试
  - `npm run test:karma`
