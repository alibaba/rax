# Toast 弹出框

## API

```jsx
show(message, duration = SHORT_DELAY);
```

- message: toast 中展示的信息;  
- duration: 自定义持续的时间，SHORT 2s， LONG 3.5s;

## 示例

```jsx
import Toast from 'universal-toast';
Toast.show('Hi'); // Default duration is SHORT
Toast.show('Hello', Toast.SHORT);
Toast.show('Hello', Toast.LONG);
```
