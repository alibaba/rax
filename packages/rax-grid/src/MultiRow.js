import {createElement, render, Component} from 'rax';
import Grid from './Grid';
import Col from './Col';

class List extends Component {
  render() {
    return <div>{this.getContent()}</div>;
  }

  getContent() {
    let props = this.props,
      list = props.dataSource,
      count = props.cells,
      renderCell = props.renderCell;

    let grids = [];

    // 当单行数据拆分成嵌套数组
    let gridDataArr = [];
    //  用一次遍历替换两次遍历
    for (let i = 0; i < list.length; i++) {
      let index = Math.floor(i / count);
      if (i % count == 0) {
        gridDataArr[index] = [];
      }
      gridDataArr[index].push(<Col style={props.colStyle}>{renderCell(list[i], i)}</Col>);
      if (i == list.length - 1) {
        grids.push(<Grid style={props.gridStyle}>{gridDataArr[index]}</Grid>);
      }
      if (i % count == 0 && i != 0) {
        grids.push(<Grid style={props.gridStyle}>{gridDataArr[index - 1]}</Grid>);
      }
    };

    return <div>{grids}</div>;
  }
}

List.defaultProps = {
  colStyle: {},
  gridStyle: {},
  cells: 1,
  dataSource: [],
  renderCell: () => {}
};

export default List;
