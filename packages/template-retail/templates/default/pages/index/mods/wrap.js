import { createElement, PropTypes as T, findDOMNode, PureComponent } from 'rax';
import { RecyclerView, ScrollView, View } from 'rax-components';
import { isWeb, isWeex } from 'universal-env';
import config from './config';
import LstFreshControl from '../components/LstRefreshControl';
import { getValue } from './util';

const ensureChildrenArray = (children) => {
  if (!children) return [];

  return (
    Array.isArray(children) ? children : [ children ]
  );
};
const wrapRecyclerCell = (children) =>
  children.map(child => (
    <RecyclerView.Cell>{child}</RecyclerView.Cell>
  ))
;

class FloorShouldChangeWrap extends PureComponent {
  // 确保只更新依赖数据的时候才updata
  shouldComponentUpdate(nextProps) {
    const { updateProps } = this.props;
    const length = (updateProps || []).length;
    for (let i = 0; i < length; i ++) {
      const key = updateProps[i];
      if (nextProps[key] !== this.props[key]) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { Comp, ...others } = this.props;
    return (
      <Comp
        {...others} />
    );
  }
}

export default class FloorWrapper extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.recyclerView = '';
    this.once = false;
    this.webRefresh = this.webRefresh.bind(this);
    this.childrenRender();
  }

  refresh() {
    this._refresh.handleRefresh();
  }

  getFloorItem(item) {
    const TagItem = item.components;
    const dataFromStore = {};
    const propsFromStore = item.propsFromStore;

    if (!TagItem || typeof TagItem === 'string') {
      return null;
    }

    if (propsFromStore) {
      Object.keys(propsFromStore).forEach((key) => {
        let value = propsFromStore[key] || '';
        if (typeof value === 'string') {
          const propsValues = value.split('.');
          dataFromStore[key] = getValue(this.props, propsValues);
        }
      });
    }


    return (
      <FloorShouldChangeWrap
        Comp={TagItem}
        updateProps={Object.keys(propsFromStore || {})}
        {...dataFromStore}
        {...item.otherProps} />
    );
  }

  childrenRender() {
    this.top = [];
    this.bottom = [];
    this.header = null;

    let children = ensureChildrenArray(this.props.children);

    children.forEach((node) => {
      if (node.type === FloorWrapper.Top) {
        this.top = wrapRecyclerCell(ensureChildrenArray(node.props.children));
      }
      if (node.type === FloorWrapper.Bottom) {
        this.bottom = wrapRecyclerCell(ensureChildrenArray(node.props.children));
      }
      if (node.type === FloorWrapper.Header) {
        this.header = (
          <RecyclerView.Header>{node.props.children}</RecyclerView.Header>
        );
      }
    });
  }

  // web下拉加载更多
  webRefresh() {
    if (isWeex) {
      return;
    }
    const { onRefresh } = this.props;
    const refNode = findDOMNode(this.recyclerView);

    if (refNode.scrollTop < -60 && isWeb && !this.once) {
      this.once = true;
      let pixelRatio = document.documentElement.clientWidth / 750;
      onRefresh();
      const y = 160 * pixelRatio + 'px';
      refNode.style.transform = `translate3d(0, ${y}, 0)`;
      setTimeout(() => {
        refNode.style.transform = 'translate3d(0, 0, 0)';
        this.once = false;
      }, 1300);

      refNode.style.transition = 'all 300ms';
      refNode.style.webkitTransition = 'all 300ms';
    }
  }

  render() {
    const { onEndReached, onEndReachedThreshold, style, onRefresh} = this.props;
    const children = config.map(this.getFloorItem);

    return (
      <RecyclerView
        style={style}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onTouchEnd={this.webRefresh}
        ref={(ref) => {
          this.recyclerView = ref;
        }}
        >
        <LstFreshControl onRefresh={onRefresh} />
        {children}
      </RecyclerView>
    );
  }

}

FloorWrapper.propTypes = {
  onEndReached: T.func,
  onEndReachedThreshold: T.number,
  style: T.object,
  children: T.node
};

FloorWrapper.Top = function Top() {
  return null;
};
FloorWrapper.Bottom = function Bottom() {
  return null;
};
FloorWrapper.Header = function Header() {
  return null;
};
