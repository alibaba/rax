import {Component, createElement} from 'rax';
import View from 'rax-view';

class FormLine extends Component {
  render() {
    let {
      children,
      style,
    } = this.props;

    return (
      <View style={styles.root}>
        <View style={{...styles.container, ...style}}>
          {
            children.map((item) => {
              return (
                <View style={styles.item}>
                  {item}
                </View>
              );
            })
          }
        </View>
      </View>
    );
  }
}

let styles = {
  root: {
    height: 100,
    backgroundColor: '#ffffff',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 22,
    marginRight: 22,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    paddingTop: 20,
    height: 99,
  },
  item: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
  }
};

export default FormLine;
