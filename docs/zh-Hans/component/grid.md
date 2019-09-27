# Grid 栅格布局

面向移动端页面的简单布局标签，提供外部行布局容器标签 Row，列 Col，多行多列布局参考 [MultiRow ](/component/multirow)。

![](https://gw.alicdn.com/tfs/TB1fQZfRVXXXXcZXpXXXXXXXXXX-260-157.jpg)

## 安装

```bash
$ npm install rax-grid --save
```

## 引用

```jsx
import { Row, Col } from 'rax-grid';
```

## 默认等宽度布局

等宽布局支持任意多列

等宽3列布局：

![](https://img.alicdn.com/tps/TB17t9SKVXXXXXnapXXXXXXXXXX-415-116.png)

```jsx
<Row>
  <Col>列1</Col>
  <Col>列2</Col>
  <Col>列3</Col>
</Row>
```

## 等宽两列布局

![](https://img.alicdn.com/tps/TB1Dk9OKVXXXXciapXXXXXXXXXX-415-115.png)

```jsx
<Row>
  <Col>列1</Col>
  <Col>列2</Col>
</Row>
```

## 自定义列宽度

下面示例中第一列占整个容器的 1/3，第二列占整个容器的 2/3

![](https://img.alicdn.com/tps/TB1LL5TKVXXXXcHaXXXXXXXXXXX-415-113.png)

```jsx
const styles = {
  col1: {
    flex: 1
  },
  col2: {
    flex: 2
  },
}
<Row>
  <Col style={styles.col1}>flex: 1</Col>
  <Col style={styles.col2}>flex: 2</Col>
</Row>
```

## 基本示例

```jsx
// demo
import { createElement, render, Component } from 'rax';
import { Row, Col } from 'rax-grid';

const styles = {
  container: {
    width: 750
  },
  row: {
    height: 400
  }
};

class App extends Component {
  render() {
    return (
      <Row style={[styles.container, styles.row]}>
        <Col style={{flex: 1, backgroundColor: 'red'}}>Col1</Col>
        <Col style={{flex: 1, backgroundColor: 'green'}}>Col2</Col>
        <Col style={{flex: 1, backgroundColor: 'blue'}}>Col3</Col>
      </Row>
    );
  }
}

render(<App />);
```

```jsx
//demo
import { createElement, render, Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import {Row, Col} from 'rax-grid';

class App extends Component {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <Row>
            <Col style={styles.bg1}>
              <Text style={styles.text}>Col1</Text>
            </Col>
            <Col style={styles.bg2}>
              <Text style={styles.text}>Col2</Text>
            </Col>
            <Col style={styles.bg3}>
              <Text style={styles.text}>Col3</Text>
            </Col>
          </Row>
        </View>

        <View style={styles.container}>
          <Row>
            <Col style={styles.bg1}>
              <Text style={styles.text}>Col1</Text>
            </Col>
            <Col style={styles.bg3}>
              <Text style={styles.text}>Col2</Text>
            </Col>
          </Row>
        </View>
        <View style={styles.container}>
          <Row>
            <Col style={styles.bg1}>
              <Text style={styles.text}>Col1</Text>
            </Col>
            <Col>
              <Row>
                <Col style={styles.bg2}>
                  <Text style={styles.text}>child Col</Text>
                </Col>
                <Col style={styles.bg3}>
                  <Text style={styles.text}>child Col</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </View>

      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20
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
  text: {
    textAlign: 'center',
  },
  bg1: {
    backgroundColor: '#cccccc',
  },
  bg2: {
    backgroundColor: '#dddddd',
  },
  bg3: {
    backgroundColor: '#ededed',
  }
};


render(<App />);
```
