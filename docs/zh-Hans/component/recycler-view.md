# RecyclerView

`ScrollView` 的同门师兄，在 Weex 下是对 `list` 与 `cell` 的包装，其具有复用内部组件来提供性能的机制。


## 安装

```bash
$ npm install rax-recyclerview --save
```

## 引用

```jsx
import RecyclerView from 'rax-recyclerview';
```

## 属性

| 名称                    | 类型       | 默认值  | 描述                       |
| :-------------------- | :------- | :--- | :----------------------- |
| onEndReached          | Function |      | 滚动到底部触发事件，将修改后的数据付给 data |
| onEndReachedThreshold | Number   | 500  | 距离多少开始加载下一屏，数字单位默认 rem   |
| onScroll              | Function |      | 滚动时触发的事件，返回当前滚动的水平垂直距离 |


## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import RecyclerView from 'rax-recyclerview';

const styles = {
  sticky: {
    width: 750,
    height: 100,
    backgroundColor: 'red'
  }
};

render(<RecyclerView>
  <RecyclerView.Header>
    <View style={styles.sticky}>
      <Text>Sticky view must in header root</Text>
    </View>
  </RecyclerView.Header>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
  <RecyclerView.Cell><Text>HELLO</Text></RecyclerView.Cell>
</RecyclerView>);
```