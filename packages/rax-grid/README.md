# Grid

[![npm](https://img.shields.io/npm/v/rax-grid.svg)](https://www.npmjs.com/package/rax-grid)

Simple layout of the label, providing external layout container label Row, column Col, multi row layout reference [MultiRow](/component/multirow)。

Long list of requirements do not use a large MultiRow components for a unified layout, without a complete large label wrap will be better.


## Install

```bash
$ npm install rax-grid --save
```

## Import

```jsx
import { Row, Col } from 'rax-grid';
```
## Example

### Equal width layout

The 3 column：

![](https://img.alicdn.com/tps/TB17t9SKVXXXXXnapXXXXXXXXXX-415-116.png)

```jsx
<Row>
  <Col>列1</Col>
  <Col>列2</Col>
  <Col>列3</Col>
</Row>
```

The 2 column：

![](https://img.alicdn.com/tps/TB1Dk9OKVXXXXciapXXXXXXXXXX-415-115.png)

```jsx
<Row>
  <Col>列1</Col>
  <Col>列2</Col>
</Row>
```

### Custom column width

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
