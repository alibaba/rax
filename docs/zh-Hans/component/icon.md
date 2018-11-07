# Icon 图标

图标组件，实现了 W3C 标准的 IconFont 接口。

![](https://gw.alicdn.com/tfs/TB17w2MRVXXXXcUaXXXXXXXXXXX-261-160.jpg)


## 安装

```bash
$ npm install rax-icon --save
```

## 引用

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
const IconFont = createIconSet({ hello: '\ue60f' }, 'iconfont', '//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
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

```jsx
//demo
import { createElement, render, Component } from 'rax';
import View from 'rax-view';
import Icon, {createIconSet} from 'rax-icon';

let iconImage = 'data:image/png;base64,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';
let iconfont = '//at.alicdn.com/t/font_lf2urtr9li110pb9.ttf';
let NewImage = createIconSet({
  name1: '\uE9f2',
  name2: '\uE65B',
  name3: '\uE782',
  name4: '\uE669',
  name5: '\uE66D',
}, 'iconfont', iconfont);

class App extends Component {
  render() {
    return (
      <View style={styles.root}>

        <View style={styles.container}>
          <View style={styles.iconBox}>
            <Icon style={styles.icon} source={{uri: iconImage}} />
          </View>
        </View>

        <View style={styles.container}>
          <Icon fontFamily="iconfont" source={{uri: iconfont, codePoint: '\uE603'}} />
        </View>

        <View style={styles.container}>
          <View style={styles.iconBox3}>
            <NewImage name={'name1'} />
            <NewImage name={'name2'} />
            <NewImage name={'name3'} />
            <NewImage name={'name4'} />
            <NewImage name={'name5'} />
          </View>
        </View>

      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20,
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  iconBox: {
    backgroundColor: '#dddddd',
  },
  icon: {
    width: 65,
    height: 50,
  }
};
render(<App />);
```
