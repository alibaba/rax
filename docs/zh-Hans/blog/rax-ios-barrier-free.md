---
title: Rax 系列教程（ iOS 无障碍）
date: 20171222
author:  牧云 
---

# Rax 系列教程（ iOS 无障碍）

## [](#0)引子

这篇教程旨在帮助开发者快速上手 Rax iOS 上的无障碍开发。

无障碍，即「accessibility」（常常缩写成「a11y」），是相对有障碍访问而言的，常见的有障碍访问场景有两类。

一种是用户因为生理缺陷，没有能力按正常的交互方式访问，举几个例子：

*   视障人士看不见或看不清，无法感受手淘上的信息，动效，氛围；
*   听障人士听不见或听不清，无法听到音乐以及视频的语音部分；
*   老年人视力和听力的退化。

一种是用户因为客观原因短时间内无法按正常的交互方式访问，比如开车的时候不方便看着屏幕操作。

无障碍的基本目标是使用户接收到产品想要传达的信息，更高的目标则是所有用户接收到的信息是同等的。

据统计，目前每天至少有 4 万以上的用户在访问手淘 iOS 版本（双十一当天达到了 14 万），Android 手淘用户则更多。而由于链路上的无障碍问题，双促实际进入会场（手淘 iOS）浏览的用户在双十二当天也只达到了一千多。这些数字多少说明了无障碍的必要性，探索空间和挑战。

## [](#1)iOS 上的解决方案和 VoiceOver

iOS 本身提供了一系列的[解决方案](https://www.apple.com/cn/accessibility/iphone/)。

比如用户能够借助 Siri（语音助手），通过语音来控制 IOS 完成一些简单的操作以及得到一些反馈，弱视用户可以通过设置对比度，字号来辅助阅读。

大部分功能都可以在「设置」- 「辅助功能」设置。

其中，比较强大的是 VoiceOver 功能(在 iOS 11.2 以上版本中，VoiceOver 有了中文名「旁白」)。

VoiceOver 开启后，操作方式就和原来不一样了，需要通过特定的手势操作。

通过单指单击来访问界面元素，如果元素可访问，元素会获得焦点，元素周围出现黑框，如果正常配置，VoiceOver 会依次读出元素的标签文本，角色（role），提示（hint）。其中，标签文本之后会有一个短暂的停顿，提示之前则会有一个较长的停顿。这是无障碍中最基础也是最需要保证的流程。

当元素是链接或按钮等可交互的角色时，单指双击会触发行为，等同于正常模式下的点击操作。

除了直接点屏幕来访问元素之外，可以通过单指左滑和右滑按顺序遍历元素，通过三指上滑和下滑在列表元素上跨页浏览。

VoiceOver 还提供了转子功能，用户可以拨转子在多个配置中选择，然后通过单指上滑和下滑来调节这个配置。

更多手势参见[这个手册](https://www.interactiveaccessibility.com/education/training/downloads/iOS-Cheatsheet.pdf)。

我们要做的是在 VoiceOver 开启状态下，保证用户操作畅通，提升体验。

## [](#2)常规操作

### [](#3)合理划分焦点

Weex 中的容器类型组件默认无法获取焦点，例如：

*   div
*   a
*   cell

添加 `accessible={true}` 属性可以使这些组件能够获得焦点，同时子组件也都将无法获得焦点。

对默认可以获得焦点的组件而言，例如

*   text
*   image
*   input
*   switch

添加 `aria-hidden={true}` 属性来使这些组件无法获得焦点。

对一般的文本内容，例如活动规则说明，用户协议等，我们不需要做额外处理。

对于图片，如果是无意义的氛围图，一般有两种处理方式，添加 `accessible={true}` 使其对用户不可见，或为了防止大面积的区域无焦点，使图片的容器可以获得焦点。

对点击产生跳转或交互行为的区域，一般遵循**焦点区域最大化**，**个数最小化**原则。举几个划分的例子：

一个焦点

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/c2ed0ddc-eb22-4ca1-bfd5-46fe4422edc5.png)

焦点重叠

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/3b513e45-52be-4e14-83de-104d0b98f003.png)

多个焦点

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/2a01df63-3475-41c6-a081-17215f7acbe2.png)
检查焦点遍历是否正常。

#### [](#4)一行多列布局焦点乱序问题

非通栏的布局下，焦点的遍历顺序和焦点的 top 有关。例如下图这个布局，实际编辑顺序为 A1，B1，A2，A3，B2，B3

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/275455a5-dacd-449a-a7fa-7a1266afb2ff.png)

而下图这个布局，实际编辑顺序为 A1，B1，A3，B3，A2，B2

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/d60beda2-2f0b-4b2f-a6ec-b96565948352.png)

目前尝试的解决方案是给容器添加属性`groupAccessibilityChildren={true}`，使得系统优先按组进行遍历。为了保证上述例子中的顺序为 A1，A2，A3，B1，B2，B3，需要给三个 A 结点的容器，A2，B2 的容器分别设置属性。但在 list 中是无效的。

### [](#5)元素内容语义化

默认除了 text 组件获得焦点后会读出包裹的文本内容外，大部分组件获得焦点后是无法读出内容的。

目前比较严重的问题是页面上大部分的图片，获得焦点后，仅读出「图片」。

添加 `aria-label="语义化内容"` 可以自定义内容。先看一个例子。

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/f2b2d7bd-1514-40e5-8722-83a9e070bdea.png)

*   焦点 1 的内容模板为：`${标题} ${利益点} ${宣言}`，多个信息之间用**空格**分隔
*   焦点 2 的内容为**直播中**即可

内容编写的原则：

*   尽可能和包裹的信息对等
*   多条信息之间用空格号分隔
*   不用刻意添加补充文案


##### [](#7)时刻

**24 小时制**的时刻系统会按字符一个个读出，需要转化成 **12 小时制**的写法，比如 `23:58`
要写成 `11.58AM`。

##### [](#8)隐藏价格

大促预热时期，价格部分位会展示成「?」，需要转化成用户能够理解的语音内容。鉴于首位也可能被隐藏，故统一转化成「xx 元以内的形式」。

##### [](#9)展示不完整的文本

信息会被脱敏，部分字符会展示成「*」，会都成「星星」，需要将对应文本转化成「星号」。

##### [](#10)双十二的 1212 文案

文本内容「1212」会直接朗读成「一千两百一十二」，可以设置为「双十二」或「幺二幺二」。

### [](#11)设置正确的角色

常见的角色有：

*   text，让用户知道当前内容是文本
*   img，获取焦点后会在 label 后读出「图像」，让用户知道当前内容是图片
*   link，获取焦点后会在 label 后读出「链接」，让用户知道点击当前内容会触发页面跳转
*   button，获取焦点后会在 label 后读出「按钮」，让用户知道点击当前内容会触发当前页面交互行为

依赖用户的习惯，角色可以提高用户操作的效率，开发者在简单的场景下，不需要刻意补充指导性文案。

### [](#12)追加提示

可以添加 `accessibilityHint="提示"` 属性来追加一个提示（hint），这个提示内容会在角色之后间隔相对长的一段时间之后读出。

在 VoiceOver 的设置里是可以设置不朗读提示的，请务必将重要信息包含在内容中，提示只作为渐进增强的方案使用。此外，目前在 web 和 Android 场景，没有对应的功能。

## [](#13)VoiceOver Module

除了 Weex 组件上支持的无障碍特性之外，Weex 新增了模块 `voice-over`，提供额外的能力。

### [](#14)VoiceOver 的开启/关闭状态

有些场景可能需要在 VoiceOver 开启的时候做特殊处理，可以通过调用 isVoiceOverOn 方法以及监听 WXVoiceOverStatusChanged 事件来获取 VoiceOver 的开启/关闭状态。

例如监控页面在 VoiceOver 开启下的访问量来推算无障碍用户数。

### [](#15)朗读自定义内容

调用 read 方法能够让系统朗读我们需要的内容。

例如常见的 Toast 组件就需要在展示信息的同时，朗读相应内容。

没有标题的页面需要在页面初始化完成之后朗读出页面标题。

### [](#16)使组件获得焦点

focusToElement 方法会尝试使指定元素获得焦点（前提是该组件能够获得焦点）。

常用的场景是为了保证页面初始化结束之后，页面上的第一个结点（一般是页面左上角的第一个组件）能够获得焦点。这个组件往往是导航条上的后退按钮，由于无法获得后退按钮的 ref，此时需要调用focusToNavigationBack 方法尝试聚焦。

## [](#17)手淘导航条的定制

### [](#18)设置右侧图标的时候指定朗读内容和角色


```
// navigator.setNavBarRightItem
navigator.setNavBarRightItem({
  'aria-label': '分享',
  'role': 'button',
  icon: 'share',
  fromNative: 'true',
  iconFont: 'true'
  }, (e) => {
    alert('click!');
  });
}

```


```
// navigationBar.setRightItem
navigationBar.setRightItem({
  icon: 'https://gw.alicdn.com/tfs/TB1O.XGXOqAXuNjy1XdXXaYcVXa-60-60.png',
  'aria-label': '新',
  'role':'button'
}

```

### [](#19)hc.setTBHCConfig 导航中部设置指定朗读内容和角色

会场框架支持在导航条中部配置可以跳转的图片，例如在导航条嵌搜索框。需要额外传入 naviCenterAriaLabel 和 naviCenterRole 来指定朗读内容和角色。例如在导航条嵌搜索框场景，可以设置为


```
{
  "naviCenterAriaLabel": "双十二搜好物",
  "naviCenterRole": "link",
}

```


## [](#20)Rax 开发

### [](#21)组件开发

组件的无障碍开发很重要，可以大幅减少业务的无障碍开发成本，大幅提高业务无障碍表现。同时也面临巨大挑战，特别是交互复杂的组件，面临的问题如下：

*   交互方式需要斟酌，缺少具体的标准，必要时需要邀请用户进行调研
*   VoiceOver 手势的局限，转子功能或新的手势对于用户的学习成本都很高

组件开发者需要保证界面组件支持属性透传到容器，目前很多组件无法设置，只能在组件外再包裹一层容器。功能性组件需要考虑无障碍，在必要时预留朗读内容和角色的入参。

退一步，如果组件对无障碍用户过于复杂，可以暂时先屏蔽（不可见或无法获得焦点）。

### [](#22)业务应用开发

业务开发者大部分要做的是透传属性（配置焦点，朗读内容，角色，提示）。需要注意的：

*   约定数据字段的时候预留朗读内容需要的字段，尤其是很多文字被做进图片素材的场景，例如图片资源位，需要运营额外提供资源描述字段
*   尽可能使用组件并收敛组件选择，例如目前有多个途径定制手淘导航条（navigator，navigationBar，hc，WindVane等），修复一个问题需要挨个修复，且修复成本和难度不可控
*   某些优化点需要权衡额外的开发工作量和收益

## [](#23)写在最后

Weex 和 Rax 团队在 IOS 上的无障碍基础能力已基本完成，下一阶段会重点关注 Rax 组件和 Android。无障碍是一个产品和团队需要共同关注的话题，欢迎大家一起共建，相关疑问和建议可以在钉钉群中进行，也可以前往[aone](https://aone.alibaba-inc.com/project/476334/issue/new?toPage=1)反馈。

![](//ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/6eebca2ecfbad543fed29adeec432546.png)

## [](#24)更多

### [](#28)开启 VoiceOver 测试

从 iOS 11.2 开始，VoiceOver 在中文系统里译为「旁白」。

可以通过以下路径找到 VoiceOver 的开关：「设置」 -> 「通用」 -> 「辅助功能」 -> 「视觉 - VoiceOver」。

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/1e41a457-5f31-41f8-9182-e4fb12272ea6.png)

也可以调出 Siri（长按 Home 键），说 「VoiceOver」，Siri 会显示入口。

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/73a5ebab-95b5-40d1-8dc3-4d65f2c99366.png)

接着说「打开」直接开启

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/40cfc324-73b5-4140-8e0d-b2b494d5481a.png)

或直接说 「请打开 VoiceOver」开启

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/98a0f57e-f83b-4c41-bd34-21b7de8adebe.png)

还可以说「设置 VoiceOver」直接进入 VoiceOver 的设置界面。

#### [](#29)通过辅助功能快捷键快速开启/关闭 VoiceOver

建议通过设置「辅助功能快捷键」的方式便于后续快速开启/关闭，路径为「设置」 -> 「通用」 -> 「辅助功能」 -> 「辅助功能快捷键」。

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/01bc0817-9dc7-4b47-8a40-1fb1b91b94b4.png)

若只选择了「VoiceOver」，后续连按三次 Home 键则可以快速开启/关闭 VoiceOver。

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/632a01df-d069-42c7-891d-bf354a173fc4.png)

若选择了多项，连按三次 Home 键会呼出一个菜单

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/b6bed3d0-0f28-4a18-aec0-0d1e5a25c824.png)