# ListView 列表容器

较复杂的列表实现，内部实现基于 RecyclerView。

## 安装

```bash
$ npm install rax-listview --save
```

## 引用

```jsx
import ListView from 'rax-listview';
```

## 属性

| 名称                    | 类型       | 默认值  | 描述                                    |
| :-------------------- | :------- | :--- | :------------------------------------ |
| renderRow             | Function |      | 模板方法（必需）                              |
| dataSource            | List     | ''   | 需要渲染的数据，与 renderRow 配合使用（必需）          |
| onEndReached          | Function |      | 滚动到底部触发事件，将修改后的数据付给 data              |
| onEndReachedThreshold | Number   | 500  | 距离多少开始加载下一屏，数字单位默认 rem                |
| renderHeader          | Function |      | 列表头部 需返回要渲染的标签                        |
| renderFooter          | Function |      | 列表底部 需返回要渲染的标签 (可以在此处实现 loading 菊花效果) |
| renderScrollComponent | Function |      | 返回 listview 的外层包裹容器                   |

## 方法

| 名称       | 参数     | 返回值  | 描述                   |
| :------- | :----- | :--- | :------------------- |
| scrollTo | Object | /    | 参数示例：{x:0} 或 {y:100} |

## 基础用法

作为页面级布局使用，必须传入 renderRow、 dataSource、 onEndReached

* renderRow 是每一行渲染的模板
* dataSource 是需要渲染的数据
* onEndReached 是拉到页面下方时的方法，在该方法中修改 data 可以实现无限下拉

<img src="https://img.alicdn.com/tps/TB1vI_iKVXXXXaUXXXXXXXXXXXX-392-701.gif" height = "300" alt="图片名称" align=center />

```jsx
// demo
import {createElement, Component, render} from 'rax';
import ListView from 'rax-listview';
import View from 'rax-view';
import Text from 'rax-text';

// 参数传入
class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{key: 'tom'}, {key: 'jeck'}]
    };
  }
  listHeader = () => {
    return (<Text>这里是插在列表头部的自定义内容</Text>);
  }
  listFooter = () => {
    return (<Text>这里是插在列表尾部的自定义内容</Text>);
  }
  listItem = () => {
    return <Text>{item.key}</Text>; // 定义每行的结构
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.setState({
        data: [...this.state.data, { name1: 'kimmy1' }]
      }); // 异步请求追加数据
    }, 3000);
  }
  render() {
    return <View>
      <ListView 
        renderHeader={this.listHeader} 
        renderFooter={this.listFooter} 
        renderRow={this.listItem} 
        dataSource={this.state.data}
        onEndReached={this.handleLoadMore}
      ></ListView>
    </View>
  }
}
render(<Block />);
```

## 简单用法

如果项目中不需要在列表上下插入结构可以按照下面方式精简

```jsx
// demo
import {createElement, Component, render} from 'rax';
import ListView from 'rax-listview';
import View from 'rax-view';
import Text from 'rax-text';

// 参数传入
class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{key: 'tom'}, {key: 'jeck'}]
    };
  }
  listItem = () => {
    return <Text>{item.key}</Text>; // 定义每行的结构
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.setState({
        data: [...this.state.data, { name1: 'kimmy1' }]
      }); // 异步请求追加数据
    }, 3000);
  }
  render() {
    return <View>
      <ListView 
        renderRow={listItem} 
        dataSource={this.state.data}
        onEndReached={this.handleLoadMore}
      ></ListView>
    </View>
  }
}
render(<Block />);
```

## ListView 上方或下放预留浮动模块

如果您的需求只需要部分模块进行滚动，则可以与需要浮动的结构混合使用

注意：此时需要设置 ListView 的高度限制滚动区域

<img src="https://img.alicdn.com/tps/TB1tWO2KVXXXXaFXVXXXXXXXXXX-392-701.gif" height = "300" alt="图片名称" align=center />
​    
```jsx
// demo
import {createElement, Component, render} from 'rax';
import ListView from 'rax-listview';
import View from 'rax-view';
import Text from 'rax-text';

// 参数传入
class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{key: 'tom'}, {key: 'jeck'}]
    };
  }
  listItem = () => {
    return <Text>{item.key}</Text>; // 定义每行的结构
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.setState({
        data: [...this.state.data, { name1: 'kimmy1' }]
      }); // 异步请求追加数据
    }, 3000);
  }
  render() {
    return <View>
      <View>这里的结构会自动浮动在页面上方</View>
      <ListView 
        renderRow={listItem} 
        dataSource={this.state.data}
        onEndReached={this.handleLoadMore}
      ></ListView>
    </View>
  }
}
render(<Block />);
```

## ListView 可替换内部容器

下面示例是以页面级标签 Page 作为页面滚动基础，ListView 依赖 Page 的页面滚动加载数据行为。  
最终实现的效果是，ListView 失去自身滚动能力，Page 标签对外暴露滚动加载数据的方法。  

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import ListView from 'rax-listview';
import ScrollView from 'rax-scrollview';
import FlowView from 'rax-flowview';

// ignore
const styles = {
  container: {
    height: 1000
  }
};
class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
        <ListView 
          renderHeader={listHeader} 
          renderFooter={listFooter} 
          renderScrollComponent={(props) => {
            return <FlowView {...props} />
          }}
          renderRow={listItem} 
          dataSource={this.state.data}
          onEndReached={this.handleLoadMore} 
        />
        </ScrollView>
      </View>
    );
  }
}

render(<App />);
```
