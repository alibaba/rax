# Button 按钮

Button 是基础的按钮组件。内部实现依赖 `<Touchable>` 支持 onPress 定义的点击事件。  
Button 带有默认样式，同时也支持样式的自定义。

**支持属性：**

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | 点击事件 |

同时支持任意自定义属性的透传

**引用：**

```jsx
import Button from 'rax-button';
```

**使用示例：**

```jsx
<Button onPress={(evt) => { console.log('hello'); }}>Click Me</Button>
```