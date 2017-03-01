/** @jsx createElement */

import {Component, createElement} from 'rax';

class Grid extends Component {
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
      <div {...this.props} style={style} />
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

export default Grid;
