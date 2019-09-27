# Video 视频播放

Rax 中的视频播放组件。更丰富的视频功能参见 [Player](/component/player) 组件

![](https://gw.alicdn.com/tfs/TB11grWRVXXXXcNXVXXXXXXXXXX-255-334.gif)

## 安装

```bash
$ npm install rax-video --save
```

## 引用

```jsx
import Video from 'rax-video';
```

## 属性

| 名称       | 类型      | 默认值  | 描述       |
| :------- | :------ | :--- | :------- |
| autoPlay | Boolean |      | 设置视频自动播放 |
| src      | String  |      | 视频地址     |

同时支持任意自定义属性的透传

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Video from 'rax-video';

render(<Video style={{ width: 750, height: 400 }} autoPlay src="https://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4" />);
```
