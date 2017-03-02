# ScrollView 滚动容器

ScrollView 是一个包装了滚动操作的组件。一般情况下需要一个确定的高度来保证 ScrollView 的正常展现。  

## 属性

| 名称                             | 类型      | 默认值  | 描述                                       |
| :----------------------------- | :------ | :--- | :--------------------------------------- |
| scrollEventThrottle            | Number  |      | 这个属性控制在滚动过程中，scroll事件被调用的频率（默认值为100），用于滚动的节流 |
| horizontal                     | boolean |      | 设置为横向滚动                                  |
| showsHorizontalScrollIndicator | Boolean |      | 是否允许出现水平滚动条，默认true                       |
| showsVerticalScrollIndicator   | Boolean |      | 是否允许出现垂直滚动条，默认true                       |
| onEndReachedThreshold          | Number  |      | 设置加载更多的偏移，默认值为500                        |
| onEndReached                   | String  |      | 滚动区域还剩 `onEndReachedThreshold` 的长度时触发    |

## 引用

```jsx
import Text from 'rax-text';
import ScrollView from 'rax-scrollview';
```

## 使用示例

```jsx
<ScrollView onEndReachedThreshold={300} onEndReached={()=>{}}>
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
```
