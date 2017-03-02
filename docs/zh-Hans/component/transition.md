# Transition 渐变动画

## 安装

```bash
$ npm install universal-transition --save
```

## 引入

```jsx
import transition from 'universal-transition';
```

## API

```jsx
const box = findDOMNode(this.refs.box); // 获取元素
// 调用动画方法
transition(box, {
  transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)',
  opacity: '0.5'
}, {
  timingFunction: 'ease',
  delay: 0,
  duration: 1000
}, function() {
  console.log('animation end');
});
```

