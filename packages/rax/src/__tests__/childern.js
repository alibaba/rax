/* @jsx createElement */

import {createElement, cloneElement} from '../element';
import Component from '../component';
import Children from '../children';

describe('Children', () => {
  class WrapComponent extends Component {
    render() {
      return (
        <div>
          {Children.only(this.props.children, this.props.mapFn, this)}
        </div>
      );
    }
  }

  it('should support identity for simple', () => {
    var context = {};
    var callback = jasmine.createSpy().and.callFake(function(kid, index) {
      expect(this).toBe(context);
      return kid;
    });

    var simpleKid = <span key="simple" />;

    var instance = <div>{simpleKid}</div>;
    Children.forEach(instance.props.children, callback, context);
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    callback.calls.reset();

    var mappedChildren = Children.map(
      instance.props.children,
      callback,
      context,
    );
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
  });


  it('should invoke callback with the right context', () => {
    var lastContext;
    var callback = function(kid, index) {
      lastContext = this;
      return this;
    };

    // TODO: Use an object to test, after non-object fragments has fully landed.
    var scopeTester = 'scope tester';

    var simpleKid = <span key="simple" />;
    var instance = <div>{simpleKid}</div>;
    Children.forEach(instance.props.children, callback, scopeTester);
    expect(lastContext).toBe(scopeTester);

    var mappedChildren = Children.map(
      instance.props.children,
      callback,
      scopeTester,
    );

    expect(Children.count(mappedChildren)).toBe(1);
    expect(mappedChildren[0]).toBe(scopeTester);
  });

  it('should return 0 for null children', () => {
    var numberOfChildren = Children.count(null);
    expect(numberOfChildren).toBe(0);
  });

  it('should return 0 for undefined children', () => {
    var numberOfChildren = Children.count(undefined);
    expect(numberOfChildren).toBe(0);
  });

  it('should return 1 for single child', () => {
    var simpleKid = <span key="simple" />;
    var instance = <div>{simpleKid}</div>;
    var numberOfChildren = Children.count(instance.props.children);
    expect(numberOfChildren).toBe(1);
  });

  it('should count the number of children in flat structure', () => {
    var zero = <div key="keyZero" />;
    var one = null;
    var two = <div key="keyTwo" />;
    var three = null;
    var four = <div key="keyFour" />;

    var instance = (
      <div>
        {zero}
        {one}
        {two}
        {three}
        {four}
      </div>
    );
    var numberOfChildren = Children.count(instance.props.children);
    expect(numberOfChildren).toBe(5);
  });

  it('should count the number of children in nested structure', () => {
    var zero = <div key="keyZero" />;
    var one = null;
    var two = <div key="keyTwo" />;
    var three = null;
    var four = <div key="keyFour" />;
    var five = <div key="keyFive" />;

    var instance = (
      <div>
        {[[[zero, one, two], [three, four], five], null]}
      </div>
    );
    var numberOfChildren = Children.count(instance.props.children);
    expect(numberOfChildren).toBe(7);
  });

  it('should flatten children to an array', () => {
    expect(Children.toArray(undefined)).toEqual([]);
    expect(Children.toArray(null)).toEqual([]);

    expect(Children.toArray(<div />).length).toBe(1);
    expect(Children.toArray([<div />]).length).toBe(1);
    expect(Children.toArray(<div />)[0].key).toBe(
     Children.toArray([<div />])[0].key,
    );

    var flattened = Children.toArray([
     [<div key="apple" />, <div key="banana" />, <div key="camel" />],
     [<div key="banana" />, <div key="camel" />, <div key="deli" />],
    ]);
    expect(flattened.length).toBe(6);
    expect(flattened[1].key).toContain('banana');
    expect(flattened[3].key).toContain('banana');
    // expect(flattened[1].key).not.toBe(flattened[3].key);

    var reversed = Children.toArray([
     [<div key="camel" />, <div key="banana" />, <div key="apple" />],
     [<div key="deli" />, <div key="camel" />, <div key="banana" />],
    ]);
    expect(flattened[0].key).toBe(reversed[2].key);
    expect(flattened[1].key).toBe(reversed[1].key);
    expect(flattened[2].key).toBe(reversed[0].key);
    expect(flattened[3].key).toBe(reversed[5].key);
    expect(flattened[4].key).toBe(reversed[4].key);
    expect(flattened[5].key).toBe(reversed[3].key);

    // null/undefined/bool are all omitted
    // expect(Children.toArray([1, 'two', null, undefined, true])).toEqual([
    //  1,
    //  'two',
    // ]);
  });

  it('should fail when passed two children', () => {
    expect(function() {
      var instance = (
        <WrapComponent>
          <div />
          <span />
        </WrapComponent>
      );
      Children.only(instance.props.children);
    }).toThrow();
  });

  it('should fail when passed nully values', () => {
    expect(function() {
      var instance = (
        <WrapComponent>
          {null}
        </WrapComponent>
      );
      Children.only(instance.props.children);
    }).toThrow();

    expect(function() {
      var instance = (
        <WrapComponent>
          {undefined}
        </WrapComponent>
      );
      Children.only(instance.props.children);
    }).toThrow();
  });

  it('should fail when passed interpolated two array children', () => {
    expect(function() {
      var instance = (
        <WrapComponent>
          {[<span key="abc" />, <span key="def" />]}
        </WrapComponent>
      );
      Children.only(instance.props.children);
    }).toThrow();
  });

  it('should not fail when passed interpolated single child', () => {
    expect(function() {
      var instance = (
        <WrapComponent>
          {<span />}
        </WrapComponent>
      );
      Children.only(instance.props.children);
    }).not.toThrow();
  });

  it('should return the only child', () => {
    var instance = (
      <WrapComponent>
        <span />
      </WrapComponent>
    );
    expect(Children.only(instance.props.children)).toEqual(<span />);
  });

  it('should not throw if key provided is a dupe with array key', () => {
    var zero = <div />;
    var one = <div key="0" />;

    var mapFn = function() {
      return null;
    };

    var instance = (
      <div>
        {zero}
        {one}
      </div>
    );

    expect(function() {
      Children.map(instance.props.children, mapFn);
    }).not.toThrow();
  });

  it('should use the same key for a cloned element', () => {
    var instance = (
     <div>
       <div />
     </div>
    );

    var mapped = Children.map(
      instance.props.children,
      element => element,
    );

    var mappedWithClone = Children.map(instance.props.children, element =>
      cloneElement(element),
    );

    expect(mapped[0].key).toBe(mappedWithClone[0].key);
  });

  it('should use the same key for a cloned element with key', () => {
    var instance = (
       <div>
         <div key="unique" />
       </div>
     );

    var mapped = Children.map(
       instance.props.children,
       element => element,
     );

    var mappedWithClone = Children.map(instance.props.children, element =>
       cloneElement(element, {key: 'unique'}),
     );

    expect(mapped[0].key).toBe(mappedWithClone[0].key);
  });
});
