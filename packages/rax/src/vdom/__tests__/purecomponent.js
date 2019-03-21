/* @jsx createElement */

import Component, { PureComponent } from '../component';
import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';

describe('PureComponent', function() {
  beforeEach(function() {
    Host.driver = ServerDriver;
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
  });

  it('should render', function() {
    let renders = 0;
    class MyComponent extends PureComponent {
      state = {type: 'foo'};

      render() {
        renders++;
        return <div />;
      }
    }

    let component = render(<MyComponent />);
    expect(renders).toBe(1);

    component.setState({type: 'foo'});
    jest.runAllTimers();
    expect(renders).toBe(1);

    component.setState({type: 'bar'});
    jest.runAllTimers();
    expect(renders).toBe(2);

    component.setState({type: 'bar'});
    jest.runAllTimers();
    expect(renders).toBe(2);
  });

  it('can override shouldComponentUpdate', function() {
    let renders = 0;
    class MyComponent extends PureComponent {
      state = {type: 'foo'};

      render() {
        renders++;
        return <div />;
      }
      shouldComponentUpdate() {
        return true;
      }
    }

    let component = render(<MyComponent />);
    component.setState({type: 'foo'});
    jest.runAllTimers();
    expect(renders).toBe(2);
  });

  it('extends Component', function() {
    class MyComponent extends PureComponent {
      render() {
        expect(this instanceof Component).toBe(true);
        expect(this instanceof PureComponent).toBe(true);
        return <div />;
      }
    }

    let component = render(<MyComponent />);
  });
});
