# ListView 列表容器

较复杂的列表实现，通过 dataSource 来定义每行渲染的数据，通过 renderRow 来定义每行渲染的模板，内部实现基于 RecyclerView。  
如果对性能有更高的要求推荐使用 RecyclerView，更方便进行扩展

![](https://gw.alicdn.com/tfs/TB1VQ3nRVXXXXcTXXXXXXXXXXXX-255-433.gif)

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
| dataSource            | Array     | ''   | 需要渲染的数据，与 renderRow 配合使用（必需）          |
| onEndReached          | Function |      | 滚动到底部触发事件，将修改后的数据付给 data              |
| onEndReachedThreshold | Number   | 500  | 距离多少开始加载下一屏，数字单位默认 rem                |
| onScroll              | Function |      | 滚动时触发的事件，返回当前滚动的水平垂直距离 |
| renderHeader          | Function |      | 列表头部 需返回要渲染的标签                        |
| renderFooter          | Function |      | 列表底部 需返回要渲染的标签 (可以在此处实现 loading 菊花效果) |
| renderScrollComponent | Function |      | 返回 listview 的外层包裹容器                   |

## 方法

| 名称       | 参数     | 返回值  | 描述                   |
| :------- | :----- | :--- | :------------------- |
| scrollTo | Object | /    | 参数示例：{x:0} 或 {y:100} |

<img src="https://img.alicdn.com/tps/TB1vI_iKVXXXXaUXXXXXXXXXXXX-392-701.gif" height = "300" alt="图片名称" align=center />

## 基础用法

作为页面级布局使用，必须传入 renderRow、 dataSource、 onEndReached

* renderRow 是每一行渲染的模板
* dataSource 是需要渲染的数据
* onEndReached 是拉到页面下方时的方法，在该方法中修改 data 可以实现无限下拉

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import ListView from 'rax-listview';

let listData = [
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
];
// 将 item 定义成组件

class ListViewDemo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: listData
    };
  }
  listHeader = () => {
    return (
      <View style={styles.title}>
        <Text style={styles.text}>列表头部</Text>
      </View>
    );
  }
  listLoading = () => {
    if (this.state.index < 4) {
      return (
        <View style={styles.loading}>
          <Text style={styles.text}>加载中...</Text>
        </View>
      );
    } else {
      return null;
    }
  }
  listItem = (item, index) => {
    if (index % 2 == 0) {
      return (
        <View style={styles.item1}>
          <Text style={styles.text}>{item.name1}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.item2}>
          <Text style={styles.text}>{item.name1}</Text>
        </View>
      );
    }
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.state.index++;
      if (this.state.index < 5) {
        this.state.data.push(
          {name1: 'loadmore 2'},
          {name1: 'loadmore 3'},
          {name1: 'loadmore 4'},
          {name1: 'loadmore 5'},
          {name1: 'loadmore 2'},
          {name1: 'loadmore 3'},
          {name1: 'loadmore 4'},
          {name1: 'loadmore 5'}
        );
      }
      this.setState(this.state);
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
      <ListView
        renderHeader={this.listHeader}
        renderFooter={this.listLoading}
        renderRow={this.listItem}
        dataSource={this.state.data}
        onEndReached={this.handleLoadMore}
      />
      </View>
    );
  }

};

const styles = {
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    flex: 1
  },
  title: {
    margin: 50
  },
  text: {
    fontSize: 28,
    color: '#000000',
    fontSize: 28,
    padding: 40
  },
  item1: {
    height: 110,
    backgroundColor: '#909090',
    marginBottom: 3
  },
  item2: {
    height: 110,
    backgroundColor: '#e0e0e0',
    marginBottom: 3
  },
  loading: {
    padding: 50,
    textAlign: 'center',
  }
};

render(<ListViewDemo />);
```

## ListView 上方或下放预留浮动模块

如果您的需求只需要部分模块进行滚动，则可以与需要浮动的结构混合使用

注意：此时需要设置 ListView 的高度限制滚动区域    

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
      data: [{key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}, {key: 'tom'}, {key: 'jeck'}, 
             {key: 'tom'}, {key: 'jeck'}]
    };
  }
  listItem = (item) => {
    return <Text>{item.key}</Text>; // 定义每行的结构
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.setState({
        data: [...this.state.data, { key: '我是新添加的' }]
      }); // 异步请求追加数据
    }, 3000);
  }
  render() {
    return <View style={{width: 750, height: 500}}>
      <View style={{backgroundColor: 'red'}}>这里的结构会自动浮动在页面上方</View>
      <ListView
        renderRow={this.listItem} 
        dataSource={this.state.data}
        onEndReached={this.handleLoadMore}
      ></ListView>
    </View>
  }
}
render(<Block />);
```
