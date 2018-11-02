---
title: Rax 系列教程（SDK）
date: 20180226
author: 之羽
---

# Rax 系列教程（SDK）

## [](#0)引言

在Hybrid开发中，SDK是不可或缺的一部分。正是因为SDK能够将强大的Native能力甚至系统能力输送给前端开发者，才使得体验&效率能够双丰收。本文将基于weex，介绍在weex环境下SDK的相关知识和使用。

## [](#1)SDK的技术体系

早在H5时代，集团的Hybrid SDK技术就开始蓬勃发展。到目前为止，主要以下3种为代表：

*   以手淘、猫客为代表的 `Windvane`
*   以支付宝为代表的 `Nebula`
*   以千牛、Lazada为代表的 `QAP-SDK`

除此之外，还有飞猪的 `Alitrip JSBridge` 和钉钉的 `DingTalk JSBridge`。

要使用以上SDK的能力，需要客户端同学接入各自的Native SDK并实现对应的抽象接口，这样作为前端开发同学才能成功调用相关的接口。

## [](#2)Weex中的SDK

在 Weex 技术体系中，提供了一种新的SDK形式：`Module 扩展`。根据 Weex 的文档解释，Module 用于扩展**非UI**的特定功能，且必须继承 `WXModule` 类。

官方给出了一个简单的扩展示例：


```
public class MyModule extends WXModule{

  //run ui thread
  @JSMethod (uiThread = true)
  public void printLog(String msg) {
    Toast.makeText(mWXSDKInstance.getContext(),msg,Toast.LENGTH_SHORT).show();
  }

  //run JS thread
  @JSMethod (uiThread = false)
  public void fireEventSyncCall(){
   //implement your module logic here
  }
}

```


以上扩展模块`MyModule`，提供了一个`printLog`的方法用于打印日志。在 rax 中可以进行如下调用


```
import MyModule from '@weex-module/myModule';

MyModule.printLog('I am a weex module');

```


通过这种方式，接入weex的客户端，可以自由地扩展Hybrid能力，为应用提供丰富的想象空间。

目前AliWeex提供了stream、storage等12个公开模块和mtop、windvane等二十几个集团内的模块。

以常见的网络请求为例，在weex中，我们需要调用 `stream` 模块：


```
import stream from '@weex-module/stream';

stream.fetch({
  method: 'GET',
  url: '//httpbin.org/get',
  type:'json',
}, function responseCallback(response) {
  console.log(response);
}, function progressCallback(response) {
  console.log(response.readyState);
});

```


## [](#3)在Weex中调用Winvane

虽然AliWeex总共提供了30+模块，但是其提供的能力毕竟还有限。为了能够复用原Windvane丰富的能力，AliWeex提供了对接到Windvane SDK 的 `windvane` 模块。因此，在weex下，我们能够如此调用Windvane的接口：


```
import windvane from '@weex-module/windvane';

windvane.call2('TBSharedModule.showSharedMenu', {
    // API param
}, successCallback, failureCallback);

```


这样我们就获得了最大化的SDK能力。但是需要注意的是，在 Weex环境中，并不是所有的 Windvane 接口都是能够被成功调用的。目前Windvane接口在 Weex 环境下的兼容性并不明确，需要开发者自行进行测试。

## [](#4)SDK接口的分类

SDK的接口可以从不同角度进行不同的分类，以方便开发者快速的找到需求的接口。

### [](#5)按功能划分

大部分的SDK文档都会以此种形式划分，按照目前的SDK能力，大致可分为以下几类：

*   网络请求类。如HTTP、MTOP请求
*   界面交互类。如Toast、ActionSheet、Navigator定制
*   媒体类。如图片、音视频、文件的操作
*   设备类。如蓝牙、网络、定位、系统信息等
*   客户端专有类。主要是各个客户端自定义扩展实现的接口，其他客户端没有的。
*   其他类。不归入以上分类中的API，如Util。


可见，SDK的接口从功能上看，既有像HTTP、MTOP这样严格意义上的接口，也有调用Native UI的组件型接口。

组件型接口和Rax Component的区别主要在于，Rax Component在H5容器中会降级为H5形式进行渲染，而组件型接口，在H5容器中，仍然会渲染Native UI。

### [](#6)按响应源划分

SDK提供的能力，有些是客户端处理并返回结果的，有些则是经过客户端代理到服务端，再经过服务端处理返回结果。因此大致可分为：

*   客户端接口
*   MTOP接口
*   TOP接口

MTOP接口大家比较熟悉，TOP接口是指淘宝开放平台提供给ISV开发者使用的接口，目前在千牛中广泛应用。如果你在接入开发千牛的插件，那么除了MTOP接口之外，还可以使用许多现成的TOP接口。具体的接口列表可以到阿里开放平台上进行查询。

### [](#7)按响应方式划分

*   异步接口
*   同步接口

我们日常接触到的SDK接口中，大部分都是通过回调或者Promise的异步形式返回接口响应结果，但其实异步接口并非SDK接口的全部。Weex 提供了实现同步接口的机制，而千牛对其进行了扩展，使得同步接口在H5容器下也能够进行调用。

以操作剪贴板为例：


```
import QN from 'QAP-SDK';

let result = QN.clipboard.getTextSync();
console.log(result);

```


以上代码，不管是千牛的Weex容器下，还是在千牛的H5容器下，都是OK的。

## [](#8)三端兼容

Weex和Rax在开创时就定下了`Write once, run everywhere`的口号，也就是三端兼容。这里所说的三端，是指Andrond Weex、iOS Weex 和 H5 容器。良好的三端兼容，可以大大提升应用的可移植性，比如一个活动页面，在淘系客户端中以Native形式进行渲染，可以大大提升页面体验，而分享到淘系以外的微信、微博以H5形式进行渲染，再提升活动传播率的同时，又不需要再用H5开发一个相同的页面。除此之外，Weex应用出现异常，可以平滑的降级为H5的形式进行兜底。

除了在UI层面，SDK层面的三端兼容，也是不可或缺的，良好的SDK兼容性可以提升开发人员的效率。

Weex中SDK的三端兼容性可以说几乎没有，基本上是通过JSSDK的二次封装进行实现。目前兼容性比较好的主要有：

*   Rax的子项目`universal-*`
*   千牛的`QAP-SDK`

### [](#9)universal-*

通过在不同环境下调用不同的模块或者库，对不同端的调用差异进行抹平。以`universal-mtop`为例，在非 weex 环境下使用 lib-mtop 进行 Mtop 请求，在 weex 环境下通过调用 windvane 的 `MtopWVPlugin.send` 方法进行 Mtop 请求。


### [](#10)QAP-SDK.js

通过实现不同环境下实现不同的Native-JS通道层，其他上层封装不变。同样以`QN.mtop`为例，只要是在支持Native QAP-SDK的客户端中，都会尽可能走 `QianNiu.mtop` 通道，除非在纯WEB浏览器中，或者开发者故意配置`H5Request=true`时，才会走 `lib-mtop` 通道。

`QAP-SDK` 基本所有接口都实现了三端兼容。

## [](#11)跨端兼容

我们在开发Weex应用的过程中，无论是为了降低开发成本，还是为了尽可能扩大产品的受众面，经常会要将应用入口部署在多个App内。所以这里说的跨端兼容，是指跨App客户端。也就是跨手淘、猫客、千牛等客户端的调用SDK接口的兼容性。

在H5容器中，跨端兼容的实现有 Hybrid API，目前还有更为优秀的 JSBridge 。在很早以前，我个人还开发一个跨千牛和手淘的小类库。相信大家在接到跨App的需求的时候，都会萌生这样的想法。

在Weex容器中，表面上看Weex Module和Windvane基础API在接入的客户端中都是兼容的。然而事实并非如此，由于各个客户端中架构差异和实现差异，Weex Module 和 Windvane 接口的兼容性存在很大的不确定性，需要开发者自行进行测试。

目前还没有发现兼容性比较好的跨端封装，因此只能给大家提供一个基本思路：

1.在接入Weex、Windvane的App（手淘、猫客等）中，尝试调用Weex Module 和 Windvane基础API。如果需要调用一些App专有的API，可以通过判断环境信息调用各自的API。一下是一些 rax 和 universal 提供的环境信息：

*   navigator.platform // iOS or Android
*   navigator.product // weex
*   navigator.appName // TB
*   navigator.appVersion // 6.4.1
*   `import { isWeex, isWeb } from 'universal-env';`

2.在接入QAP-SDK的客户端中，如千牛、零售+、Lazada，可以直接使用 `QAP-SDK`。
