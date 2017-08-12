import {createElement, render, Component, PropTypes} from 'rax';
import {Row, Col} from 'rax-grid';
import View from 'rax-view';

class List extends Component {

  static propTypes = {

    /**
     * 模板方法（必需）
     */
    renderCell: PropTypes.func.isRequired,

    /**
     * 需要渲染的数据，与 renderCell 配合使用（必需）
     */
    dataSource: PropTypes.array.isRequired,

    /**
     * 每行包含几列，默认1列（必需）
     */
    cells: PropTypes.number.isRequired

  };

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
