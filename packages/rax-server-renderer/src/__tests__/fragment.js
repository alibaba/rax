/* @jsx createElement */

import {createElement, Fragment} from 'rax';
import {renderToString} from '../index';

describe('Fragment', () => {
  it('a fragment with one child', () => {
    const str = renderToString(
      <Fragment>
        <div>text1</div>
      </Fragment>
    );
    expect(str).toBe('<div>text1</div>');
  });

  it('a fragment with several children', () => {
    let Header = props => {
      return <p>header</p>;
    };
    let Footer = props => {
      return (
        <Fragment>
          <h2>footer</h2>
          <h3>about</h3>
        </Fragment>
      );
    };

    const str = renderToString(
      <Fragment>
        <Header />
        <div>text1</div>
        <span>text2</span>
        <Footer />
      </Fragment>
    );
    expect(str).toBe('<p>header</p><div>text1</div><span>text2</span><h2>footer</h2><h3>about</h3>');
  });

  it('a nested fragment', () => {
    const str = renderToString(
      <Fragment>
        <Fragment>
          <div>text1</div>
        </Fragment>
        <span>text2</span>
        <Fragment>
          <Fragment>
            <Fragment>
              {null}
              <p />
            </Fragment>
            {false}
          </Fragment>
        </Fragment>
      </Fragment>,
    );
    expect(str).toBe('<div>text1</div><span>text2</span><!-- _ --><p></p><!-- _ -->');
  });

  it('an empty fragment', () => {
    const str = renderToString(
      <Fragment />
    );
    expect(str).toBe('<!-- _ -->');
  });
});
