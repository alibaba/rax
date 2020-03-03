/* @jsx createElement */

import {createElement} from 'rax';
import {renderToString} from '../index';

describe('inline styles', () => {
  describe('basic', () => {
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

    it('style with lineHeight', () => {
      const styles = {
        container: {
          lineHeight: 1
        },
        text: {
          lineHeight: '75rpx'
        }
      };

      function MyComponent(props, context) {
        return (
          <div style={styles.container}>
            <p style={styles.text}>Hello</p>
          </div>
        );
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div style="line-height:1;"><p style="line-height:10vw;">Hello</p></div>');
    });

    it('style with unitless property', () => {
      const style = {
        flex: 1,
        fontSize: 16,
        width: '100%'
      };

      function MyComponent(props, context) {
        return <div style={style} />;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div style="flex:1;font-size:16px;width:100%;"></div>');
    });

    it('style with fontWeight', () => {
      const styles = {
        numericalProperty: {
          fontWeight: 600,
        },
        stringifyProperty: {
          fontWeight: '600'
        },
        propertyWithKeyWord: {
          fontWeight: 'bold'
        }
      };

      function MyComponent(props, context) {
        return (
          <div>
            <div style={styles.numericalProperty}></div>
            <div style={styles.stringifyProperty}></div>
            <div style={styles.propertyWithKeyWord}></div>
          </div>
        );
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div><div style="font-weight:600;"></div><div style="font-weight:600;"></div><div style="font-weight:bold;"></div></div>');
    });
  });

  describe('rpx', () => {
    it('style with rpx', () => {
      const style = {
        flex: 1,
        fontSize: '16rpx',
        width: '100%'
      };

      const str = renderToString(<div style={style} />);
      expect(str).toBe('<div style="flex:1;font-size:2.13333vw;width:100%;"></div>');
    });

    it('set default unit as rpx', () => {
      const styles = {
        container: {
          lineHeight: 1
        },
        text: {
          fontSize: 75
        }
      };

      function MyComponent(props, context) {
        return (
          <div style={styles.container}>
            <p style={styles.text}>Hello</p>
          </div>
        );
      }

      const str = renderToString(<MyComponent />, {
        defaultUnit: 'rpx'
      });
      expect(str).toBe('<div style="line-height:1;"><p style="font-size:10vw;">Hello</p></div>');
    });
  });

  it('render style with array value', () => {
    const styles = {
      title: {
        fontSize: 16,
      },
      container: {
        flex: 1,
        width: '100%'
      }
    };

    function MyComponent(props, context) {
      return <div style={[styles.container, styles.title]} />;
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div style="flex:1;width:100%;font-size:16px;"></div>');
  });

  it('render items with same style', () => {
    const style = {
      color: '#f00',
      fontSize: '16px'
    };

    function MyComponent(props, context) {
      const data = [1, 2];
      return (
        <div>
          {
            data.map((_, i) => <div key={i} style={style}>hello</div>)
          }
        </div>
      );
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div><div style="color:#f00;font-size:16px;">hello</div><div style="color:#f00;font-size:16px;">hello</div></div>');
  });

  it('render items with a base style', () => {
    const style = {
      color: '#f00',
      fontSize: '16px'
    };

    function MyComponent(props, context) {
      const data = [1, 2];
      return (
        <div>
          {
            data.map((item, index) => <div key={index} style={{...style, fontSize: index + 'px'}}>hello</div>)
          }
        </div>
      );
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div><div style="color:#f00;font-size:0px;">hello</div><div style="color:#f00;font-size:1px;">hello</div></div>');
  });

  it('render items with change to base style', () => {
    const style = {
      color: '#f00',
      fontSize: '16px'
    };

    function MyComponent(props, context) {
      const data = [1, 2];
      return (
        <div>
          {
            data.map((item, index) => {
              // after map, style.fontSize will be 1px
              style.fontSize = index + 'px';
              return <div key={index} style={style}>hello</div>;
            })
          }
        </div>
      );
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div><div style="color:#f00;font-size:1px;">hello</div><div style="color:#f00;font-size:1px;">hello</div></div>');
  });
});
