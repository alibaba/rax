/* @jsx createElement */

import {createElement} from 'rax';
import {renderToString} from '../index';

describe('inline styles', () => {
  it('render simple styles', () => {
    let str = renderToString(
      <div style={{color: 'red', width: '30px'}} />
    );
    expect(str).toBe('<div style="color:red;width:30px;"></div>');
  });

  it('relevant styles with px', () => {
    let str = renderToString(
      <div
        style={{
          left: 0,
          margin: 16,
          opacity: 0.5,
          padding: '4px',
        }}
      />
    );
    expect(str).toBe('<div style="left:0px;margin:16px;opacity:0.5;padding:4px;"></div>');
  });

  it('custom properties', () => {
    let str = renderToString(
      <div style={{'foo': 5}} />
    );
    expect(str).toBe('<div style="foo:5px;"></div>');
  });

  it('camel cased custom properties', () => {
    let str = renderToString(
      <div style={{'someColor': '#000000'}} />
    );
    expect(str).toBe('<div style="some-color:#000000;"></div>');
  });

  it('no undefined styles', () => {
    let str = renderToString(
      <div style={{color: undefined, width: '30px'}} />
    );
    expect(str).toBe('<div style="width:30px;"></div>');
  });

  it('no null styles', () => {
    let str = renderToString(
      <div style={{color: null, width: '30px'}} />
    );
    expect(str).toBe('<div style="width:30px;"></div>');
  });

  it('empty styles', () => {
    let str = renderToString(
      <div style={{color: null, width: null}} />
    );
    expect(str).toBe('<div style=""></div>');
  });

  it('unitless-number rules with prefixes', () => {
    let str = renderToString(
      <div
        style={{
          lineClamp: 10,
          WebkitLineClamp: 10,
          MozFlexGrow: 10,
          msFlexGrow: 10,
          msGridRow: 10,
          msGridRowEnd: 10,
          msGridRowSpan: 10,
          msGridRowStart: 10,
          msGridColumn: 10,
          msGridColumnEnd: 10,
          msGridColumnSpan: 10,
          msGridColumnStart: 10,
        }}
      />
    );
    expect(str).toBe('<div style="line-clamp:10;-webkit-line-clamp:10;-moz-flex-grow:10;ms-flex-grow:10;ms-grid-row:10;ms-grid-row-end:10;ms-grid-row-span:10;ms-grid-row-start:10;ms-grid-column:10;ms-grid-column-end:10;ms-grid-column-span:10;ms-grid-column-start:10;"></div>');
  });
});