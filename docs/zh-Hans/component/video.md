# Video 视频播放

Rax 中的视频播放组件。

## 属性

| 名称       | 类型      | 默认值  | 描述       |
| :------- | :------ | :--- | :------- |
| autoPlay | Boolean |      | 设置视频自动播放 |
| src      | String  |      | 视频地址     |

同时支持任意自定义属性的透传

## 引用

```jsx
import Video from 'rax-video';
```

## 示例

```jsx
<Video autoPlay src="//path/to/url" />
```

更丰富的视频功能参见 [Player](/guide/player) 组件