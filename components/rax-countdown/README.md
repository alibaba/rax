# Countdown 倒计时

[![npm](https://img.shields.io/npm/v/rax-countdown.svg)](https://www.npmjs.com/package/rax-countdown)

## Install

```bash
$ npm install rax-countdown --save
```

## Import

```jsx
import Countdown from 'rax-countdown';
```

## Props

| Name                | type     | default              | describe                                     | required |
| :------------------ | :------- | :------------------- | :--------------------------------------- | :------- |
| timeRemaining       | Number   | /                    | countdown time, (ms)                          | Yes      |
| interval            | Number   | 1000                 | countdown interval, (ms)                           | No       |
| tpl                 | String   | {d}天{h}时{m}分{s}秒 | countdown display template            | No       |
| formatFunc          | Function | /                    | custom formatted remaining time method, when formatFunc = `undefined`, `tpl` is not available  | No       |
| onTick              | Function | /                    | method of calling when countdown changes                              | No       |
| onComplete          | Function | /                    | method of calling when the countdown is complete                              | No       |
| timeStyle           | Object   | /                    | time digital style                                 | No       |
| secondStyle         | Object   | /                    | second digital style                                  | No       |
| textStyle           | Object   | /                    | text style                                 | No       |
| timeWrapStyle       | Object   | /                    | block style in countdown                                 | No       |
| timeBackground      | Object   | /                    | background of each time block (can use background image)                           | No       |
| timeBackgroundStyle | Object   | /                    | background style of each time block                                | No       |

## Example

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

