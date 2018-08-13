/** @jsx createElement */

'use strict';

import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import {Event as Emitter} from './Utils';
import Detection from './Detection';


class TabPanelView extends Component {
  isPanning = false;

  static contextTypes = {
    isInATabPanel: PropTypes.bool,
    uuid: PropTypes.number
  };

  render() {
    let props = {
      ...this.props,
      preventMoveEvent: true,
      onClick: this.onCellClick
    };
    if (Detection.isEnableSliderAndroid && this.context.isInATabPanel) {
      props.onHorizontalPan = this.onHorizontalPan;
    }

    return (
      <View {...props} />
    );
  }

  onCellClick = (e) => {
    const {onClick, onPress} = this.props;
    if (this.isPanning) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    } else if (typeof onPress === 'function') {
      onPress(e);
    }
  }

  onHorizontalPan = (e) => {
    if (e.state === 'start') {
      this.isPanning = true;
      Emitter.emit('tabpanelcell:panstart', {
        uuid: this.context.uuid,
        element: this
      });
    } else if (e.state === 'end') {
      setTimeout(() => {
        this.isPanning = false;
      }, 50);
    }
  }
}


export default TabPanelView;