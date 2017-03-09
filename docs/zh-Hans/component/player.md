# Player 视频播放

## 安装

```bash
$ npm install rax-player --save
```

## 使用组件
    
```jsx
import Player from 'rax-player'

<Player
  style={{
    width: '750rem',
    height: '400rem'
  }}
  poster='https://gw.alicdn.com/tps/TB1QsDBKFXXXXcQXpXXXXXXXXXX-750-200.png'  // 封面图地址
  src='http://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4'  // 视频地址
  controls  // 控制条
  hasFullScreen={true}      // 控制条带有全局播放按钮
  originFullscreen={false}  // 是否强制使用原生全屏方法
  startBtn  // 开始暂停button
  autoPlay  // 自动播放

  interactiveId="4418001"  // 互动视频必选
  from="SHOP"  // 互动视频必选
  userId="2200264038"  // 互动视频必选

/>
```

## API说明

### 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|src|String|''|视频地址（必填）| 
|poster|String|''|封面图地址（必填）|
|controls| String | controls | 如果出现该属性，则显示控制器控件（该控制项只在h5下生效）|
|hasFullScreen| Boolean | true | 控制条是否带有全局播放按钮（该属性只对iOS-h5生效，Android-h5、iOS-weex默认带有，Android-weex没有全屏功能）|
|originFullscreen| Boolean | false | 是否强制使用原生全屏方法(该属性只对iOS-h5生效，Android-h5、iOS-weex使用默认全屏，Android-weex没有全屏功能)
|startBtn| String | startBtn | 如果出现该属性，则显示开始暂停button|
|autoPlay| String | autoplay | 如果出现该属性，则视频在就绪后马上播放|
|onVideoFinish| function | null | video播放结束时间处理方法 
|onVideoPlay| function | null | video播放时的处理方法 
|onVideoPause| function | null | video暂停时的处理方法 
|onVideoFail| function | null | video播放失败时的处理方法 
|onLandscape| function | null | 仅videoplus支持的方法 横竖屏切换时候触发
|interactiveId| string | null | 仅videoplus支持的属性 对于互动视频必选 
|from| string | null | 仅videoplus支持的属性 对于互动视频必选 
|userId| string | null | 仅videoplus支持的属性 对于互动视频必选 
|utParams| object | null | 仅videoplus支持的属性 埋点参数，默认为{bizcode: 'RX'}，如果有埋点需求，得找videoplus的pd@慈兰申请bizCode
|layerMode| string | normal | 仅videoplus支持的属性 normal：展示互动，播放器控制条为正常样式 \n mute：静默播放模式，不展示互动，播放器控制条为静默样式
|landscape| boolean | false | 仅videoplus支持的属性 true为横屏、false为竖屏

备注:

* style 中必须传入宽高
* weex环境下使用weex提供的video组件
  + Android设备的weex暂时不提供全屏功能
  + video的控制条控件由组件提供，无法控制和修改
* 关于web下控制条控件
  + Android下默认使用原生控制条，手淘5.2以后引入了UC内核，所以可以通过在Url中添加 hardware=true 强制开启UC内核，这种情况下播放器的控制条是定制的，使用体验好一些
  + iOS设备下额外实现了进度条，可以选择是否提供全屏功能

* videoplus使用必须注意点
  + 不能有多个实例(videoplus)同时存在。使用if进行判断。否则将引发底层crash
  + 页面跳转push新页面必须实现视频的paused方法或者销毁掉实例