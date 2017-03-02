# Page

## 综述

**Page**
页面级的外层嵌套标签，内部暴露事件通信的方法。

**Block**
保证 Block 标签内部是可以垂直滚动的，同时暴露滚动页面的加载更多方法。

**RXInit**
搭建平台通用渲染逻辑

**TODO List**

* 配合 abs 与 斑马 的入口，传入 xctrl 与 use 方案联调
* 配合真实 repeat 模块联调
* 命运石环境测试

## 1、页面级事件中心

**如何使用页面级公用方法**

首先设置 context 类型

```  
  static contextTypes = {
    page: PropTypes.object
  };
```

调用通用方法

```
  let page = this.context.page;
  // 注册页面滚动到底部方法
  page.on('pageEndReached', () => {});
  // 调用页面方法，页面滚动到指定位置
  page.emit('pageScrollTo', {y: 0});
  // 调用页面方法，重置页面滚动，设置为初始化状态
  page.emit('pageResetScroll');
```

(详细用法参见下方示例)

## 2、独立应用或页面使用方案

**标签基本使用**

```
  <Page>
    <Block>
      <Module1 />
      <Module2 />
      <Module3 />
    </Block>
  </Page>
```

**示例A：跨模块通信**（Page 标签内部模块使用示例）

```
class Module1 extends Component {
  static contextTypes = {
    page: PropTypes.object
  };

  componentWillMount() {
    let page = this.context.page;
    console.log(page);
    if (page) {
      page.on('from_module2', () => {
        console.log('accept message from module2');
      });
    }
  }

  render() {
    return (<View style={{
      height: '300rem',
      backgroundColor: '#efefef',
    }}>Module 1 <Button onPress={() => this.context.page.emit('from_module1')}>Send message</Button></View>);
  }
}

class Module2 extends Component {

  static contextTypes = {
    page: PropTypes.object
  };

  componentWillMount() {
    let page = this.context.page;
    if (page) {
      page.on('from_module1', () => {
        console.log('accept message from module1');
      });
    }
  }

  render() {
    return (<Button onPress={() => this.context.page.emit('from_module2')}>Send message</Button>);
  }
}
```

**示例B：页面加载更多**（Page 标签内部使用示例）

```
class Module3 extends Component {

  static contextTypes = {
    page: PropTypes.object
  };

  componentWillMount() {
    let page = this.context.page;
    if (page) {
      page.on('pageEndReached', () => {
        console.log('loadmore from module3');
      });
    }
  }

  render() {
    return (<View style={{
      height: '300rem'
    }}>Module 3 for loadmore</View>);
  }
}
```

**abs 场景下如何使用**

* 模块之间的通信参考示例 A
* 页面底部加载数据方法可以通过 rx-listview 的 onEndReached 方法，需要注意参数 renderScrollComponent 传入指定容器 rx-flowview ([参考rx-listview](http://gitlab.alibaba-inc.com/kg/rx-listview))

## 3、搭建平台使用方案（面向 Pi）


PI的Rx版本，用于ABS和斑马搭建体系中的Rx环境中

### 1、模块编程定义规范

#### 获取模块行高 getModuleRowHeight

```js
class MyModule extends Component {
  static getModuleRowHeight = (attrs) => {
    // return number
  };
  render() {
    // ...
  }
}
```

#### 获取模块列数 getModuleCol

使用方法类似 getModuleRowHeight

#### 模块自定义 spmC

返回自定义的 spmC 字符串

#### 模块数据禁用自动请求 disableModuleDataAutoFetch

* false: `disableModuleDataAutoFetch`是`false`，PI会按规则自动注入业务数据
* true：禁用PI会按规则自动注入业务数据，模块自己来请求数据

```js
import fetch from 'rx-fetch';

// 无限下拉场景
class MyModule extends Component {
  static disableModuleDataAutoFetch = true;
  componentWillMount() {
    fetch('http://example.com');
  }
  render() {
    // ...
  }
}
```

#### 模块渲染模式 moduleRenderMode

设置模块渲染模式的前置条件是`moduleLevel`为`page`。

* cell: 默认`moduleRenderMode`是`cell`，表示整个模块按一个`cell`单元平铺渲染
* header：表示区块头，会以`sticky`方式渲染
* repeat: 表示模块以列表的方式重复渲染

```js
class MyModule extends Component {
  static moduleRenderMode = 'repeat';
  componentWillMount() {
    if (this.props.isFirstRepeatModule) {

    }
  }
  render() {
    // ...
  }
}
```


#### repeat 模块编写规范

**简单模块示例**

```js
class Module extends Component {
  
  // 模块行高
  static getModuleRowHeight = (attrs) => {
    return 100；
  };
  // 无限重复的模块
  static moduleRenderMode = 'repeat';

  render() {
    return (<View>data : {this.props.data}</View>);
  }

}
```

**单个 repeat 模块复杂示例**（包含模块内的异步请求）

```js
class Module extends Component {
  
  // 模块行高
  static getModuleRowHeight = (attrs) => {
    return 100；
  };
  // 无限重复的模块
  static moduleRenderMode = 'repeat';

  // 事件通信
  static contextTypes = {
    page: PropTypes.object
  };

  componentWillMount() {

    let page = this.context.page;

    // isFirstRepeatModule 允许 repeat 模块内与页面事件通信的作用范围
    if (page && this.props.isFirstRepeatModule) {

      let moduleName = this.props.moduleName;

      // 获取当前模块索引 this.props.index
      // 以及 repeat 模块中的行索引 this.props.rowIndex

      // 模拟异步请求数据
      setTimeout(() => {
          // 重置模块数据
          this.props.setDataSource(['异步数据1', '异步数据2']);
      }, 3000);

      // 滚动到模块底部（可在此处加载下一页模块数据）
      page.on(this.props.moduleEndReachedEvent, () => {
        // 可以触发第二屏的异步请求
      });
    }
  }

  render() {
    return (<View>data : {this.props.data}</View>);
  }

}
```

#### 模块内部上下文事件

覆盖页面的弹窗方法

* pageShowModal 填充弹窗模块内容
* pageCloseModal 移除弹窗模块内容

使用示例，注意弹出操作完成以后必须移除掉所弹出的内容

```
  if (page) {
    page.emit('pageShowModal', <View />);
    setTimeout(() => {
      page.emit('pageCloseModal');
    });
  }
```


### 2、模块搭建属性规范

#### 模块级别 moduleLevel

* page: 默认`moduleLevel`是`page`，模块将放置在可滚屏的容器下
* app: 表示应用级常驻模块，通常单页应用中导航模块需要设置为`app`

#### 模块懒加载属性

* <del>模块忽略懒加载 moduleIgnoreLazy （目前没有用到，懒加载规则依赖数据加载情况，weex 第二屏则会全部请求）</del>

### 3、PI 入口调用方式

```
RxInit.inject({
  moduleRequire: use, 
  moduleRequest: tce,
  moduleConfig: {
    backgroundColor: 'skyblue', // 约定的全局背景色
    spmAB: ['a', 'b'], // 页面买点 a b 位
    moduleList: [], // 透传模块列表
    firstScreenPaintReadyTime: 900, // 模拟的首屏绘制结束时间，如果不传则使用默认值
  },
});

// 先渲染页面占位同期
RxInit.renderPagePlaceholder();

// PI 入口请求回 floors 数据后渲染页面
setTimeout(function() {
  RxInit.render(floors);
}, 2000);

```

## 如何测试本地回归环境

```
  tnpm ii // 首先安装本地 demo 环境所需依赖资源
  def d -k // 然后本地构建过程中不删除本地 node_modules 目录
  def build -l // 测试本地构件文件
```