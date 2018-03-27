import {createElement, Component, findDOMNode, PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import TouchableHighlight from 'rax-touchable';
import {isWeex} from 'universal-env';
import MultiRow from 'rax-multirow';
import Animated from './animation';
import style from './style';

const TABEHEADER_SCTOLLTO = 'tabheaderScrollTo';
const TABEHEADER_SELECT = 'tabheaderSelect';
const TABEHEADER_GOTOP = 'tabheaderGoTop';
const DROPDOWN_ROW_HEIGHT = 80;
const WINDOWWIDTH = 750;


class DropDown extends Component {
  static contextTypes = {
    tabheader: PropTypes.object
  };

  constructor(props) {
    super(props);
    let itemNum = this.props.dataSource ? this.props.dataSource.length : 0;
    let cols = this.props.dropDownCols;
    this.dropDownHeight = Math.ceil(itemNum / cols) * DROPDOWN_ROW_HEIGHT;
    this.state = {
      weexGridTop: -1000,
      weexGridLeft: -1000,
      weexGridPosition: 'fixed',
      weexGridHeight: 0,
      selected: props.selected
    };
  }

  componentWillMount() {
    let tabheader = this.context.tabheader;
    if (tabheader && tabheader.on) {
      tabheader.on(TABEHEADER_SELECT, (index) => {
        this.setState({
          selected: index,
        });
      });
    }
  }

  changeGrid = () => {
    if (!this.gridOpen) {
      if (isWeex) {
        this.openPop();
      } else {
        this.openDrop();
      }
    } else {
      if (isWeex) {
        this.closePop();
      } else {
        this.closeDrop();
      }
    }
    this.gridOpen = !this.gridOpen;
  }

  openPop = () => {
    const tabheader = this.context.tabheader;
    if (tabheader) {
      tabheader.emit(TABEHEADER_GOTOP);
    }

    const icon = findDOMNode(this.refs.icon);
    Animated.rotate(icon, 180);
    let dropDownHeight = parseInt(this.dropDownHeight) / 750 * WINDOWWIDTH;
    const dropMultiRow = findDOMNode(this.refs.dropMultiRow);
    Animated.height(dropMultiRow, dropDownHeight);

    this.state.weexGridTop = 0;
    this.state.weexGridLeft = 0;
    this.state.weexGridPosition = 'fixed';
    this.state.weexGridHeight = 2000;
    this.setState(this.state);
  }

  closePop = () => {
    const icon = findDOMNode(this.refs.icon);
    Animated.rotate(icon, 360);
    const dropMultiRow = findDOMNode(this.refs.dropMultiRow);
    Animated.height(dropMultiRow, 0);

    if (!this.closePopIndex) {
      this.closePopIndex = 1;
    }
    this.closePopIndex++;

    this.state.weexGridTop = -1000 - this.closePopIndex; // fix for android
    this.state.weexGridLeft = -1000 - this.closePopIndex;
    this.state.weexGridPosition = 'relative';
    this.state.weexGridHeight = 0;
    this.setState(this.state);
  }

  openDrop = () => {
    let dropDownHeight = parseInt(this.dropDownHeight) / 750 * WINDOWWIDTH;
    const icon = findDOMNode(this.refs.icon);
    Animated.rotate(icon, 180);
    const dropMultiRow = findDOMNode(this.refs.dropMultiRow);
    Animated.height(dropMultiRow, dropDownHeight);
  }

  closeDrop = () => {
    const icon = findDOMNode(this.refs.icon);
    Animated.rotate(icon, 360);
    const dropMultiRow = findDOMNode(this.refs.dropMultiRow);
    Animated.height(dropMultiRow, 0);
  }

  gridItemSelect = (index) => {
    this.changeGrid();

    const tabheader = this.context.tabheader;

    if (this.animType != 'noanim') {
      tabheader.emit(TABEHEADER_SCTOLLTO, {
        x: parseInt(this.props.itemWidth) * index
      });
    }
    if (this.selected != index) {
      this.props.onSelect && this.props.onSelect(index);
    }
    if (tabheader) {
      tabheader.emit(TABEHEADER_SELECT, index);
    }
  }

  renderGridItemFun = (item, index) => {
    if (item == '') {
      return <View style={style.dropBoxTtem} />;
    } else if (this.state.selected == index) {
      return <TouchableHighlight
        onPress={() => {
          this.gridItemSelect(index);
        }}
        style={style.dropBoxTtem}>
        <Text style={style.dropBoxSelectText} >{item}</Text>
      </TouchableHighlight>;
    } else {
      return <TouchableHighlight
        onPress={() => {
          this.gridItemSelect(index);
        }}
        style={style.dropBoxTtem}>
        <Text style={style.dropBoxText} >{item}</Text>
      </TouchableHighlight>;
    }
  }

  renderGridFun = (dropData) => {
    let weexGridStyle = {};
    let weexGridMaskerStyle = {};

    if (isWeex) {
      weexGridStyle.top = this.state.weexGridTop + 80;
      weexGridStyle.left = this.state.weexGridLeft;
      weexGridStyle.position = this.state.weexGridPosition;
      weexGridStyle.height = parseInt(this.dropDownHeight) / 750 * WINDOWWIDTH;
      weexGridMaskerStyle.top = this.state.weexGridTop;
      weexGridMaskerStyle.left = this.state.weexGridLeft;
      weexGridMaskerStyle.position = this.state.weexGridPosition;
      weexGridMaskerStyle.height = this.state.weexGridHeight;
    }

    return (
      <View id="grid" ref="grid" style={style.drop}>
        <TouchableHighlight style={style.dropBtn} onPress={this.changeGrid}>
          <Image
            ref="icon"
            source={{uri: '//gw.alicdn.com/tps/TB1H03wKVXXXXX_aXXXXXXXXXXX-40-40.png'}}
            style={{
              width: '40rem',
              height: '40rem',
              position: 'absolute',
              top: '20rem',
              left: '15rem',
            }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            backgroundColor: '#000000',
            opacity: 0.1,
            width: 750,
            zIndex: 100,
            ...weexGridMaskerStyle
          }}
          onPress={this.changeGrid} />
        <View
          ref="dropMultiRow"
          style={{
            backgroundColor: '#ffffff',
            position: 'absolute',
            top: 81,
            right: 0,
            width: 750,
            height: 0,
            paddingRight: 100,
            overflow: 'hidden',
            zIndex: 100,
            ...weexGridStyle
          }}>
          <MultiRow dataSource={dropData} cells={this.props.dropDownCols} renderCell={this.renderGridItemFun} />
        </View>
      </View>
    );
  }

  render() {
    let {
      styleType,
      dropDownCols,
      dataSource,
    } = this.props;

    let dropData = [];
    let placeholderNum = dataSource.length % dropDownCols;
    if (placeholderNum) {
      placeholderNum = dropDownCols - placeholderNum;
    }
    for (let i = 0; i < dataSource.length + placeholderNum; i++) {
      if (i < dataSource.length) {
        dropData.push(dataSource[i]);
      } else {
        dropData.push('');
      }
    }

    if (styleType == 'dropdown') {
      return this.renderGridFun(dropData);
    } else {
      return null;
    }
  }
}

DropDown.defaultProps = {
};

export default DropDown;
