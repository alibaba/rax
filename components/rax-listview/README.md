# ListView

[![npm](https://img.shields.io/npm/v/rax-listview.svg)](https://www.npmjs.com/package/rax-listview)

More complex list, Internal implementation dependent RecyclerView.

## Install

```bash
$ npm install rax-listview --save
```

## Import

```jsx
import ListView from 'rax-listview';
```

## Props

| name      | type       | default  | describe   |
| :-------------------- | :------- | :--- | :------------------------------------ |
| renderRow             | Function |      | template method (necessary)
                              |
| dataSource            | List     | ''   | data that needs to be rendered, Use with renderRow (necessary)          |
| onEndReached          | Function |      | scroll to bottom trigger event
              |
| onEndReachedThreshold | Number   | 500  | distance of bottom place                |
| onScroll              | Function |      | event triggered when scrolling
 |
| renderHeader          | Function |      | render list header                        |
| renderFooter          | Function |      | render list footer |
| renderScrollComponent | Function |      | render scroll component in list                   |

## Function

| name       | param     | return  | describe                   |
| :------- | :----- | :--- | :------------------- |
| scrollTo | Object | /    | param example：{x:0} or {y:100} |

<img src="https://img.alicdn.com/tps/TB1vI_iKVXXXXaUXXXXXXXXXXXX-392-701.gif" height = "300" alt="image name" align=center />

## Basic example

Must pass params： renderRow、 dataSource、 onEndReached

* renderRow: templates for each row
* dataSource: data that needs to be rendered
* onEndReached: callback for triggering bottom of list

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import ListView from 'rax-listview';
import Touchable from 'rax-touchable';


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
          <Text style={styles.text}>loading...</Text>
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

## ListView with fixed module 

```jsx
// demo
import {createElement, Component, render} from 'rax';
import ListView from 'rax-listview';
import View from 'rax-view';
import Text from 'rax-text';

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
    return <Text>{item.key}</Text>; 
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.setState({
        data: [...this.state.data, { key: 'new data' }]
      }); 
    }, 3000);
  }
  render() {
    return <View style={{width: 750, height: 500}}>
      <View style={{backgroundColor: 'red'}}>header module</View>
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
