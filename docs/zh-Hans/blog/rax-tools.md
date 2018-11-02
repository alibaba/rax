---
title: Rax 系列教程（工具）
date: 20180307 
author: 督布
---


# Rax 系列教程（工具)

工欲善其事必先利其器。在Rax开发相关的整条链路上，厂内的小伙伴们已经积累了大量的实践经验与相应工具产出。使用这些工具相信能在一定程度上提升你的开发效率。当前作为一个前端多面手知道如何使用工具还远远不够，了解其背后的工作原理也是十分重要的。

本文将从工具开发原理入手介绍如何从0开始搭建rax业务及其组件的开发环境，顺便安利几款开发工具供大家使用。

## [](#0)官方工具库

*   babel-preset-rax

> 组合了包括babel-preset-stage-0 ~ es2017 等常用的babel preset 及 plugin。

*   rax-webpack-plugin

> 顾名思义转为rax进行webpack打包的插件，打出能够被客户端识别的jsbundle全靠它。

*   stylesheet-loader

> 使用stylesheet-loader让css in js 也变得好用起来。

*   rax-hot-loader & rax-hot-module-replacement-webpack-plugin

> weex一样可以支持代码热更新，开发效率double不是问题。

*   weex-devtool

> weex调试工具

对于对webpack比较了解的前端开发者来说，利用以上工具库可以自由组合打造自己的weex开发环境。下面让我们尝试组合这些工具搭建一个小型的业务开发环境

## [](#1)业务开发

### [](#2)打包一个weex bundle

> 难度等级：✨

假设我们的项目目录是酱式儿的：


```
├── build
├── package.json
├── src/index.jsx

```


页面只有一个入口index.jsx，要构建一个三端可用的页面需要做如下操作：

*   增加webpack.config.js 文件，并安装webpack、babel-core、babel-loader等相应依赖到devDependencies。
*   配置babel-loader、rax-webpack-plugin

见配置文件:


```
const RaxPlugin = require('rax-webpack-plugin');
const webpack  = require('webpack');
const babelConfig = {
    presets:[require.resolve('babel-preset-rax')]
}
const config = {
    entry:{
        index:'./src/index'
    },
    output:{
        filename:'[name].js',
        publicPath:'build'
    },
    module:{
        rules:[{
            test:/\.js|\.jsx?，
            include:[new RegExp(/node_modules\/.*@.*/)]
            use:`${require.resolve('babel-loader')}?${JSON.stringify(babelConfig)}`
        }]
    },
    plugins:[
        new RaxWebpackPlugin({
          target: 'bundle'
        })
    ]
}
moduex.exports = config;

```


然后就可以准备src/index.jsx的源代码了：


```

/** @jsx createElement */
import { createElement, Component, render } from 'rax';
import { View, Text } from 'weex-nuke';

class App extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View>
        <Text>Hello World</Text>
      </View>
    );
  }
};
render(<App />);

```


> PS:没有用过preact等类react框架的同学肯定会对/** @jsx createElement */ 和无缘无故的import createElement有些奇怪。这是因为JSX扩展语法是从 React 独立出来的语法，Babel/Bublé这些编译器默认会把调用`React.createElement()`来编译 JSX. babel-preset-rax增加了对/**@jsx createElement**/的默认设置，使用babel-preset-rax而非自定义组合babel preset和plugin进行编译的开发者可以不写这行特别的注释。参考这行代码：_[babel-preset-rax](https://github.com/alibaba/rax/blob/master/packages/babel-preset-rax/src/index.js#L18)

### [](#3)加些语法糖

> 难度等级：✨

增加scss或者less的支持，增加await、async的语法支持。


```
const babelConfig = {
    presets:[require.resolve('babel-preset-rax')],
    plugins:[
        require.resolve('babel-plugin-transform-runtime'),
        require.resolve('babel-plugin-transform-regenerator')
    ]
};
module:{
    rules:[{
        test:/\.less?，
        use:[require.resolve('stylesheet-loader'),require.resolve('less-loader'),]
    },{
        test:/\.js|\.jsx?，
        include:[new RegExp(/node_modules\/.*@.*/)]
        use:`${require.resolve('babel-loader')}?${JSON.stringify(babelConfig)}`
    }]
 },

```


> PS:weex rax 包括react-native这些技术栈都不存在css的概念。为了让开发者可以使用css的方式写此类技术栈的样式， [css in js](https://github.com/cssinjs) 技术应用而生。从技术原理上一版都是讲css 语法编译成js object，最终同jsbundle打包在一起。[](https://github.com/cssinjs)

### [](#4)开发与生产环境隔离

> 难度等级：✨✨✨

最直接的做法是抽取webpack中的公用配置，在开发与生产环境通过不同的构建命令与环境变量区分。在上述完成的基本配置的基础上，我们通过 `process.env.NODE_ENV` 来进行不同环境的 webpack 配置。最终可以在 npm scripts中维护以下两个脚本：


```
  "scripts": {
    "dev": "webpack-dev-server --config webpack.config.js NODE_ENV=development",
    "dist": "webpack --config webpack.config.js NODE_ENV=production"
  },

```


**PS:**process.env.NODE_ENV 的设置意义不光是区分开发者自己的开发环境，对于一些三方打包相关loader或插件来说在开发和生产环境也有些表现上的差别。**eg**:`stylesheet-loader`这款loader会在开发环境输出weex不支持的样式警告，而在生产环境不会有任何输出。

webpack.config.js


```

if(process.env.NODE_ENV === 'development'){
    // 为开发环境增加单独配置
}
if(process.env.NODE_ENV === 'production'){
    // 为生产环境增加单独配置
}

```


#### [](#5)代码压缩


```
if(process.env.NODE_ENV === 'prodution'){
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          mangle: { keep_fnames: true }, 
          minimize: false,
          compress: { warnings: false, drop_console: false, keep_fnames: true },
          output: { comments: false },
        })
    )
}

```


#### [](#6)代码热更新与热替换


```
const RaxHotModuleReplacementPlugin = require('rax-hot-module-replacement-webpack-plugin');
if(process.env.NODE_ENV === 'developement'){
    config.entry.forEach((point)=>{
         webpackConfigDev.module.loaders.forEach((loader) => {
          if (loader.test.toString() === /\.js|\.jsx?$/.toString()) {
             const appIndexjs = `${path.resolve(cwd, `src/${config.entry[point][0]}`)}.jsx`;
             loader.loaders.push(`${require.resolve('nuke-hot-dev-utils/module-hot-accept')}?appIndex=${appIndexjs}`);
         }
     });
    config.entry[point].unshift(require.resolve('rax-hot-loader/patch'));
    config.entry[point].unshift(require.resolve('nuke-hot-dev-utils/webpackHotDevClient'));
    })
    config.plugins.push(new RaxHotModuleReplacementPlugin())
}

```


同时，文件组织的方式也需要做稍许变更，如下图：

![image.png | center | 300x106](https://gw.alipayobjects.com/zos/skylark/b7a84d9f-617e-4c02-9767-574d47b4b2df/2018/png/6e34b458-5ea4-4c54-8877-22a5d7f67763.png]
热更新的原理本文不再赘述了，感兴趣的同学可以移步这里 [https://www.atatech.org/articles/81931。](https://www.atatech.org/articles/81931%E3%80%82)

### [](#7)增加单测

推荐使用 jest 并结合rax-test-renderer 对项目进行单元测试。测试demo如下所示：


```
import renderer from 'rax-test-renderer';
import { Component, createElement } from 'rax';
import Button from '../src/index';

describe('Button', () => {
  it('should render a button', () => {
    const component = renderer.create(<Button />);
    const tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  }
});

```


在安装完成jest后，在package.json中增加npm srcipt :


```
script:{
    "test": "jest"
}

```


### [](#8)调试

weex 官方文档中已经给出了比较清晰的介绍。不清楚流程的同学可以参考最新版本的 weex-toolkit 2.0。

### [](#9)降级

构建出的jsbundle在降级情况下需要html模板来承载。这时候我们需要在jsbundle前引用 [web-rax-framework](https://github.com/alibaba/rax/tree/master/packages/web-rax-framework) 的cdn资源，补充web下的polyfill，从而实现大部分浏览器下的兼容。与之对应的在客户端内还有 [weex-rax-framework](https://www.npmjs.com/package/weex-rax-framework) ,为我们提供了包括window在内的各种rax全局API。阿里系集成aliweex的客户端均已支持。在依赖以上两个framework之后，此时在构建过程中可以选择把rax external掉，以减少代码体积。类似下面这样的代码：



## [](#14)组件开发

组件开发需要依赖于项目开发的环境进行调试，先在项目开发环境的基础上进行一些目录改造：


```
├── demo/basic.jsx         // 组件demo 
├── package.json 
├── lib                    // 存放babel后的代码  
├── src/index.jsx          // 组件源码

```


`demo/basic.jsx`的主要作用是在组件调试阶段引用组件并render到页面上，`demo`的构建过程与业务开发完全相同，只需将`webpack entry`字段的页面入口调整为`demo/basic.jsx`即可。

与业务开发不同的是，组件开发一般只需将源码进行babel转换而无需将进行打包。因此在发布前需要使用`babel-preset-rax` 对src目录的js文件进行一次`babel`，并将所有的文件拷贝到lib目录。

> **PS:**关于是否将组件源码还是babel后的代码暴露给其他开发者，在社区依旧存在一些争论。目前比较普遍的做法是在packcage.json中声明两个字段，以根据开发者自己的需求进行构建配置。redux等类库都采用了这种方式：


```
{ 
    main:"lib/index",
    module:"src/index"
}

```


以上就搭建完成了一个最最基础的组件开发环境。当然，对于体系化的组件开发来说，还需要考虑到组件API文档、demo、单元测试、自动化测试等一系列功能。