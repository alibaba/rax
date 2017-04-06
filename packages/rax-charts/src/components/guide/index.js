import {createElement, Component} from 'rax';
import Line from './GuideLine';
import Rect from './GuideRect';
import Arc from './GuideArc';
import Html from './GuideHtml';

export default class Guide extends Component {
  constructor(props) {
    super(props);
    return this.drawGuide();
  }

  drawGuide = () => {
    let {chart, children} = this.props;
    children.forEach((item) => {
      switch (item.type) {
        case Line:
          chart = new Line({chart, ...item.props});
          break;
        case Rect:
          chart = new Rect({chart, ...item.props});
          break;
        case Arc:
          chart = new Arc({chart, ...item.props});
          break;
        case Html:
          chart = new Html({chart, ...item.props});
          break;
      }
    });
    return chart;
  };
}
