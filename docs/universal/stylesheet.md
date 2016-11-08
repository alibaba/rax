# rx-style 

被([css in js](https://speakerdeck.com/vjeux/react-css-in-js))鼓舞，Rx样式最佳实践，统一web端和weex端的样式呈现

[ATA文章](http://www.atatech.org/articles/58516)

### Install

```
tnpm i --save @ali/rx-style
```

### Feature

### hairlineWidth

```
a: {
  borderBottomColor: '#bbb',
  borderBottomWidth: StyleSheet.hairlineWidth
}
```

#### 继承

* color
* font
* fontSize
* fontFamily
* fontWeight
* fontStyle
* textAlign

weex环境增加继承，无需在每个text中设置样式

#### 前缀

* borderRadius
* boxShadow
* userSelect
...

增加前缀适配所有浏览器

#### 无需加单位

从此无需有rem，喜欢你也可以加

```
width: 20,
height: 10,
padding: '10rem'
```

#### 高度、宽度增加百分比

```
width: 50%,
height: 100%
```

> 百分比只相对于body

#### 简化颜色写法

支持 weex `#333` 写法

```
color: '#333',
borderColor: '#666',
backgroundColor: '#999'
```

#### 简化weex端样式写法

在weex下，支持使用类似`padding: '3 4 5 6'`的写法

```
padding: '3 4 5',
margin: '2 3 5 6',
border: '1px solid #ccc' // 顺序不能变
```

### Validation

dev 环境下在控制台抛出不合法属性的警告

![控制台警告](http://img.alicdn.com/tfs/TB1o7nUMVXXXXbQXVXXXXXXXXXX-1842-420.png)

### Todo

* 支持css或者less写法
```
let styles = StyleSheet.create`
  .foo {
    color: red;
    background-color: white;
  }
`
```
* media

```
let styles = StyleSheet.create({
  bar: {
   color: 'green'
  },
  '@media screen and (min-width: 800px)': {
    bar: {
      color: 'purple'
    }
  }
});   
```

### No Support

* 伪类、伪元素（行为放在js）
* 动画

### Usage

```
import StyleSheet from '@ali/rx-style';

class Hello extends Component {
  render() {
    return <View style={styles.container}>
      <Text style={styles.container.text}> hello world </Text>
    </View>;
  }
}

let styles = StyleSheet.create({
  container: {
    color: 'red',
    width: '60%',
    border: '1 solid #ccc',
    padding: '2 4 5',
    margin: '4 5',
    borderRadius: '10',

    text: {
      fontSize: 30
    },

  },
});

```
