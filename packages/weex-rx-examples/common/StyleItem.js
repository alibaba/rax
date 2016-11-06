import {createElement, Component} from 'universal-rx';

class StyleItem extends Component {
  static defaultProps = {
    value: '',
    type: 0
  };
  render() {
    const {value, type, style} = this.props;

    return (
      <text
        value={value}
        style={[styles.item, {backgroundColor: type == '1' ? '#7BA3A8' : '#BEAD92'}, style]}
      />
    );
  }
}


const styles = {
  item: {
    marginRight: 10,
    /*margin-bottom: 10px;*/
    width: 160,
    height: 75,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#eeeeee'
  }
};

export default StyleItem;
