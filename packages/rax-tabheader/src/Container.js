import {createElement, findDOMNode, Component, PropTypes} from 'rax';
import View from 'rax-view';

const TABEHEADER_SCTOLLTO = 'tabheaderScrollTo';
const TABEHEADER_SELECT = 'tabheaderSelect';
const TABEHEADER_GOTOP = 'tabheaderGoTop';
const CONTAINER_REF = 'container';

class Container extends Component {

  static contextTypes = {
    tabheader: PropTypes.object
  };

  componentWillMount() {
    let tabheader = this.context.tabheader;
    if (tabheader && tabheader.on) {
      tabheader.on(TABEHEADER_GOTOP, () => {
        let dom = __weex_require__('@weex-module/dom');
        dom.scrollToElement(findDOMNode(this.refs[CONTAINER_REF]), {offset: 0});
      });
    }
  }

  select = (index, isPress) => {
    if (this.selected != index) {
      this.props.onSelect && this.props.onSelect(index);
    }
    this.selectInternal(index);
  }

  selectInternal = (index) => {
    const tabheader = this.context.tabheader;
    if (this.animType != 'noanim') {
      this.scrollTo({
        x: parseInt(this.props.itemWidth) * index
      });
    }
    if (tabheader) {
      tabheader.emit(TABEHEADER_SELECT, index);
    }
  }

  scrollTo = (options) => {
    const tabheader = this.context.tabheader;

    if (tabheader) {
      tabheader.emit(TABEHEADER_SCTOLLTO, options);
    }
  }

  render() {
    return <View ref={CONTAINER_REF} {...this.props} />;
  }
}


export default Container;
