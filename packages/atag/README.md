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

- --color-primary，默认 #ff5500
- --color-warn，默认 #fb9025
- --button-primary-background-color-from，默认 #ff8800
- --button-primary-background-color-to，默认 #ff5500
- --button-primary-text-color，默认 #ffffff
- --button-warn-background-color-from，默认 #fbca2f
- --button-warn-background-color-to，默认 #fb9025
- --button-warn-text-color，默认 #ffffff
- --button-default-background-color-from，默认 #ffffff
- --button-default-background-color-to，默认 #ffffff
- --button-default-text-color，默认 #ff5500
- --button-border-radius，默认 40px

使用：

```css
:host {
  color: var(--color-primary-2);
}
```
