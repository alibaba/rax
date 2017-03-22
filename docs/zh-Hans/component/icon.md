# Icon 图标

图标组件，实现了 W3C 标准的 IconFont 接口。

## 安装

```bash
$ npm install rax-icon --save
```

## 引入

```jsx
import Icon, {createIconSet} from 'rax-icon';
```

## 初始化组件

用 iconfont：

```jsx
<Icon style={{width: 100, height: 100}} fontFamily="iconfont" source={{uri: '//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf', codePoint: '\uE60f'}}/>
```

用图片：

```jsx
<Icon style={{width: 100, height: 100}} source={{uri: icon}}/>
```

createIconSet 方式：

```jsx
const IconFont = createIconSet({ hello: '\ue60f' }, 'iconfont', 'http://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
<IconFont name={'hello'}/>
```

## API 说明

### 属性

| 名称               | 类型     | 默认值  | 描述                                     |
| :--------------- | :----- | :--- | :------------------------------------- |
| source.uri       | String | ''   | 图片型icon的url，如果出现，则font和codePoint两个属性失效 |
| fontFamily       | String | ''   | iconfont的字体                            |
| source.codePoint | String | ''   | iconfont的码点                            |

### 方法

- **IconComponent createIconSet(Object map, String name, String url);**

参数说明

- map：对象，描述字符集映射，eg：`{ hello: '\ue60f' }`
- name：字体名称，通常是 `'iconfont'`
- url: 字体文件的 URL

IconComponent 属性说明

| 名称        | 类型     | 默认值  | 描述           |
| :-------- | :----- | :--- | :----------- |
| name      | String | ''   | 字符的名称        |
| codePoint | String | ''   | iconfont 的码点 |

## 基本示例

```jsx
// demo
import { createElement, render, Component } from 'rax';
import View from 'rax-view';
import Icon, {createIconSet} from 'rax-icon';

const IconFont1 = createIconSet({}, 'iconfont', 'https://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
const IconFont2 = createIconSet({
    hello: '\uE60f'
  }, 'iconfont', 'https://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
const icon = 'https://gw.alicdn.com/tfs/TB1KRRuQXXXXXbwapXXXXXXXXXX-200-200.png';

class Demo extends Component {
  render() {
    return (
      <View>
        <Icon source={{uri: icon}}/>
        <Icon fontFamily="iconfont" source={{uri: 'https://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf', codePoint: '\uE60f'}}/>
        <IconFont1 codePoint={'\uE60f'}/>
        <IconFont2 name={'hello'}/>
      </View>
    );
  }
}

render(<Demo />);
```

