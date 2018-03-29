/** @jsx createElement */

'use strict';

import {createElement, Component, PropTypes} from 'rax';
import {Event as Emitter} from './Utils';
import Detection from './Detection';
import Link from 'rax-link';

class TabPanelLink extends Component {
  isPanning = false;

  static contextTypes = {
    isInATabPanel: PropTypes.bool
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
      <Link {...props} />
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
        element: this
      });
    } else if (e.state === 'end') {
      setTimeout(() => {
        this.isPanning = false;
      }, 50);
    }
  }
}


export default TabPanelLink;
