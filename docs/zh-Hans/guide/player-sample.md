
# 视频播放

![](https://gw.alicdn.com/tps/TB11686OVXXXXaCaFXXXXXXXXXX-682-352.png)

## 主要组件介绍

* rax-player 视频播放推荐方案
* rax-countdown 倒计时
* rax-icon icon按钮，可以使用图片或者 iconfont
* rax-grid 多行多列布局推荐方案

## 核心实现思路

**视频的播放**

* weex 上对于视频的扩展较少，仅支持原生标签功能
* player 视频播放组件相对 components 中的 video 标签，在 h5 的兼容和功能支持程度上更加完整

**icon**

* iconfont 在使用的时候只能在特定手机淘宝版本，老版本会不兼容

**多行多列布局**

* 多行多列布局推荐使用 rax-grid，比如两列橱窗、九宫格等
* grid 比老版本做了层级减少的优化，去掉额外的列包裹标签
* 如果自行实现多列布局可以参考 grid 默认样式，不复杂
