'use strict';
/* @jsx createElement */

import Component from '../../component';
import PropTypes from '../../proptypes';
import {createElement} from '../../element';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';
import findDOMNode from '../../findDOMNode';
import renderToString from '../../server/renderToString';

describe('Ref', function() {
  beforeEach(function() {
    Host.driver = ServerDriver;
  });

  afterEach(function() {
    Host.driver = null;
  });

  it('Allow refs to hop around children correctly', function() {
    class RefHopsAround extends Component {
      state = {count: 0};

      moveRef = () => {
        this.setState({count: this.state.count + 1});
      };

      render() {
        let count = this.state.count;
        /**
         * What we have here, is three divs with refs (div1/2/3), but a single
         * moving cursor ref `hopRef` that "hops" around the three. We'll call the
         * `moveRef()` function several times and make sure that the hop ref
         * points to the correct divs.
         */
        return (
          <div>
            <div
              id="first"
              ref={count % 3 === 0 ? 'hopRef' : 'divOneRef'}
            />
            <div
              id="second"
              ref={count % 3 === 1 ? 'hopRef' : 'divTwoRef'}
            />
            <div
              id="third"
              ref={count % 3 === 2 ? 'hopRef' : 'divThreeRef'}
            />
          </div>
        );
      }
    }

    let refHopsAround = render(<RefHopsAround />);

    let firstDiv = findDOMNode('first');
    let secondDiv = findDOMNode('second');
    let thirdDiv = findDOMNode('third');

    expect(refHopsAround.refs.hopRef).toEqual(firstDiv);
    expect(refHopsAround.refs.divTwoRef).toEqual(secondDiv);
    expect(refHopsAround.refs.divThreeRef).toEqual(thirdDiv);

    refHopsAround.moveRef();
    expect(refHopsAround.refs.divOneRef).toEqual(firstDiv);
    expect(refHopsAround.refs.hopRef).toEqual(secondDiv);
    expect(refHopsAround.refs.divThreeRef).toEqual(thirdDiv);

    refHopsAround.moveRef();
    expect(refHopsAround.refs.divOneRef).toEqual(firstDiv);
    expect(refHopsAround.refs.divTwoRef).toEqual(secondDiv);
    expect(refHopsAround.refs.hopRef).toEqual(thirdDiv);

    /**
     * Make sure that after the third, we're back to where we started and the
     * refs are completely restored.
     */
    refHopsAround.moveRef();
    expect(refHopsAround.refs.hopRef).toEqual(firstDiv);
    expect(refHopsAround.refs.divTwoRef).toEqual(secondDiv);
    expect(refHopsAround.refs.divThreeRef).toEqual(thirdDiv);
  });

  it('Allow refs to hop around composite children correctly', function() {
    class Child extends Component {
      render() {
        this.id = this.props.id;
        return <div {...this.props} />;
      }
    }

    class RefHopsAround extends Component {
      state = {count: 0};

      moveRef = () => {
        this.setState({count: this.state.count + 1});
      };

      render() {
        let count = this.state.count;
        /**
         * What we have here, is three divs with refs (div1/2/3), but a single
         * moving cursor ref `hopRef` that "hops" around the three. We'll call the
         * `moveRef()` function several times and make sure that the hop ref
         * points to the correct divs.
         */
        return (
          <div>
            <Child
              id="first"
              ref={count % 3 === 0 ? 'hopRef' : 'divOneRef'}
            />
            <Child
              id="second"
              ref={count % 3 === 1 ? 'hopRef' : 'divTwoRef'}
            />
            <Child
              id="third"
              ref={count % 3 === 2 ? 'hopRef' : 'divThreeRef'}
            />
          </div>
        );
      }
    }

    let refHopsAround = render(<RefHopsAround />);

    let firstDiv = 'first';
    let secondDiv = 'second';
    let thirdDiv = 'third';

    expect(refHopsAround.refs.hopRef.id).toEqual(firstDiv);
    expect(refHopsAround.refs.divTwoRef.id).toEqual(secondDiv);
    expect(refHopsAround.refs.divThreeRef.id).toEqual(thirdDiv);

    refHopsAround.moveRef();
    expect(refHopsAround.refs.divOneRef.id).toEqual(firstDiv);
    expect(refHopsAround.refs.hopRef.id).toEqual(secondDiv);
    expect(refHopsAround.refs.divThreeRef.id).toEqual(thirdDiv);

    refHopsAround.moveRef();
    expect(refHopsAround.refs.divOneRef.id).toEqual(firstDiv);
    expect(refHopsAround.refs.divTwoRef.id).toEqual(secondDiv);
    expect(refHopsAround.refs.hopRef.id).toEqual(thirdDiv);

    /**
     * Make sure that after the third, we're back to where we started and the
     * refs are completely restored.
     */
    refHopsAround.moveRef();
    expect(refHopsAround.refs.hopRef.id).toEqual(firstDiv);
    expect(refHopsAround.refs.divTwoRef.id).toEqual(secondDiv);
    expect(refHopsAround.refs.divThreeRef.id).toEqual(thirdDiv);
  });

  it('always has a value for this.refs', function() {
    class MyComponent extends Component {
      render() {
        return <div />;
      }
    }

    let instance = render(<MyComponent />);
    expect(instance.refs).toEqual({});
  });
});
