import {Component, createElement} from 'rax';
import View from 'rax-view';

class Row extends Component {
  render() {
    const moreStyle = {};
    const gridType = this.props.gridType;

    if (gridType == 'flex-start') {
      styles.initial.display = 'block';
    } else {
      moreStyle.justifyContent = gridType;
    }

    let style = {
      ...styles.initial,
      ...this.props.style,
      ...moreStyle
    };

    return (
      <View {...this.props} style={style} />
    );
  }
}

const styles = {
  initial: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  }
};

export default Row;
