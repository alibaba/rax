# 使用说明

在 JSX 文件中，目前限制下列语法：

1. 使用 export default 导出继承自 Rax.Component 的 class 作为 Rax 组件

   eg:

   ```jsx
   import { createElement, Component } from 'rax';
   export default class MyComponent extends Component {}
   ```

2. render 方法体中只包含一个 return 语句。  
   good:

   ```jsx harmony
   render() {
     return <view></view>
   }
   ```
   bad:
   ```jsx harmony
   render() {
     if (condition) {
       return <view></view>;
     } else {
       return <text></text>;
     }
   }
   ```

3. JSX 模板中支持三元表达式作条件判断

   ```jsx
   render() {
     return <view>
       { condition ? <text>{this.stete.children}</text> : null }
     </view>
   }
   ```

4. JSX 模板中支持数组的 map 方法循环遍历

   ```jsx
   render() {
     return <view className="container">
       { array.map((item) => (<view className="item">{item}</view>)) }
     </view>
   }
   ```

   需要注意：目前暂不支持在 map 的迭代函数中添加逻辑语句。
