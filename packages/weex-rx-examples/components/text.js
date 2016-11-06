import {createElement, Component, render} from 'universal-rx';
import Panel from '../common/Panel';

function TextItem(props) {
  return (
    <text style={[styles.txt, props.style]}>{props.children}</text>
  );
}

class Example extends Component {
  render() {
    return (
      <scroller>
        <Panel title="color" type="primary">
          <TextItem>default is black</TextItem>
          <TextItem style={{color: '#286090'}}>#286090</TextItem>
          <TextItem style={{color: '#0f0'}}>#0f0</TextItem>
          <TextItem style={{color: 'red'}}>red</TextItem>
          <TextItem style={{color: 'rgb(238, 162, 54)'}}>rgb(238, 162, 54)</TextItem>
          <TextItem style={{color: 'rgba(238, 162, 54, 0.5)'}}>rgba(238, 162, 54, 0.5)</TextItem>
        </Panel>
        <Panel title="fontSize" type="primary">
          <TextItem style={{fontSize: 32}}>32</TextItem>
          <TextItem style={{fontSize: 64}}>64</TextItem>
          <TextItem style={{fontSize: 100}}>100</TextItem>
        </Panel>
        <Panel title="fontStyle" type="primary">
          <TextItem style={{fontStyle: 'normal'}}>normal</TextItem>
          <TextItem style={{fontStyle: 'italic'}}>italic</TextItem>
        </Panel>
        <Panel title="fontWeight" type="primary">
          <TextItem style={{fontWeight: 'normal'}}>normal</TextItem>
          <TextItem style={{fontWeight: 'bold'}}>bold</TextItem>
        </Panel>
        <Panel title="textDecoration" type="primary">
          <TextItem style={{textDecoration: 'none'}}>none</TextItem>
          <TextItem style={{textDecoration: 'underline'}}>underline</TextItem>
          <TextItem style={{textDecoration: 'line-through'}}>line-through</TextItem>
        </Panel>
        <Panel title="textAlign" type="primary">
          <TextItem style={{textAlign: 'left'}}>left</TextItem>
          <TextItem style={{textAlign: 'center'}}>center</TextItem>
          <TextItem style={{textAlign: 'right'}}>right</TextItem>
        </Panel>
        <Panel title="textOverflow" type="primary">
          <TextItem style={{lines:1}}>no textOverflow, no textOverflow</TextItem>
          <TextItem style={{textOverflow: 'clip', width:450, lines:1}}>textOverflow: clip, textOverflow: clip</TextItem>
          <TextItem style={{textOverflow: 'ellipsis', width:450, lines:1}}>textOverflow: ellipsis, textOverflow: ellipsis</TextItem>
        </Panel>
        <Panel title="lineHeight" type="primary">
          <TextItem>no lineheight setting</TextItem>
          <TextItem style={{lineHeight: 50}}>lineheight 50</TextItem>
          <TextItem style={{lineHeight: 80}}> lineheight 80</TextItem>
        </Panel>
      </scroller>
    );
  }
}

const styles = {
  txt: {
    marginBottom: 12,
    fontSize: 40,
  }
};

render(<Example />);
