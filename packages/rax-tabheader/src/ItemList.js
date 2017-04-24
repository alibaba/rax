import {createElement, Component, findDOMNode, PropTypes} from 'rax';
import ScrollView from 'rax-scrollview';
import Item from './Item';
import AnimBuoy from './AnimBuoy';
import {Row, Col} from 'rax-grid';
import {isWeex} from 'universal-env';
import styles from './style';

const SCROLLVIEW_REF = 'scrollview';
const TABEHEADER_SCTOLLTO = 'tabheaderScrollTo';
const TABEHEADER_SELECT = 'tabheaderSelect';

class ItemList extends Component {

  static contextTypes = {
    tabheader: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected
    };
  }

  componentWillMount() {
    let tabheader = this.context.tabheader;
    if (tabheader && tabheader.on) {
      tabheader.on(TABEHEADER_SCTOLLTO, (options) => {
        this.scrollTo(options);
      });
      tabheader.on(TABEHEADER_SELECT, (index) => {
        this.setState({
          selected: index,
        });
      });
    }
  }

  scrollTo = (options) => {
    let xNum = parseInt(options.x) - 300;
    if (isWeex && xNum <= 0) {
      xNum = 0;
    }
    if (this.refs[SCROLLVIEW_REF]) {
      this.refs[SCROLLVIEW_REF].scrollTo({x: xNum});
    }
  }

  render() {
    let {
      style,
      dataSource,
      onSelect,
      animType,
      scrollType,
      styleType,
      itemWidth,
      renderItem,
      renderSelect,
      itemStyle,
      itemSelectedStyle,
      containerStyle,
      animBuoyStyle,
    } = this.props;
    let contentContainerWidth = 0;

    let childrens = [];
    dataSource.map((item, index) => {
      // fix with bug for ios 78
      if (typeof itemWidth == 'function') {
        contentContainerWidth += parseInt(itemWidth(item, index));
      } else {
        contentContainerWidth += parseInt(itemWidth);
      }
      if (scrollType == 'scroll') {
        childrens.push(
          <Item
            index={index}
            selected={this.state.selected}
            data={item}
            itemWidth={itemWidth}
            onSelect={onSelect}
            renderItem={renderItem}
            renderSelect={renderSelect}
            itemStyle={itemStyle}
            itemSelectedStyle={itemSelectedStyle}
            styleType={styleType} />
        );
      } else {
        itemWidth = 750 / dataSource.length;
        childrens.push(
          <Col>
            <Item
              index={index}
              selected={this.state.selected}
              data={item}
              itemWidth={itemWidth}
              onSelect={onSelect}
              renderItem={renderItem}
              renderSelect={renderSelect}
              itemStyle={itemStyle}
              itemSelectedStyle={itemSelectedStyle}
              styleType={styleType} />
          </Col>
        );
      }
    });

    let thisContainerStyle = {
      ...styles.container,
      ...style,
      ...containerStyle,
    };

    if (styleType == 'icon') {
      thisContainerStyle = {
        ...thisContainerStyle,
        ...styles.iconContainer
      };
    }

    if (styleType == 'dropdown') {
      thisContainerStyle.width = 750 - 71;
    }

    if (scrollType == 'scroll') {
      return (
        <ScrollView
          ref={SCROLLVIEW_REF}
          style={{
            ...thisContainerStyle,
            display: 'block'
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            flexDirection: 'row',
            width: contentContainerWidth
          }}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
            <AnimBuoy
              {...this.props}
              itemWidth={itemWidth}
              style={animBuoyStyle} />
            {childrens}
        </ScrollView>
      );
    } else {
      return (
        <Row style={thisContainerStyle}>
          <AnimBuoy
            {...this.props}
            itemWidth={itemWidth}
            style={animBuoyStyle} />
          {childrens}
        </Row>
      );
    }
  }
}

ItemList.defaultProps = {
  dataSource: [],
};

export default ItemList;
