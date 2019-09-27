# Player 视频播放器

复杂的视频播放器组件

![](https://gw.alicdn.com/tfs/TB1.NTYRVXXXXcNXVXXXXXXXXXX-255-201.gif)

## 安装

```bash
$ npm install rax-player --save
```

## 引用

```jsx
import Player from 'rax-player'
```

## 属性

| 名称               | 类型       | 默认值      | 描述                                       |
| :--------------- | :------- | :------- | :--------------------------------------- |
| src              | String   | ''       | 视频地址（必填）                                 |
| poster           | String   | ''       | 封面图地址（必填）                                |
| controls         | String   | controls | 如果出现该属性，则显示控制器控件（该控制项只在h5下生效）            |
| hasFullScreen    | Boolean  | true     | 控制条是否带有全局播放按钮（该属性只对iOS-h5生效，Android-h5、iOS-weex默认带有，Android-weex没有全屏功能） |
| originFullscreen | Boolean  | false    | 是否强制使用原生全屏方法(该属性只对iOS-h5生效，Android-h5、iOS-weex使用默认全屏，Android-weex没有全屏功能) |
| startBtn         | String   | startBtn | 如果出现该属性，则显示开始暂停button                    |
| autoPlay         | Boolean  | false    | 如果出现该属性，则视频在就绪后马上播放                      |
| onVideoFinish    | Function | null     | video播放结束时间处理方法                          |
| onVideoPlay      | Function | null     | video播放时的处理方法                            |
| onVideoPause     | Function | null     | video暂停时的处理方法                            |
| onVideoFail      | Function | null     | video播放失败时的处理方法                          |

备注:

* style 中必须传入宽高
* weex环境下使用weex提供的video组件
  + Android设备的weex暂时不提供全屏功能
  + video的控制条控件由组件提供，无法控制和修改
* 关于web下控制条控件
  + Android下默认使用原生控制条，在UC内核中可以通过在Url中添加 hardware=true 强制开启UC内核，这种情况下播放器的控制条是定制的，使用体验好一些
  + iOS设备下额外实现了进度条，可以选择是否提供全屏功能


## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Player from 'rax-player'

render(<Player
  style={{
    width: '750rem',
    height: '400rem'
  }}
  poster="https://gw.alicdn.com/tps/TB1QsDBKFXXXXcQXpXXXXXXXXXX-750-200.png"
  src="https://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4"
  controls
  hasFullScreen
  originFullscreen={false}
  startBtn
  autoPlay
/>);
```
