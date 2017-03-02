# rax-components

提供最常用的标签，包含页面所需的最基础功能，当前版本包含功能如下

* [Button 按钮](./guide/button)
* [Image 图片](./guide/image.md)
* [Link 跳转链接](./guide/link.md)
* [ListView 长列表](./guide/list-view.md)
* [RecyclerView 优化性能的列表容器](./guide/recycler-view.md)
* [RefreshControl 下拉刷新](./guide/refresh-control.md)
* [ScrollView 水平或垂直的滚动容器](./guide/scroll-view.md)
* [Slider 轮播组件](./guide/slider.md)
* [Switch 开关按钮](./guide/switch.md)
* [Text 文本](./guide/text.md)
* [TextInput 输入框](./guide/text-input.md)
* [TouchableHighlight 点击容器](./guide/touchable-highlight.md)
* [Video 视频播放](./guide/video.md)
* [View 最基础的容器](./guide/view.md)

## 跨端与兼容性

* 基础标签做了 web 与 native 兼容，表现基本一致。  
* 特殊标签只做了 native 端的支持，比如 Slider、RefreshControl 。此类标签在实现跨端的兼容时需要引用相应的 web 组件、或者借住 web 的原生行为来实现

## 如何使用 components

引用方式

```
import {View, Text, ScrollView, TouchableHighlight} from 'rax-components';
```

嵌套使用示例

```
<ScrollView>
	<View>
		<Text>Hello</Text>
	</View>
	<View>
		<Text>Components</Text>
	</View>
</ScrollView>
```

属性传入示例

```
<TouchableHighlight onPress={()=>{}} style={{}}>
	<Text>
		Click Me
	</Text>
</TouchableHighlight>
```
