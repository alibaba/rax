---
title: Rax 系列教程 (JS Service)
date:  20180226
author: 翊晨
---

# Rax 系列教程 (JS Service)

JS Service 是一个很久以前 weex 就已经支持的功能，在淘宝大促、千牛ISV 生态里面已有很多比较成熟的实践，本文从前端角度，介绍 JS Service 的用途与简单上手。

## [](#0)JS Service 的用途

关于设计、意图可以参考 [issue](https://github.com/alibaba/weex/issues/1938)

简单说来，JS Service 是为了**注册同一个业务中通用 JS，而不是重复地打包进每个JS bundle 中**，也就是我们 web 开发中常说的 vendor.js 。

在 Weex 容器内，JS Service 的创建先于业务 bundle ，所以当你的业务 bundle require 的时候，new 一个新的 service 即可愉快地使用了。此外 service 还有 refresh 等生命周期，本文没有涉及到这块内容，如有兴趣可自行研究。

有了 JS Service， 公共 JS 的打包不再是痛点，对于复杂业务，每个 JS Bundle 文件大小也会在可控范围内，另外还能减少开发等待时间、减少用户端网络请求等等，好处不言而喻。

## [](#1)JS Service 的问题及思考

既然这么好用，那么大规模用起来吧？

我们知道，手淘在大促业务中用这种方式，首屏渲染时间降低到原来约 40% 左右, 但仅仅是在大促中使用，并没有在日常业务中常态化。平时和相关同学也有交流，我的思考如下：

1.  JS Service 常态化以后，需要考虑 api 兼容性问题。

    不再能像[前端 semver 规范](https://semver.org/lang/zh-CN/)中约定的那样，当我们想做 breaking changes 的时候就可以随意地变更 api 。 这会直接导致使用者调用时白屏，业务不可用。

2.  JS Service BR 与多版本共存。

    既然 JS Service 有 breaking changes，那么维护多份 Service 不就好了吗？
    这显然也不是一个合理的方案，以 SDK.js 为例，如果 SDK 1.0.0 和 SDK 2.0.0 共存，而且还需要显式地声明 require SDK 1.0.0 还是 2.0.0，给对于公共类库的开发者和使用者，都无形地增加了成本。

3.  JS Service 的常态化更新问题。

    常态化更新，则需要随端发版，或通过某些渠道下发新版本的文件并重新注册 service。如果是重大升级，且业务使用层是被升级的，那么就需要非常慎重的评估风险，稍不留神可能会导致客户端 crash、业务不可用。

以上问题抛出供大家思考，在技术栈 rax + weex 的大背景下，业务形态差异比较大。可能在特定场景下各个业务会有各自的解法。

## [](#2)JS Service 上手

本章节介绍如何在已有一个类库的 npm 版本的情况下，进一步打造成 JS Service。

**所有工具、脚手架都来自督布，如有兴趣可自行骚扰。**

*   准备 JS Service

    以 nuke 为例，开发一个标准 npm 包，除正常 babel 编译外，还需要额外构建出一个 buildin.js。


    ```
    /**
    *  webpack 配置示例
    */
    // 引入插件
    var RaxPlugin = require('rax-webpack-plugin');

    // 添加 RaxPlugin
    // ...你的其他 webpack plugin
    new RaxPlugin({
    externalBuiltinModules: false,
    builtinModules: RaxPlugin.BuiltinModules,
    factoryGlobals: [
      '__weex_document__',
      'window',
      'document',
      'setTimeout',
      'clearTimeout',
      'Promise',
      'setInterval',
      'clearInterval',
      '__weex_options__',
      '__weex_data__',
      '__weex_env__'
    ]
    }),

    ```


    构建出的目录如下：

    ![](https://img.alicdn.com/tfs/TB1IXtmaKuSBuNjy1XcXXcYjFXa-356-155.jpg)]

    再按照 [service 编写的文档](https://weex.apache.org/cn/references/js-service.html#bian-xie-yi-ge-js-service) 的要求，把上面的 `weex-nuke.buildin.js` 打包成一个 JS Service 文件，命名为 `module-service.js` 。

    核心的伪代码示意如下：


    ```
    /**
    *  service 文件生成模板
    */
    const weexNuke = fs.readFileSync('yourtruepath/weex-nuke.builtin.js');
    xtpl.renderFile(
    './service/module-service.xtpl',// 写文件的模板，模板中定义 service 名称为 NukeNormalService
    {
        weexNukeContent: weexNuke,
        version: version
    },
    function(err, content) {
        fs.writeFile('./dist/module-service.js', content, function(err) {});
    }
    );

    ```


    找到`module-service.js` 这就是我们翘首以盼的目标 service 文件啦。

*   客户端添加注册 service 逻辑

    把上述的 `module-service.js` 放到客户端约定目录，添加注册相关代码。这一步需要找上一位热爱工作的客户端同 (ji) 学 (you) 完成。iOS 相关代码示例如下：
    ![](https://img.alicdn.com/tfs/TB1_DFoaKuSBuNjy1XcXXcYjFXa-1160-426.png)

    走完这一步，基本大功告成啦。

*   改造前端工程

    使用方面，我们还需要改造业务项目的 js bundle ，external 掉庞大的类库文件。


    ```
    // webpack 构建配置增加 external 配置项
    externals: {
    'weex-nuke': 'commonjs weex-nuke',
    },

    ```


    此外，最终的 bundle 还要再包裹一层 service 调用逻辑。


    ```
    /**
    * webpack 打包模板示例，在业务 bundle 外层拼接 service 调用逻辑
    * 模板是 xtpl 语法
    */
    {{#block('html')}}
    {{ $http.headers.set('Content-Type', 'application/javascript') }}

    var _NormalService;
    (function() {
        _NormalService = new __weex_config__.services.service.NukeNormalService(__weex_config__.services);

        if(_NormalService){
            _NormalService.weexNuke(window.define,'',window);
        }else if(<{%= externalNuke%}>){
            var instanceWrap = require('@weex-module/instanceWrap');
            if(instanceWrap && instanceWrap.error) {
                instanceWrap.error(1, 1000, 'Downgrade[rax]:: no built-in weex-nuke');
            }
        }
    })();
    // 拼接业务 js bundle
    {{html('bundle.js')}}
    {{/block}}

    ```


    如果需要考虑 web 降级，则在前端 html 模板中引入类库 cdn 版本即可。


    ```
    /**
    * 模板文件 pagemaster/index.xtpl 示例
    * 模板是 xtpl 语法
    */
    <script src={{raxCdn}}></script>
    {{# if(externals.nuke)}}
    <script src="{{nukeCdn}}"></script>
    {{/ if }}

    ```


至此，JS Service 的注册、使用整个流程介绍完毕，是不是很简（bian）单(tai)啊？业务 bundle 构建时就完全不用再打包类库文件，体积急速下降。

## [](#3)JS Service 在项目中的实践

### [](#4)千牛无线 QAP 应用（跟随发版，QA 介入，白名单测试，动态更新）

[千牛无线 QAP 应用](//mqap.open.taobao.com/doc.htm#?docType=1&docId=107197) 是三方服务商（ISV）开发移动端插件的平台。其中 nuke 定制版本以及定制的 QAP-SDK 作为 JS 基础组件库，需要 Service 化且需要支持动态更新的需求。

ISV 业务多且复杂，以 【旺店交易】插件为例，某一个版本的业务代码，有 60+ JS bundle 入口（没错，与淘系导购类页面根本不是一个量级），每一个 bundle 需要引入的 80% 都是库文件，若 1 个文件完整压缩后是 200K , 那么整个插件 zip 包的体积是 12M ！！ 如果使用 JS Service，那么插件体积就会减小到 2.4M。目前所有的 QAP 插件都已覆盖。

1.  使用构建平台构建 JS Service 文件。

    由于不具备通用性，此处不放出地址，原理与上一章节同。差异点在于打包的 service 文件是一个 zip 包，相应的，客户端也增加了对 zip 包解压、完整性、合法性校验的逻辑。

2.  打包到 app 或动态下发

    ![](https://img.alicdn.com/tfs/TB19_0gaKuSBuNjy1XcXXcYjFXa-730-450.png)

    客户端发版前，集成基线版本，如发版后有更新，则通过服务端下发去覆盖。覆盖后的 Service 代码，在 app 重启或 app 首页下拉刷新后被重新执行生效。

3.  白名单测试

    无论是客户端内建，还是云端下发，都需要 QA 介入，测试完成后才能发布。

    ![](https://img.alicdn.com/tfs/TB199hKaHGYBuNjy0FoXXciBFXa-1556-762.jpg)

4.  客户端拉取更新包，重新执行注册

相关 native 逻辑此处忽略，给出流程图示意如下

![](https://img.alicdn.com/tfs/TB1fS.XaTtYBeNjy1XdXXXXyVXa-888-1313.png)

这一整套流程已经在千牛 QAP 体系里稳定运行 1 年多，一开始几位开发同学都没有经验，也曾经遇到过一些小问题，现在各个环节、工具都已成熟，整体比较稳定。

### [](#5)Lazada 业务（随端发布，待上线）

Lazada app 实践中，构建流程等都类似，目前没有开启动态更新，仅跟随 app 发版。其中 JS Service 正在逐步上线，以下列出 service 使用前后文件体积对比。

![](https://img.alicdn.com/tfs/TB1.WeXaQyWBuNjy0FpXXassXXa-2878-1398.jpg)


| 文件 | service 使用前 | service 使用后 |
| --- | --- | --- |
| payment.js | 839 K | 488 K |
| payment-result.js | 730 K | 378 K |


## [](#6)抛砖

如果在 Service 上层再封装一层组件库，实现相应的工具与脚手架，一键上传、快速调试。。。 约等于 一个 weex 版本的小程序 ？

## [](#7)总结

文章至此，JS Service 已不再神秘。它为我们的 weex 业务包体积优化提供了非常多的可能与想象的空间，用好了可以发挥出巨大的价值。但若要真正用好，对前端乃至整个业务开发流程都会带来不小的挑战。