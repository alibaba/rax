# Table

[![npm](https://img.shields.io/npm/v/rax-table.svg)](https://www.npmjs.com/package/rax-table)

## Install

```bash
$ npm install rax-table --save
```

## Usage

```jsx
import Table from 'rax-table';

const columns = [
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    width: 210
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 280
  },
  {
    title: 'Age',
    dataIndex: 'age'
  },
  {
    title: 'Sex',
    dataIndex: 'sex'
  },
];

const dataSource = [];

for (let i = 0; i < 100; i++) {
  dataSource.push({
    mobile: '12345678',
    sex: 'male',
    name: 'Jack',
    age: 20
  });
}

class TableDemo extends Component {
  render() {
    return (
      <Table width={750} height={640} columns={columns} dataSource={dataSource} />
    );
  }
}
```
