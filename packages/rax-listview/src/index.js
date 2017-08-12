import {createElement, Component} from 'rax';
import {isWeex} from 'universal-env';
import View from 'rax-view';
import RecyclerView from 'rax-recyclerview';

const SCROLLVIEW_REF = 'scrollview';

class ListView extends Component {

  
    static propTypes = {
      
      /**
       * 模板方法（必需）
       */
      renderRow: PropTypes.func.isRequired,
    
      /**
       * 需要渲染的数据，与 renderRow 配合使用（必需）
       */
      dataSource: PropTypes.array.isRequired,
    
      /**
       * 滚动到底部触发事件，将修改后的数据付给 data
       */
      onEndReached: PropTypes.func,
    
      /**
       * 距离多少开始加载下一屏，数字单位默认 rem
       */
      onEndReachedThreshold: PropTypes.number,
    
      /**
       * 滚动时触发的事件，返回当前滚动的水平垂直距离
       */
      onScroll: PropTypes.func,
    
      /**
       * 列表头部 需返回要渲染的标签
       */
      renderHeader: PropTypes.func,
    
      /**
       * 列表底部 需返回要渲染的标签 (可以在此处实现 loading 菊花效果)
       */
      renderFooter: PropTypes.func,
    
      /**
       * 返回 listview 的外层包裹容器
       */
      renderScrollComponent: PropTypes.func
    
    };
  

  static defaultProps = {
    renderScrollComponent: props => <RecyclerView {...props} />,
    dataSource: [],
  };

  scrollTo = (options) => {
    if (this.refs[SCROLLVIEW_REF]) {
      this.refs[SCROLLVIEW_REF].scrollTo(options);
    }
  }

  resetScroll = () => {
    if (this.refs[SCROLLVIEW_REF]) {
      this.refs[SCROLLVIEW_REF].resetScroll();
    }
  }

  render() {
    let {
      renderScrollComponent,
      renderHeader,
      renderFooter,
      renderRow,
      dataSource,
    } = this.props;

    let header = typeof renderHeader == 'function' ? renderHeader() : null;
    let footer = typeof renderFooter == 'function' ? renderFooter() : null;
    let body = dataSource.map((i, index) => {
      return renderRow(i, index);
    });

    let props = {
      ...this.props,
      ...{
        ref: SCROLLVIEW_REF,
        children: [].concat(header, body, footer),
        _autoWrapCell: true,
      },
    };

    return renderScrollComponent(props);
  }
}

export default ListView;
