# Gotop 返回顶部

## 安装

```bash
$ npm install --save rax-gotop
```

## 引用

```jsx
import GoTop from 'rax-gotop';
```

用iconfont默认样式：

```jsx
<GoTop />
```

自定义样式：

```jsx
<GoTop name="click" icon="//gtms03.alicdn.com/tps/i3/TB1rrfVJVXXXXalXXXXGEZzGpXX-40-40.png" />
```
> 注：weex 环境下必须把 GoTop 放在 ScrollView 的第一个位置

### 属性

| 名称          | 类型       | 默认值                                      | 描述                     |
| :---------- | :------- | :--------------------------------------- | :--------------------- |
| name        | String   | 顶部                                       | 图标name                 |
| icon        | String   | //gw.alicdn.com/tps/TB10dz6KXXXXXc0XFXXXXXXXXXX-40-40.png_20x20.jpg | 图标url                  |
| iconWidth   | String   | 90rem                                    | 返回顶部container宽度        |
| iconHeight  | String   | 90rem                                    | 返回顶部container高度        |
| borderColor | String   | rgba(0, 0, 0, 0.1)                       | 返回顶部container border颜色 |
| bottom      | int      | 80                                       | 离底部的距离                 |
| onShow      | function | function() {}                            | icon显示回调               |
| onHide      | function | function() {}                            | icon消失回调               |

## 基本实例

```jsx
// demo
import { createElement, render, Component } from 'rax';
import GoTop from 'rax-gotop';
import ScrollView from 'rax-scrollview';
import Text from 'rax-text';

render(
  <ScrollView>
    <GoTop name="click" style={{width: 100, height: 100}}
    icon="//gtms03.alicdn.com/tps/i3/TB1rrfVJVXXXXalXXXXGEZzGpXX-40-40.png" />
    {Array.from({length: 50}).map((_, idx) => (<Text style={{fontSize: 50}}>hello world {idx}</Text>))}
  </ScrollView>
);
```

