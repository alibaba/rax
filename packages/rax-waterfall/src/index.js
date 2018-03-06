import {PureComponent, Component, createElement, cloneElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';
import View from 'rax-view';
import ScrollView from 'rax-scrollview';
import RefreshControl from 'rax-refreshcontrol';

class Header extends PureComponent {

  render() {
    if (isWeex) {
      return <header {...this.props} append="tree" />;
    } else {
      return <View {...this.props} />;
    }
  }
}

class WebFall extends PureComponent {

  calcHeightSum = (arr) => {
    let sum = 0;
    arr && arr.forEach(item => {
      sum += item;
    });
    return sum;
  };

  render() {
    const {renderItem = () => {}, dataSource, columnCount = 1} = this.props;
    let columns = [];
    let moduleHeights = [];

    for (let i = 0; i < columnCount; i++) {
      columns[i] = [];
      moduleHeights[i] = 0;
    }

    dataSource && dataSource.forEach((item, i) => {
      let targetColumnIndex = 0;
      let minHeight = moduleHeights[0];

      for (let j = 0; j < columnCount; j++) {
        if (moduleHeights[j] < minHeight) {
          minHeight = moduleHeights[j];
          targetColumnIndex = j;
        }
      }

      moduleHeights[targetColumnIndex] += item.height;
      columns[targetColumnIndex].push(item);
    });

    return (<View style={styles.waterfallWrap}>
      {columns.map((column, index) => {
        return (<View key={'column' + index} style={styles.waterfallColumn}>
          {column.map((item, j) => {
            return renderItem(item, 'c_' + index + j);
          })}
        </View>);
      })}
    </View>);
  }
}

class Waterfall extends Component {

  static propTypes = {

    /**
     * 瀑布流数组，需要传入模块高度（必填）
     */
    dataSource: PropTypes.array.isRequired,

    /**
     * 渲染每项的模板（必填）
     */
    renderItem: PropTypes.func.isRequired,

    /**
     * 渲染 header 部分
     */
    renderHeader: PropTypes.func,

    /**
     * 渲染 footer 部分
     */
    renderFooter: PropTypes.func,

    /**
     * 列宽
     */
    columnWidth: PropTypes.number,

    /**
     * 列数
     */
    columnCount: PropTypes.number,

    /**
     * 列间距
     */
    columnGap: PropTypes.number,

    /**
     * 滚动到底部触发事件
     */
    onEndReached: PropTypes.func,

    /**
     * 触发懒加载距离
     */
    onEndReachedThreshold: PropTypes.number

  };

  loadmoreretry = 1;

  constructor(props) {
    super(props);
    this.state = {
      loadmoreretry: 0,
    };
  }

  resetScroll = () => {
    if (isWeex) {
      this.setState({
        loadmoreretry: this.loadmoreretry++,
      });
    } else {
      this.refs.scrollview.resetScroll();
    }
  }

  render() {
    let props = this.props;
    let {
      renderHeader,
      renderFooter,
      columnWidth = 750,
      columnCount = 1,
      columnGap = 0,
      dataSource,
      renderItem = () => {}
    } = props;

    let header = typeof renderHeader == 'function' ? renderHeader() : null;
    let footer = typeof renderFooter == 'function' ? renderFooter() : null;
    header = Array.isArray(header) ? header : [header];
    footer = Array.isArray(footer) ? footer : [footer];

    let cells = header.map((child, index) => {
      if (child) {
        if (child.type != RefreshControl && child.type != Header) {
          return <Header>{child}</Header>;
        } else {
          return cloneElement(child, {});
        }
      }
    });

    if (isWeex) {
      dataSource && dataSource.forEach((item, index) => {
        cells.push(<cell>{renderItem(item, index)}</cell>);
      });
    } else {
      cells = cells.concat(<WebFall {...props} />);
    }

    cells = cells.concat(footer.map((child, index) => {
      if (child) {
        if (child.type != Header) {
          return <Header>{child}</Header>;
        } else {
          return cloneElement(child, {});
        }
      }
    }));

    if (isWeex) {
      return (<waterfall
        style={{width: 750}}
        {...props}
        onLoadmore={props.onEndReached}
        loadmoreoffset={props.onEndReachedThreshold}
        loadmoreretry={this.state.loadmoreretry}
        >
          {cells}
        </waterfall>);
    } else {
      styles.waterfallColumn.width = columnWidth;
      return (<ScrollView {...props} ref="scrollview">
        {cells}
      </ScrollView>);
    }
  }
}

let styles = {
  waterfallWrap: {
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waterfallColumn: {
  },
};

Waterfall.Header = Header;

export default Waterfall;
