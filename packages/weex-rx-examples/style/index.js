import {createElement, Component, render} from 'universal-rx';
import StyleItem from '../common/StyleItem';
import Panel from '../common/Panel';

class Example extends Component {
  render() {
    return (
      <scroller>
        <Panel title="opacity" type="primary">
          <div style={{flexDirection: 'row'}}>
            <StyleItem style={{opacity:1}} value="1" />
            <StyleItem style={{opacity:0.9}} value="0.9" />
            <StyleItem style={{opacity:0.5}} value="0.5" />
            <StyleItem style={{opacity:0.2}} value="0.2" />
          </div>
        </Panel>
        <Panel title="backgroundColor" type="primary">
          <div>
            {/* <StyleItem style={{backgroundColor: '#666'}} value="#666" /> */}
            <StyleItem style={{backgroundColor: '#666666'}} value="#666666" />
            <StyleItem style={{backgroundColor: 'rgb(238, 162, 54)'}} value="rgb()" />
            <StyleItem style={{backgroundColor: 'rgba(238, 162, 54, 0.5)'}} value="rgba()" />
            <StyleItem style={{backgroundColor: 'red'}} value="red" />
          </div>
        </Panel>
      </scroller>
    );
  }
}

const styles = {
 itemBg: {
   width: 690,
   marginBottom: 10,
 }
};

render(<Example />);
