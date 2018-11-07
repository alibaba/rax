---
title: Rax 系列教程（国际化）
date: 20180313
author: 翊晨
---

# Rax 系列教程（国际化）

国际化是一个大话题，每一个接触国际业务的同学可能都有自己的思考。本文就 Lazada 国际化业务中使用 Rax 开发遇到的实战中遇到的一些琐碎问题给出一些经验总结，其中既包括 native、 weex 底层能力升级，又有不少上层业务封装。

## [](#0)扩展 Weex Env，获取上下文环境

切换国家，语言通常是在 app 设置内完成的，因此用户首次设置或者切换后，我们需要 app 会把上下文透传给上层 Weex、 webview 容器。在lazada 业务中，我们约定如下：


```
 // weex
 WXEnvironment.addCustomOptions("_i18n_.language","en"})
 WXEnvironment.addCustomOptions("_i18n_.regionID","my")
 // webview
 window._i18n_ = {language:"en",regionID:"my"}

```


非端内环境，则通过 hng cookie 去传递。
上述国际化的编码、hng cookie 的构造，参考了天猫国际的方案

## [](#1)多语言

1.  投放数据的多语言

    投放数据是指运营维护的数据。除了传统的挖多个语言坑位之外，常见思路是依赖背后的数据投放系统实现多语言，我们的 Rax 页面不需要关心逻辑，纯展示即可。在lazada 实践中，运营页面全部在 icms 维护，此处不展开。

2.  前端文案多语言

    Rax 国际化项目中，前端文案一定是不能写死的某一语言了。如果使用 medusa 管理文案的话，一定要有意识地写成 medusa key 模式，再通过而文案的 key + 上下文语种 => 生成目标语言。便于业务方与 local 团队协同完成文案翻译。

    至于拿到文案以后在上下文中使用，那就比较简单啦，随手找一段 demo 如下：


    ```

    import messagesAIO from '$messages/index.json';
    const intl = provideIntl({ // provideIntl 来自 Intl 相关组件
      locale: lzdContext.locale(),// 上下文环境中的语言
      messagesAIO,
    });
    // ...
    render(
    return (<Text style={styles.verifyPhoneText}>
    intl.formatMessage({
      id: 'orderList.pc.header.titleLabel.content',
      defaultMessage: 'hello world',
    });
    </Text>);
    )

    ```

3.  API 请求多语言

    API 请求的错误信息，同样由服务端对接美杜莎去获取翻译好的文案。
    除此以外，集团内大量移动端接口都是在 mtop 平台发布的，mtop 出海还有一些定制化参数与国内版本不同，@疯巅在 mtop 中间件能力的基础上实现了业务中间件，很好地解决了这些问题。

4.  商品数据多语言

    和前端关系不大，主要由后端处理，不展开。

## [](#2)排版

### [](#3)英文单词截断

英文长单词遇到句尾会被截断展示，使用 `wordWrap:'break-word'` 可以完美解决（weex 0.16+ ?）。
![](https://img.alicdn.com/tfs/TB1eLWfaVOWBuNjy0FiXXXFxVXa-739-226.jpg)

### [](#4)RTL 排版 (weex 0.17+)

RTL 是指 right-to-left 排版，阿拉伯语，希伯来语和一些其他的语言的行内方向是从右至左的。Lazada 实际项目中暂未遇到，仅仅在技术预研阶段产出了 demo。

在 Rax 项目中要实现 RTL 排版，并不需要对组件、代码进行大量改动，只需要添加右对齐，以及 `direction : rtl` 样式属性即可。

*   RTL 文字排版


    ```
    const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;
    <Text style={{textAlign:'right',direction:'rtl',}}> مرحبا كيف حالك؟</Text>

    ```


*   RTL 布局排版

    解决了文字排版的问题后，文字阅读顺序对了，但内容布局的顺序还是从左到右，因此也需要做相应翻转。这也比较简单，一行`flexDirection: 'row-reverse'` 样式就能轻松解决。

    最简实现：[综合布局、文字换向的完整 demo](https://jsplayground.taobao.org/raxplayground/82a36355-5836-4229-b88e-fb76154ef193)

### [](#5)行高 lineHeight

Rax 项目里的行高，大家可能都想象不到有什么坑点，那么我们来看一个实际的[栗子](https://jsplayground.taobao.org/raxplayground/7c53ee06-4da1-4f0d-9352-5ae36ca23951):
![](https://img.alicdn.com/tfs/TB1353XcamWBuNjy1XaXXXCbXXa-1030-156.png)

面对蝌蚪文不知所措的你可能也没看出来啥，是的一开始我也没有，那么再比较一下：
![](https://img.alicdn.com/tfs/TB1xPvScmCWBuNjy0FhXXb6EVXa-1013-509.png)

红圈上面的文字，一丢丢头发丝儿没了！！虽然整体不影响当地人阅读，但。。。谁让我（ce）们 (shi) 这么在意用户体验和细节呢？

#### [](#6)前端黑科技


| 字号（wx） | 泰语不加粗最小行高 |
| --- | --- |
| 12 | 40rem |
| 13 | 44rem |
| 14 | 46rem |
| 15 | 48rem |
| 16 | 52rem |
| 17 | 56rem |
| 18 | 58rem |
| 28 | 88rem |


如上，快速地整理了一个行高对照表，如果文字有加粗，还需要适当增加。行高与字号的关系并非线性，如果用数学公式去描述，可以表达如下：


```
 const defaultLineHeightOptimizer = fontSize =>
  Math.ceil(
    9.24 * Math.pow(10, -5) * Math.pow(fontSize, 2) + 1.492 * fontSize + 2.174
  );

```


PS: 以上公式来自大神@雷蜜

在 Lazada 业务中，我们把上述处理函数封装成了一个自动调整行高的 props， 丢进了 Text 计算的基础逻辑中。

以上方案并非完美，如果字号用 wx 单位，行高无论是用 rem 还是 wx 单位，都将面临很多精细布局下的问题（此处不展开，如有兴趣可以私聊），因此这只是一个临时解决方案。

#### [](#7)weex text：从根源上解决（社区版本待集成）

前端黑科技只能治标不治本，我们还是需要 weex text 找到截断的原因并解决。

根据 weex 开发同学解释：在 weex 页面中，text 的默认行高数值默认没有预留上下 padding 空间，加上 Android `overflow:hidden` 的系统特性，才导致 android 泰语这种上下堆叠的文字普遍被截断了部分发丝儿。通过约定 api 传入预留空间的属性，使用 native 底层的 StaticLayout 计算即可，计算结果是比较准确的。

因此和 weex 开发同学做了如下约定：


```
  // RN 也有类似参数
   <Text includeFontPadding={true} />

```


Text 组件传入是否预留 font-padding 的参数，如果需要处理超高文字的场景，设置为 true 可以让 weex 准确预留出高度，从而避免上图栗子中的情况。

## [](#8)Intl 处理 CLDR 信息及其兼容性

[CLDR 信息](//cldr.unicode.org/index)是指不同国家在数字，时间，单复数等制式方面差异的信息规范。在实现层面，端、后端语言通常有 ICU 工具库，前端则通常依赖 [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) api 。在 Rax 项目中，基于此 API 封装的国际化组件有：

*   rax-intl (此方案待开放)

    能够基本满足诉求，唯一的问题是：Intl 的兼容性并不是很理想，iOS 9.3 以下及 Android 4.3 以下没有 Intl 对象。**目前，rax 还没有在 framework 层去实现低版本 jscore 的 Polyfill**。


## [](#9)金额数据

汇率计算本身不在本文讨论范围内，建议所有的计算由服务端完成，产出当前金额的具体数值即可。

金额展示是我们电商场景下 100% 会遇到的问题。如下图：

![](https://img.alicdn.com/tfs/TB1XZ3OcmBYBeNjy0FeXXbnmFXa-1520-850.jpg)

金额的格式，格式化，符号，展示顺序通通不一样。。。em。。。机智的我们又想到了 CLDR 规范。服务端、native 可以用格式化工具 [icu4j](//icu-project.org/apiref/icu4j/) 做实现，前端项目我们也可以使用 Intl.NumberFormat 实现。那么，这样真的完美了吗？


| 国家| 语言| ICU 格式化结果| 实际使用|
| -- | -- | -- | -- |
| Singapore| en-SG| $10,000.00| SGD10,000.00|
| Thailand| th| THB10,000.00| ฿10,000.00|
| Thailand| en| THB10,000.00| ฿10,000.00|
| Vietnam| vi| 10.000 ₫| 10.000 ₫|
| Vietnam| en| ₫10,000| ₫10,000|
| Malaysia| en-MY| RM10,000.00| RM10,000.00|
| Malaysia| ms| RM10,000.00| RM10,000.00|
| Indonesia| id| Rp10.000| Rp10.000|
| Philippines| en-PH| ₱10,000.00| ₱10,000.00|

由表格可知，新币和泰铢在当地实际用法和 CLDR 规范并不相同。。。在参考了大量其他国际化网站的做法并咨询了 local 团队之后，我们还是决定尊重当地金额习惯展示，并由服务端向多端下发修正后的规则。 

CLDR 规范只是一个规范，实际使用中可能会遇到各种水土不服等小问题。如果项目中有多个端团队需要处理金额展示逻辑，建议尽早定义完成并由服务端约束和下发一个映射关系。

## [](#10)交互与前端组件设计

与国内电商 app 大量的淘宝风不同，国际化的 app 大部分都是依照安卓的 Material Design 交互规范而设计的。

1.  android weex 底层 : Material Design 几个基础要素 weex 均已支持。[水波纹 demo 查看](https://jsplayground.taobao.org/raxplayground/0664f079-b677-4a8d-8f96-8cab44bd609d) :

![](https://gw.alipayobjects.com/zos/skylark/a87e9c44-6dc9-4127-8092-1497e425fc11/2018/gif/d95be33b-335a-422a-b62b-a1c137fbe79e.gif)

1.  国际化的前端组件体系： 在 lazada 业务中，我们也借此机会，沉淀了基于 nuke 的基础的国际化能力，以及大量的业务组件。

## [](#11)最后

本文介绍偏各种实战中的细节，都是一些实实在在碰到和解决的问题。也欢迎各位同学补充指正。
