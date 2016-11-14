import {PureComponent, Component, createElement, cloneElement, findDOMNode, PropTypes} from 'universal-rx';
import {isWeex} from 'universal-env';
import View from './View';
import ScrollView from './ScrollView';
import RefreshControl from './RefreshControl';

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
        if (child) {
          const ref = 'cell' + index;
          if (props._autoWrapCell && child.type != RefreshControl) {
            return <Cell ref={ref}>{child}</Cell>;
          } else {
            return cloneElement(child, {ref});
          }
        } else {
          return null;
        }
      });

      return (
        <list
          id={props.id}
          style={props.style}
          onLoadmore={props.onEndReached}
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
