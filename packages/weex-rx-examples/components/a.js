import {createElement, Component, render} from 'universal-rx';
import Panel from '../common/Panel';
import Tip from '../common/Tip';

class Example extends Component {
  render() {
    return (
      <scroller>
        <Panel title="Hyperlink" type="primary">
          <a href="http://example.com/">
            <Tip type="info" style={{marginBottom: 20}}
              value="Click me to see how 'A' element opens a new world." />
          </a>
        </Panel>
      </scroller>
    );
  }
}

render(<Example />);
