import {PureComponent, Component, createElement, findDOMNode, PropTypes} from 'rax';
import {isWeex} from 'universal-env';
import View from 'rax-view';
import ScrollView from 'rax-scrollview';
import RefreshControl from 'rax-refreshcontrol';

const DEFAULT_END_REACHED_THRESHOLD = 500;

class Cell extends PureComponent {
  static contextTypes = {
    isInARecyclerView: PropTypes.bool
  };

  render() {
    if (isWeex && this.context.isInARecyclerView) {
      return <cell {...this.props} append="tree" />;
    } else {
      return <View {...this.props} />;
    }
  }
}

class Header extends PureComponent {
  static contextTypes = {
    isInARecyclerView: PropTypes.bool
  };

  render() {
    if (isWeex && this.context.isInARecyclerView) {
      return <header {...this.props} append="tree" />;
    } else {
      return <View {...this.props} />;
    }
  }
}

class RecyclerView extends Component {

  static defaultProps = {
    onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
  };

  static childContextTypes = {
    isInARecyclerView: PropTypes.bool
  };

  loadmoreretry = 1;

  constructor(props) {
    super(props);
    this.state = {
      loadmoreretry: 0,
    };
  }

  getChildContext() {
    return {
      isInARecyclerView: true
    };
  }

  handleScroll = (e) => {
    e.nativeEvent = {
      contentOffset: {
        // HACK: weex scroll event value is opposite of web
        x: - e.contentOffset.x,
        y: - e.contentOffset.y
      }
    };
    this.props.onScroll(e);
  }

  resetScroll = () => {
    if (isWeex) {
      this.setState({
        loadmoreretry: this.loadmoreretry++, // for weex 0.9-
      });
      this.refs.list.resetLoadmore && this.refs.list.resetLoadmore(); // for weex 0.9+
    } else {
      this.refs.scrollview.resetScroll();
    }
  }

  scrollTo = (options) => {
    let x = parseInt(options.x);
    let y = parseInt(options.y);

    if (isWeex) {
      let dom = __weex_require__('@weex-module/dom');
      let firstNode = findDOMNode(this.refs.firstNodePlaceholder);
      dom.scrollToElement(firstNode.ref, {
        offset: x || y || 0,
        animated: options && typeof options.animated !== 'undefined' ? options.animated : true
      });
    } else {
      this.refs.scrollview.scrollTo(options);
    }
  }

  render() {
    let props = this.props;
    if (isWeex) {
      let children = props.children;
      if (!Array.isArray(children)) {
        children = [children];
      }

      let cells = children.map((child, index) => {
        if (child) {
          let hasOnRefresh = child.props && typeof child.props.onRefresh == 'function';
          if (props._autoWrapCell && child.type != RefreshControl && child.type != Header && !hasOnRefresh) {
            return <Cell>{child}</Cell>;
          } else {
            return child;
          }
        } else {
          return <Cell />;
        }
      });

      // add firstNodePlaceholder after refreshcontrol
      let addIndex = cells[0].type == Cell || cells[0].type == Header ? 0 : 1;
      cells && cells.length && cells.splice(addIndex, 0, <Cell ref="firstNodePlaceholder" />);

      return (
        <list
          {...props}
          ref="list"
          onLoadmore={props.onEndReached}
          onScroll={props.onScroll ? this.handleScroll : null}
          loadmoreretry={this.state.loadmoreretry}
          loadmoreoffset={props.onEndReachedThreshold}
        >
          {cells}
        </list>
      );
    } else {
      return (
        <ScrollView {...props} ref="scrollview" />
      );
    }
  }
}

RecyclerView.Header = Header;
RecyclerView.Cell = Cell;

export default RecyclerView;
