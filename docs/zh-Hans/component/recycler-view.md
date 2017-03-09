# RecyclerView

`ScrollView` 的同门师兄，在Weex下是对 `list` 与 `cell` 的包装，其具有复用内部组件来提供性能的机制。


## 属性

| 名称                    | 类型       | 默认值  | 描述                       |
| :-------------------- | :------- | :--- | :----------------------- |
| onEndReached          | Function |      | 滚动到底部触发事件，将修改后的数据付给 data |
| onEndReachedThreshold | Number   | 500  | 距离多少开始加载下一屏，数字单位默认 rem   |

## 引用

```jsx
import View from 'rax-view';
import RecyclerView from 'rax-recyclerview';
```

## 示例

```jsx
<RecyclerView>
  <RecyclerView.Header>
    <View style={styles.sticky}>
      <Text>Sticky view must in header root</Text>
    </View>
  </RecyclerView.Header>
  <RecyclerView.Cell />
  <RecyclerView.Cell />
  <RecyclerView.Cell />
</RecyclerView>
```