# Countdown 倒计时

## 安装

```bash
$ npm install rax-countdown --save
```

## 引用

```jsx
import Countdown from 'rax-countdown';
```

## 参数（Props）

| Name                | Type     | Default              | Desc                                     | Required |
| :------------------ | :------- | :------------------- | :--------------------------------------- | :------- |
| timeRemaining       | Number   | /                    | 倒计时剩余时间,单位为"毫秒"                          | Yes      |
| interval            | Number   | 1000                 | 倒计时的间隔,单位为"毫秒"                           | No       |
| tpl                 | String   | {d}天{h}时{m}分{s}秒{ms} | 倒计时展示模板,默认为'{d}天{h}时{m}分{s}秒'            | No       |
| formatFunc          | Function | /                    | 自定义格式化剩余时间的方法,非`undefined`时tpl失效,处理剩余时间的展示 | No       |
| onTick              | Function | /                    | 倒计时变化时调用的方法                              | No       |
| onComplete          | Function | /                    | 倒计时完成时调用的方法                              | No       |
| timeStyle           | Object   | /                    | 时间-数字的样式                                 | No       |
| secondStyle         | Object   | /                    | 秒最后一位样式                                  | No       |
| textStyle           | Object   | /                    | 时间-单位的样式                                 | No       |
| timeWrapStyle       | Object   | /                    | 各时间区块的样式                                 | No       |
| timeBackground      | Object   | /                    | 各时间区块背景(可加背景图)                           | No       |
| timeBackgroundStyle | Object   | /                    | 各时间区块背景样式                                | No       |

## 基本示例

```jsx
// demo
import { createElement, render, Component } from 'rax';
import Countdown from 'rax-countdown';
import View from 'rax-view';

render(<View>
  <Countdown
    timeRemaining={100000}
    tpl="{d}天{h}时{m}分{s}秒"
    onComplete={() => { console.log('complete'); }}
  />  
</View>);
```

