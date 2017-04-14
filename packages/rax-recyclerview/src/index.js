import {PureComponent, Component, createElement, cloneElement, findDOMNode, PropTypes} from 'rax';
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

  scrollTo = (options) => {
    let x = parseInt(options.x);
    let y = parseInt(options.y);

    if (isWeex) {
      let dom = require('@weex-module/dom');
      let firstCell = findDOMNode(this.refs.cell0);
      dom.scrollToElement(firstCell.ref, {
        offset: x || y || 0
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
        const ref = 'cell' + index;
        if (child) {
          if (props._autoWrapCell && child.type != RefreshControl) {
            return <Cell ref={ref}>{child}</Cell>;
          } else {
            return cloneElement(child, {ref});
          }
        } else {
          return <Cell ref={ref} />;
        }
      });

      return (
        <list
          id={props.id}
          style={props.style}
          onLoadmore={props.onEndReached}
          onScroll={props.onScroll ? this.handleScroll : null}
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
