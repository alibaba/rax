import {createElement, Component, render} from 'universal-rx';

// Inspired by bootstrap http://getbootstrap.com/
class Panel extends Component {
  static defaultProps = {
    type: 'default',
    paddingBody: 20,
    paddingHead: 20,
    title: ''
  };
  render() {
    const {type, paddingHead, paddingBody, title} = this.props;

    return (
      <div style={[styles.panel, styles['panel-' + type]]}>
        <text style={[
          styles['panel-header'],
          styles['panel-header-' + type],
          {
            paddingTop: paddingHead,
            paddingBottom: paddingHead,
            paddingLeft: paddingHead * 1.5,
            paddingRight: paddingHead * 1.5
          }
        ]}>{title}</text>
        <div style={[
          styles['panel-body'],
          styles['panel-body-' + type],
          {
            paddingTop: paddingBody,
            paddingBottom: paddingBody,
            paddingLeft: paddingBody * 1.5,
            paddingRight: paddingBody * 1.5
          }
        ]}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const styles = {
  panel: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderColor: '#dddddd',
    borderWidth: 1,
  },
  'panel-default': {

  },
  'panel-primary': {
    borderColor: 'rgb(40, 96, 144)'
  },
  'panel-success': {
    borderColor: 'rgb(76, 174, 76)'
  },
  'panel-info': {
    borderColor: 'rgb(70, 184, 218)'
  },
  'panel-warning': {
    borderColor: 'rgb(238, 162, 54)'
  },
  'panel-danger': {
    borderColor: 'rgb(212, 63, 58)'
  },
  'panel-header': {
    backgroundColor: '#f5f5f5',
    fontSize: 40,
    color: '#333333'
  },
  'panel-header-default': {},
  'panel-header-primary': {
    backgroundColor: 'rgb(40, 96, 144)',
    color: '#ffffff'
  },
  'panel-header-success': {
    backgroundColor: 'rgb(92, 184, 92)',
    color: '#ffffff'
  },
  'panel-header-info': {
    backgroundColor: 'rgb(91, 192, 222)',
    color: '#ffffff'
  },
  'panel-header-warning': {
    backgroundColor: 'rgb(240, 173, 78)',
    color: '#ffffff'
  },
  'panel-header-danger': {
    backgroundColor: 'rgb(217, 83, 79)',
    color: '#ffffff'
  },
  'panel-body-default': {},
  'panel-body-primary': {},
  'panel-body-success': {},
  'panel-body-info': {},
  'panel-body-warning': {},
  'panel-body-danger': {},
};

export default Panel;
