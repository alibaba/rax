# Tabbar的功能是什么

Tabbar是一种辅助实现多个页面之间，进行当前页内切换的工具条；在切换过程中Tabbar保持无刷新。

## 什么时候使用Tabbar

    1. 业务中包含tabbar交互
    2. 业务正在迁移Rax&Weex

##怎么接入&接入API

### 第一步：新建一个bundle

    1. 该bundle中包含一个tabbar和多个`<embed>`；
    2. `<embed>`为tabbar下的子页面，类似iframe；
    3. 该bundle提供多个`<embed>`之间的切换功能，达到当前页切换的效果；

引入代码：

```jsx
import {createElement, Component, render} from 'rax';
var Tabbar = require('rax-tabbar');
var RaxEmbed = require('rax-embed');

class Example extends Component {
  render() {
    return (
      <Tabbar
        horizontal={false}
        fixedPlace="top"
        style={styles.bar}>
        <Tabbar.Item
          title="精选"
          icon={{uri: '//gw.alicdn.com/tfs/TB1HVA2OVXXXXb4XXXXXXXXXXXX-48-48.png'}}
          iconStyle={iconStyle}
          style={itemStyle}
          selectedStyle={itemSelectedStyle}
          selected={true}
          onPress={() => {
          }}>
          <RaxEmbed style={styles.content} src="//30.10.204.251:3333/demo/tab1.html" urlParam={{abc: 1111}}/>
        </Tabbar.Item>
        ...more <Tabbar.item>
      </Tabbar>
    );
  }
}

export default Example;
```
### 第二步： 配置Tabbar

Tabbar 为tabbar工具条容器

#### Tabbar 可配置属性
| 属性名称                | 是否必填 | 属性描述                          |
| ------------------- | ---- | ----------------------------- |
| horizontal{boolean} | no   | 是否出现横向滚动条(默认false)            |
| style               | no   | 容器样式                          |
| fixedPlace          | no   | tabbar位置(默认top)可选top 和 bottom |

### 第三步：配置Tabbar.Item 
Tabbar.Item 为tabbar中的，可点击项

#### Tabbar.Item 可配置属性
| 属性名称                     | 是否必填 | 属性描述                                   |
| ------------------------ | ---- | -------------------------------------- |
| style{object}            | no   | 选项样式                                   |
| selectedStyle{object}    | no   | 选项选中时样式                                |
| title {string}           | yes  | 选项文本                                   |
| icon {{uri: 'xxxx.png'}} | no   | icon图片                                 |
| slectedIcon              | no   | 选中状态icon图片                             |
| iconStyle {object}       | no   | icon图片的样式                              |
| badge{string}            | no   | 角标(开发中...)                             |
| onPress{Function}        | no   | 选项点击回调(this.props.onPress(this.props)) |

#### style属性呈递给title的属性名单：
| 属性名称       | 是否必填 | 属性描述 |
| ---------- | ---- | ---- |
| fontSize   | no   | 文本字体 |
| color      | no   | 字体颜色 |
| lineHeight | no   | 字体行高 |

### 第四步：配置子页面中的Tabbar
子页面中tabbar只需要tabbar工具条即可，无需embed

#### 页面布局需要调整为如下结构

```jsx
<View style={{position: 'absolute', display: 'flex', top: 0, right: 0, left: 0}}>
	<Tabbar /> <!-- 以下为明细 -->
    <View style={{display: 'flex', flex: 1}}>
    	<View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}>
		    <!-- 主内容区 -->
		</View>
    </View>
<View>
```

引入Tabbar代码：

```jsx
<Tabbar
  horizontal={false}
  fixedPlace="top"
  style={styles.bar}>
  <Tabbar.Item
    title="精选"
    icon={{uri: '//gw.alicdn.com/tfs/TB1HVA2OVXXXXb4XXXXXXXXXXXX-48-48.png'}}
    iconStyle={iconStyle}
    style={itemStyle}
    selectedStyle={itemSelectedStyle}
    selected={true}
    onPress={() => {
    }}>
    {/* <RaxEmbed style={styles.content} src="//30.10.204.251:3333/demo/tab1.html" urlParam={{abc: 1111}}/> */}
  </Tabbar.Item>
  <Tabbar.item>
  	{/*更多项*/}
  </Tabbar.item>
</Tabbar>
```


## 降级策略介绍
可降级类型分为三种

    1. `<embed>`容器页面，全面降级
    2. `<embed>` src指定的页面降级
    3. 页面普通降级（非`<embed>`方式渲染）
