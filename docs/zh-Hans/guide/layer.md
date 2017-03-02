# 页面的嵌套层级

在开发 WEEX 页面时，我们需要特别关注页面的 `嵌套层级`。

### 原因

这是因为在 Android 系统中，当页面的嵌套层级超过一定数量后，会触发 StackOverflowError，导致 crash。在低端机上尤为明显。

这个问题在 Android native 开发中，是一个常识性问题。一般常规业务 native 开发的页面基本会最大层度去优化UI的层级。

### 安全的层级

双11的数据显示，最高 16 级的页面，crash 占比在1.5%。

目前认为相对安全的页面嵌套层级是`14级`。由于 Android 的 Activty 还会对页面加上 5-6 个层级，所以，JS创建的页面层级建议控制在`8层`以内。

以`我的1212`页面为例，当页面总层级从`20级`优化到`17级`后，crash率从蓝色曲线骤降到红色曲线。

![屏幕快照 2017-01-03 23.26.18.png](http://work.taobao.net/attachments/download/22018/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-01-03%2023.26.18.png)

### 查询 `嵌套层级` 方法

为了性能，有些平台型业务接入 Weex/Rax 代码时会要求提供 `嵌套层级` 数据。可以按照如下方法查看：

1. 安装 [weex-tool](https://github.com/weexteam/weex-devtool-extension)，然后开启 `weex debug` 工具（详细说明地址：<https://github.com/weexteam/weex-devtool>）。
2. 扫描二维码可以打开 debug 面板，此时用手机扫码打开你要测试的 Rax or Weex 页面。
    ![](//img.alicdn.com/tfs/TB1lH9VPpXXXXcjXFXXXXXXXXXX-818-834.png)
3. 在 debug 面板中的 ElementMode 选项选择 `vdom`。然后点击 `Debugger` 按钮打开调试页面。此时应该会在工具条上面出现 `weex` tab 切换之后，可以在结构上面看到 `max-deep` 数据，这个就是当前应用的嵌套层级啦。
    ![](//img.alicdn.com/tfs/TB1nwfaPpXXXXcqXXXXXXXXXXXX-1744-828.png)
