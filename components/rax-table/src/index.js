import {Component, createElement} from 'rax';
import ScrollView from 'rax-scrollview';
import Text from 'rax-text';
import View from 'rax-view';

const DEFAULT_HEIGHT = 480;

class Table extends Component {
  static defaultProps = {
    columns: [],
    dataSource: [],
    columnWidth: undefined,
    renderCell: undefined,
    height: DEFAULT_HEIGHT,
  };

  _renderCell(cellData, col) {
    let width = col.width || this.props.columnWidth;
    let style = {};
    if (width) {
      style.width = width;
    } else {
      style.flex = 1;
    }

    return (
      <View key={col.dataIndex} style={[styles.tableCell, style]}>
        <Text>{cellData}</Text>
      </View>
    );
  }

  _renderHeader() {
    let { columns, columnWidth } = this.props;
    return columns.map((col, index) => {
      let width = col.width || columnWidth;
      let style = {};
      if (width) {
        style.width = width;
      } else {
        style.flex = 1;
      }

      return (
        <View key={index} style={[styles.tableHeaderCell, style]}>
          <Text>{col.title}</Text>
        </View>
      );
    });
  }

  _renderRow(rowData, index) {
    let { columns, renderCell } = this.props;
    if (!renderCell) {
      renderCell = this._renderCell.bind(this);
    }
    return (
      <View key={index} style={styles.tableRow}>
        {columns.map(col => renderCell(rowData[col.dataIndex], col))}
      </View>
    );
  }

  render() {
    let { width, height, style, dataSource } = this.props;
    return (
      <ScrollView
        style={[style, {width, height}]}
        contentContainerStyle={[style, {width, height}]}
        horizontal={true}>
        <View style={styles.tableBody}>
          <View style={styles.tableHeader}>
            { this._renderHeader() }
          </View>
          <ScrollView
            style={styles.tableBody}>
            { dataSource.map((rowData, index) => this._renderRow(rowData, index)) }
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  tableHeader: {
    flexDirection: 'row',
  },
  tableHeaderCell: {
    minHeight: 30,
    backgroundColor: '#efefef',
    borderRightWidth: 1,
    borderRightColor: '#dfdfdf',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  tableCell: {
    minHeight: 50,
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: '#dfdfdf',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Table;
