# RefreshControl 下拉刷新

滚动容器的下拉刷新功能，配合 ListView 使用时，需将 RefreshControl 放到 header 位置

## 属性

| 名称         | 类型     | 默认值  | 描述        |
| :--------- | :----- | :--- | :-------- |
| refreshing | String |      | 是否显示      |
| onRefresh  | Number |      | 监听下拉刷新的行为 |

## 引用

```jsx
import RefreshControl from 'rax-refreshcontrol';
import Text from 'rax-text';
```

## 示例

```jsx
<list
  style={{height: 500}}>
  <RefreshControl
    style={styles.refreshView}
    refreshing={this.state.isRefreshing}
    onRefresh={this.handleRefresh}
  >
    <Text>{this.state.refreshText}</Text>
  </RefreshControl>
  {rows}
</list>
```

```

```