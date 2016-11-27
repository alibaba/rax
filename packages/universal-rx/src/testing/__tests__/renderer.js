import {createElement} from '../../element';
import Component from '../../component';
import renderer from '../renderer';

describe('renderer', () => {
  it('renders a simple component', () => {
    function Link() {
      return <a role="link" />;
    }

    var component = renderer.create(<Link />);
    expect(component.toJSON()).toEqual({
      type: 'a',
      props: { role: 'link' },
      children: null,
    });
  });

  it('renders some basics with an update', () => {
    var renders = 0;

    class MyComponent extends Component {
      state = {x: 3};

      render() {
        renders++;
        return (
          <div className="purple">
            {this.state.x}
            <Child />
            <Null />
          </div>
        );
      }

      componentDidMount() {
        this.setState({x: 7});
      }
    }

    var Child = () => {
      renders++;
      return <moo />;
    };

    var Null = () => {
      renders++;
      return null;
    };

    var component = renderer.create(<MyComponent />);
    expect(component.toJSON()).toEqual({
      type: 'div',
      props: { className: 'purple' },
      children: [
        7,
        { type: 'moo', props: {}, children: null },
      ],
    });
    expect(renders).toBe(6);
  });

});
