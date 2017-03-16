# RefreshControl 下拉刷新

滚动容器的下拉刷新功能，配合 ListView 使用时，需将 RefreshControl 放到 header 位置

## 安装

```bash
$ npm install rax-refreshcontrol --save
```

## 引用

```jsx
import RefreshControl from 'rax-refreshcontrol';
```

## 属性

| 名称         | 类型     | 默认值  | 描述        |
| :--------- | :----- | :--- | :-------- |
| refreshing | String |      | 是否显示      |
| onRefresh  | Number |      | 监听下拉刷新的行为 |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import RefreshControl from 'rax-refreshcontrol';
import ScrollView from 'rax-scrollview';

render(
<View style={{height: 500}}>
  <RefreshControl
    refreshing={true}
    onRefresh={() => {}}
  >
    <Text>下拉刷新...</Text>
  </RefreshControl>
  <ScrollView onEndReachedThreshold={300} onEndReached={() => {}}>
    <Text style={{
      color:'#ffffff',
      margin:'5rem',
      fontSize:'100rem',
      backgroundColor:"blue"
    }}>
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
        Shake or press menu button for dev menuShake or press menu button for dev menu
    </Text>
  </ScrollView>
</View>
);
```
