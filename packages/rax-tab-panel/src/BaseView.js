/** @jsx createElement */

'use strict';

import {Component} from 'rax';
import _ from 'simple-lodash';
import TabPanel from './TabPanel';

class BaseView extends Component {
  itemWidth = 750;
  itemCount = 0;
  curIndex = null;
  token = null;
  prevIndex = null;

  switchTo = () => {
    // no impl
  }

  renderPanel = (index) => {
    if (this.refs[`panel_${index}`]) {
      this.refs[`panel_${index}`].show();
    }
  }

  destroyPanel = (index) => {
    if (this.refs[`panel_${index}`]) {
      this.refs[`panel_${index}`].hide();
    }
  }

  countItems(props = this.props) {
    this.itemCount = 0;
    let children = props.children.length > 0 ? props.children : [props.children];
    children.map((child) => {
      if (child && child.type === TabPanel) {
        this.itemCount++;
      }
    });
  }

  handleScreens = () => {
    let {screenNumbersPerSide} = this.props;
    let {itemCount, curIndex} = this;
    let visibleIndexes = [];
    if (screenNumbersPerSide >= 0) {
      let max = curIndex + screenNumbersPerSide > itemCount - 1 ? itemCount - 1 : curIndex + screenNumbersPerSide;
      let min = curIndex - screenNumbersPerSide < 0 ? 0 : curIndex - screenNumbersPerSide;
      for (let i = min; i < curIndex; i++) {
        visibleIndexes.push(i);
      }
      for (let i = curIndex; i <= max; i++) {
        visibleIndexes.push(i);
      }
      for (let i = 0; i < itemCount; i++) {
        if (_.findIndex(visibleIndexes, (o) => {
          return o === i;
        }) === -1) {
          this.destroyPanel(i);
        }
      }
    }
  }

}

export default BaseView;