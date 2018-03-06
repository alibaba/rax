import {createElement, Component, findDOMNode, PropTypes} from 'rax';
import Container from './Container';
import DropDown from './DropDown';
import ItemList from './ItemList';
import tools from './tools';
import {mixinEmitter} from './Emitter';

const THCONTAINER_REF = 'tabheaderContainer';

class TabHeader extends Component {

  static propTypes = {

    /**
     * tab 选项的数据（必填）
     */
    dataSource: PropTypes.array.isRequired,

    /**
     * 渲染每项的模板（必填）
     */
    renderItem: PropTypes.func.isRequired,

    /**
     * 300
     */
    itemWidth: PropTypes.string,

    /**
     * 选中导航项的模版
     */
    renderSelect: PropTypes.func,

    /**
     * 选中某一 tab 事件
     */
    onSelect: PropTypes.func,

    /**
     * 选中的导航项，从0开始
     */
    selected: PropTypes.number,

    /**
     * 导航默认展现样式
     */
    type: PropTypes.string,

    /**
     * 导航默认展现样式
     */
    containerStyle: PropTypes.object,

    /**
     * 单个 tab 展现样式
     */
    itemStyle: PropTypes.object,

    /**
     * 单个选中 tab 展现样式
     */
    itemSelectedStyle: PropTypes.object,

    /**
     * 滑动色块展现样式
     */
    animBuoyStyle: PropTypes.object,

    /**
     * 下拉列表的列数
     */
    dropDownCols: PropTypes.number

  };

  static childContextTypes = {
    tabheader: PropTypes.object,
  };

  getChildContext() {
    return {
      tabheader: this,
    };
  }

  select = (index) => {
    this.refs[THCONTAINER_REF].select(index);
  }

  selectInternal = (index) => {
    this.refs[THCONTAINER_REF].selectInternal(index);
  }

  scrollTo = (options) => {
    this.refs[THCONTAINER_REF].scrollTo(options);
  }

  componentDidMount() {
    tools.initWebStyle();
  }

  render() {
    let typeArr = (this.props.type || 'default-noanim-scroll').toLowerCase().split('-');
    let styleType = typeArr[0];
    let animType = typeArr[1];
    let scrollType = typeArr[2];

    let {
      dropDownCols
    } = this.props;

    return (
      <Container
        ref={THCONTAINER_REF}
        itemWidth={this.props.itemWidth}
        onSelect={this.props.onSelect}
      >
        <DropDown
          {...this.props}
          dropDownCols={dropDownCols}
          styleType={styleType} />
        <ItemList
          {...this.props}
          styleType={styleType}
          scrollType={scrollType}
          animType={animType} />
      </Container>
    );
  }
}

TabHeader.defaultProps = {
};

mixinEmitter(TabHeader);

export default TabHeader;
