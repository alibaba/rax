# Parallax

[![npm](https://img.shields.io/npm/v/rax-parallax.svg)](https://www.npmjs.com/package/rax-parallax)

## Install

```bash
$ npm install --save rax-parallax
```

## Import

```jsx
import Parallax from 'rax-parallax';
```

default style：

```jsx
<Parallax />
```

user defined style：

```jsx
<Parallax />
```
> Note: weex environment must be placed in the first position of ScrollView

## Props

| name      | type       | default  | describe   |
| :---------- | :------- | :--------------------------------------- | :--------------------- |
| bindingScroller        | ref   |   |  scroller reference, such as a listView |
| transform        | Array   | [] | transform properties |
| opacity   | Number   |  | opacity property for transition |
| backgroundColor  | String   | backgroundColor property for transition |
| extraBindingProps      | Array | [] | extra props for bindingx |

## Example

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import ListView from 'rax-listview';
import Picture from 'rax-picture';
import Parallax from 'rax-parallax';

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

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        bindingScroller: this.refs.listView
      });
    }, 100);
  }

  render() {
    return (
      <View style={styles.container}>
        <Parallax
          bindingScroller={this.state.bindingScroller}
          transform={[
            {
              type: 'translate',
              in: [0, 660],
              out: [0, 0, 0, -660] // [x1,y1,x2,y2]
            },
            {
              type: 'scale',
              in: [-150, 0],
              out: [1.3, 1.3, 1, 1]  // [x1,y1,x2,y2]
            }
          ]}>
          <Picture style={{width: 750, height: 576}}
            source={{uri: '//gw.alicdn.com/tfs/TB12DNfXMmTBuNjy1XbXXaMrVXa-750-576.png'}} />
        </Parallax>
        <ListView
          ref="listView"
          style={styles.list}
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
    flex: 1
  },
  title: {
    margin: 50,
    height: 300
  },
  text: {
    fontSize: 28,
    color: '#fff',
    padding: 40
  },
  list: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
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
