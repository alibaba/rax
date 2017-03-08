# MultiRow 多列布局

面向移动端页面的多列布局组件。

### 引用

```jsx
import MultiRow from 'rax-multirow';
```

### 多列布局

![](https://img.alicdn.com/tps/TB12k55KVXXXXXfXVXXXXXXXXXX-415-230.png)

```jsx
<MultiRow dataSource={['tom', 'jeck', 'lilei', 'hanmeimei']} 
  cells={2} renderCell={(num, index) => { return <View>{num}</View> }} 
/>
```

### 属性

**MultiRow**

| 名称         | 类型       | 默认值                            | 描述   |
| :--------- | :------- | :----------------------------- | :--- |
| renderCell | Function | \|模板方法（必需）                     |      |
| dataSource | List     | \|需要渲染的数据，与 renderRow 配合使用（必需） |      |
| cells      | Num      | \|每行包含几列，默认1列（必需）              |      |
