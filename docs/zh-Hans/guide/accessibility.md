# 信息无障碍开发教程

这篇教程旨在帮助开发者快速上手 Rax 无障碍开发 (Weex 下目前只有 iOS 支持无障碍)。

## 什么是信息无障碍

信息无障碍，即「accessibility」（常常缩写成「a11y」），是相对有障碍访问而言的，常见的有障碍访问场景有两类。

一种是用户因为生理缺陷，没有能力按正常的交互方式访问，举几个例子：

* 视障人士看不见或看不清，无法感受应用上的信息，动效，氛围；
* 听障人士听不见或听不清，无法听到音乐以及视频的语音部分；
* 老年人视力和听力的退化；

一种是用户因为客观原因短时间内无法按正常的交互方式访问，比如开车的时候不方便看着屏幕操作。

无障碍的基本目标是使用户接收到产品想要传达的信息，更高的目标则是所有用户接收到的信息是同等的。

据统计，目前每天访问手淘仅 iOS 版本就有 5 万左右的需要无障碍的用户，在双十一当天甚至达到了 14 万多。

## 组件无障碍属性

### accessible={boolean} 和 aria-hidden={boolean}

这两个属性可以控制结点是否能够获得焦点。

以下组件默认能够获得焦点：

* Text
* Image
* Video
* TextInput
* Switch

而容器类型组件默认不能获得焦点：

* View
* Link
* ScrollView
* ListView
* Cell
* Slider
* ...

添加 `accessible={true}` 属性，可以强制使组件能够获得焦点。同时，容器组件包含的子组件将无法获得焦点。

对应的，添加 `aria-hidden={true}` 之后，组件以及它的子组件都不能获得焦点。

### aria-label={string}

组件的朗读内容。Text 组件默认是会朗读其包裹的文本内容的，当设置了 `aria-label` 之后会朗读 `aria-label` 设置的内容。

### role={string}

组件的 role 一般不需要进行设置，Text 组件的 role 的默认值是 `text`，Image 组件的 role 的默认值是 `img`，TextInput 组件的 role 的默认值是 `input`。

组件角色支持：

* text，代表当前元素是文本
* img，中文语音下在朗读完内容的短暂停顿之后会朗读出「图片」，代表当前元素是图片
* link，中文语音下在朗读完内容的短暂停顿之后会朗读出「链接」，代表当前元素是链接，点击会引导至内部或外部的资源，
* button，中文语音下在朗读完内容的短暂停顿之后会朗读出「按钮」，代表当前元素是按钮，点击会触发某个交互行为
* input，中文语音下在朗读完内容的短暂停顿之后会朗读出「文本栏」，代表是输入框
* search voiceOver会读到搜索栏, 一般会用在input 输入框上，建议结合输入框的 [return-key-type](https://weex.apache.org/cn/references/components/input.html#特性) 使用
* header voiceOver 会读 标题
* selected voiceOver 会读 已选定，可以结合 button 或者text 这些role 来使用
* frequentUpdates voiceOver 不会读出任何控件的类型名字，如果当前label内容变化，该role 的功能可以让voiceOver 间隔4s自动去读一下当前label变化的内容，间隔时间目前无法配置
* playSound 点击当前元素激活的时候不会有普通元素激活时候滴的声音
* allowsDirectInteraction 直接像正常元素一样操作，例如开启voiceOver后，激活某个元素的操作需要按两次，设置该role 之后，该元素只需要点一次就可以执行，表现跟没有开启voiceOver场景一致
* startsMedia 阻止VoiceOver的播放，例如 VoiceOver 开启状况下，点击某个元素，VoiceOver 一般状况下会读label内容，如果点击这个元素目的是播放声音，且这个声音比label短，该场景很影响用户听到实际内容的声音
* summary 当应用第一次启动时候会去读，一般用于告诉用户当前环境，启动之后通过导航切换页面不会再去读取
* disabled 禁用掉role

### accessibilityHint={string}

朗读的提示文本。如果设置有 hint，会在组件朗读 role 之后较长的停顿之后朗读出。用户可以在 iOS 中选择不朗读提示。

### 朗读顺序

组件获得焦点后，会按照以下顺序读出内容：

1. label
2. role
3. hint

## 开启 VoiceOver 测试

可以通过以下路径找到 VoiceOver 的开关：「设置」 -> 「通用」 -> 「辅助功能」 -> 「视觉 - VoiceOver」。

<img src="https://user-images.githubusercontent.com/677114/35663903-9e27cc54-075a-11e8-86ef-d62447d762d9.png" width="375">

