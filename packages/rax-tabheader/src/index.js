import {createElement, Component, findDOMNode, PropTypes} from 'rax';
import Container from './Container';
import DropDown from './DropDown';
import ItemList from './ItemList';
import tools from './tools';
import {mixinEmitter} from './Emitter';

const THCONTAINER_REF = 'tabheaderContainer';

class TabHeader extends Component {

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
