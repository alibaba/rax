# Grid 栅格布局

面向移动端页面的简单布局标签，提供外部布局容器标签 Grid，内容标签 Col，以及多行多列布局 MultiRow。

## 示例

### 引用

```jsx
import {Grid, Col, MultiRow} from 'rax-grid';
```

### 默认等宽度布局

等宽布局支持任意多列

等宽3列布局：

![](https://img.alicdn.com/tps/TB17t9SKVXXXXXnapXXXXXXXXXX-415-116.png)

```jsx
<Grid >
  <Col></Col>
  <Col></Col>
  <Col></Col>
</Grid>
```

等宽两列布局：

![](https://img.alicdn.com/tps/TB1Dk9OKVXXXXciapXXXXXXXXXX-415-115.png)

```jsx
<Grid >
  <Col></Col>
  <Col></Col>
</Grid>
```

### 自定义列宽度

下面示例中第一列占整个容器的 1/3，第二列占整个容器的 2/3

![](https://img.alicdn.com/tps/TB1LL5TKVXXXXcHaXXXXXXXXXXX-415-113.png)

```jsx
var styles = {
  col1: {
    flex: 1
  },
  col2: {
    flex: 2
  },
}
<Grid >
  <Col style={styles.col1}></Col>
  <Col style={styles.col2}></Col>
</Grid>
```

### 多行布局

![](https://img.alicdn.com/tps/TB12k55KVXXXXXfXVXXXXXXXXXX-415-230.png)

```jsx
<MultiRow dataSource={['tom', 'jeck', 'lilei', 'hanmeimei']} 
  cells={2} renderCell={(num, index) => { return <View>{num}</View> }} />
```

## API

**MultiRow**

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|renderCell|Function|\|模板方法（必需）|
|dataSource|List|\|需要渲染的数据，与 renderRow 配合使用（必需）|
|cells|Num|\|每行包含几列，默认1列（必需）|
