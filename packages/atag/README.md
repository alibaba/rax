# [atag](https://developer.taobao.com/components/)
> A UI Web Components Library

### run dev

```bash
npm i
npm start # served at localhost:9001/atag.js
```

### run build

```bash
npm run build # build to dist/atag.js
```

### run test

```bash
npm test
```

### 主题方案

atag 组件通过 css 变量方式支持主题切换，目前可用的变量：

|css 变量名           |默认值        |说明               |
|--------------------|-------------|------------------|
|--color-primary-2   |#ff5500      |主色2，中等|
|--color-primary-3   |#ff8800      |主色3，深|
|--color-warning-2   |#fb9025      |警示色2，中等|
|--color-warning-3   |#fbca2f      |警示色3，深|
|--color-line-2      |#999999      |线条颜色2，中等|
|--color-line-3      |#666666      |线条颜色3，较深|
|--color-line-4      |#333333      |线条颜色4，深|
|--color-text-2      |#999999      |线条颜色2，中等|
|--color-text-3      |#666666      |线条颜色3，较深|
|--color-text-4      |#333333      |线条颜色4，深|
|--btn-border-1      |40px         |按钮圆角|
|--btn-border-2      |80px         |按钮二倍圆角|

使用：

```css
:host {
  color: var(--color-primary-2);
}
```
