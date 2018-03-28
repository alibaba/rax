import {Component, createElement, PropTypes} from 'rax';
import Text from 'rax-text';
import renderer from 'rax-test-renderer';
import Modal from '../';

jest.mock('universal-transition', () => {
  return (node, cfg1, cfg2, callback) => {
    callback && callback();
  };
});

jest.mock('@weex-module/dom', () => {
  return {
    getComponentRect: (name, callback) => {
      callback && callback({
        size: {height: 1000}
      });
    }
  };
}, {virtual: true});

jest.mock('@weex-module/animation', () => {
  return {
    transition: (ref, options, callback) => {
      callback();
    }
  };
}, {virtual: true});

jest.useFakeTimers();

class ModalTest extends Component {
  componentDidMount() {
    if (this.props.mockToggle) {
      this.refs.modal.toggle(true);
    } else {
      this.refs.modal.show();
    }

    if (this.props.mockClose) {
      setTimeout(() => {
        this.refs.modal.hide();
      }, 500);
    }
  }

  render() {
    return (
      <Modal ref="modal" {...this.props} onPress={this._onPress}>
        {this.props.children}
      </Modal>
    );
  }
}

class ControlledModalTest extends Component {
  state = {
    visible: true
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        visible: false
      });
    }, 500);
  }

  render() {
    return (
      <Modal visible={this.state.visible} {...this.props}>
        {this.props.children}
      </Modal>
    );
  }
}

describe('Modal', () => {
  it('children in Modal', () => {
    const component = renderer.create(
      <ModalTest>
        <Text>Example</Text>
      </ModalTest>
    );
    let tree = component.toJSON();

    expect(tree.children[0].children[0].children[0]).toBe('Example');
  });

  it('shown callback', () => {
    const mockShownCallback = jest.fn();
    const component = renderer.create(<ModalTest onShow={mockShownCallback} />);

    jest.runAllTimers();
    expect(mockShownCallback).toHaveBeenCalled();
  });

  it('hide Modal', () => {
    const mockHideCallback = jest.fn();

    const component = renderer.create(
      <ModalTest onHide={mockHideCallback} mockClose={true} />
    );

    jest.runAllTimers();
    expect(mockHideCallback).toHaveBeenCalled();
  });

  it('toggle Modal', () => {
    const mockShownCallback = jest.fn();

    const component = renderer.create(
      <ModalTest onShow={mockShownCallback} mockToggle={true} />
    );

    jest.runAllTimers();
    expect(mockShownCallback).toHaveBeenCalled();
  });

  it('controlled Modal', () => {
    const mockHideCallback = jest.fn();

    const component = renderer.create(
      <ControlledModalTest onHide={mockHideCallback} />
    );

    jest.runAllTimers();
    expect(mockHideCallback).toHaveBeenCalled();
  });
});
