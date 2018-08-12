import {createElement, render, Component} from 'rax';
import {Row, Col} from 'rax-grid';
import View from 'rax-view';

class List extends Component {
  render() {
    return <View>{this.getContent()}</View>;
  }

  getContent() {
    let props = this.props,
      list = props.dataSource,
      count = props.cells,
      renderCell = props.renderCell;

    let grids = [];

    let gridDataArr = [];
    for (let i = 0; i < list.length; i++) {
      let index = Math.floor(i / count);
      if (i % count == 0) {
        gridDataArr[index] = [];
      }
      gridDataArr[index].push(<Col style={props.colStyle}>{renderCell(list[i], i)}</Col>);
      if (i % count == 0 && i != 0) {
        grids.push(<Row style={props.rowStyle}>{gridDataArr[index - 1]}</Row>);
      }
      if (i == list.length - 1) {
        grids.push(<Row style={props.rowStyle}>{gridDataArr[index]}</Row>);
      }
    };

    return <View>{grids}</View>;
  }
}

List.defaultProps = {
  colStyle: {},
  rowStyle: {},
  cells: 1,
  dataSource: [],
  renderCell: () => {}
};

export default List;
