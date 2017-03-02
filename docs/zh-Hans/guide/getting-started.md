# 快速开始

这里我们就来从零开始，上手一个 Rax 项目。



## 工具安装

#### 安装 Node.js

对我们的一些项目工程来说，Node.js 是必须的，请先从 [Node.js 官网](https://nodejs.org/) 下载并安装 Node.js。

如果你已经安装了 Node.js，请确保本地的版本号大于或等于 `4.0.0`。

#### 安装 Weex Playground App

Weex Playground App 是 Weex Native 运行时实例 & Weex 文件预览工具。

请 [前往这里](https://weex-project.io/cn/playground.html) 下载并安装最新版本的 Weex Playground APP。

#### 安装 `rax-cli` 脚手架工具

`rax-cli` 是 Rax 提供的脚手架和集成开发工具，请在终端中执行以下命令安装。

```bash
$ npm install -g rax-cli
```

> 若安装缓慢报错，可尝试用 `cnpm` 或别的镜像源自行安装：`rm -rf node_modules && cnpm install`。



## 项目初始化

我们已经预备了开始项目的一系列工程工具，下面就可以开始初始化我们的 Rax 项目了。 

#### 初始化 rax 项目

```bash
$ rax init hello-world && cd hello-world
Creating a new Rax project in /Users/anonymous/hello-world
Install dependencies:
...
To run your app:
   cd hello-world
   npm run start
```

`rax-cli` 会自动安装 npm 依赖，若有问题则可自行安装。



## 开始开发

基于套件给我们生成的代码模板，我们就可以开始开发自己的项目了。

```jsx
import {createElement, Component, render} from 'rax';
import {View, Text} from 'rax-components';
import styles from './index.css';

class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <View style={styles.appHeader}>
          <Text style={styles.appBanner}>Welcome to Rax</Text>
        </View>
        <Text style={styles.appIntro}>
          To get started, edit src/pages/index.js and save to reload.
        </Text>
      </View>
    );
  }
}

render(<App />);
```



## 页面预览

执行 `npm run start` 预览。

终端中会显示两个二维码，其中第一个是 Web 页面地址，第二个是 Weex 页面地址。

以`index`页面为列，对应的页面地址如下：

* Web 页面：http://localhost:8080/src/pages/index/index.html
* Weex 页面：http://localhost:8080/src/pages/index/index.html?wh_weex=true （在浏览器环境直接访问该地址，可以得到 Web 页面；通过 Weex Playground App 扫描二维码访问该地址，则会返回相应的 Native 页面）
