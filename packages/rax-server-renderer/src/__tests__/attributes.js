/* @jsx createElement */

import {createElement} from 'rax';
import {renderToString} from '../index';

describe('renderToString', () => {
  describe('property to attribute mapping', function() {
    describe('string properties', function() {
      it('simple numbers ', () => {
        function MyComponent() {
          return <div width={30} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div width="30"></div>');
      });

      it('simple strings ', () => {
        function MyComponent() {
          return <div width={'30'} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div width="30"></div>');
      });

      it('no string prop with true value', () => {
        function MyComponent() {
          return <a href={true} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });

      it('no string prop with false value', () => {
        function MyComponent() {
          return <a href={false} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });

      it('no string prop with null value', () => {
        function MyComponent() {
          return <div width={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no string prop with function value', () => {
        let fun = function() {};

        function MyComponent() {
          return <div width={fun} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no string prop with symbol value', () => {
        function MyComponent() {
          return <div width={Symbol('foo')} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });
    });

    describe('boolean properties', function() {
      it('boolean prop with true value', () => {
        function MyComponent() {
          return <div hidden={true} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden></div>');
      });

      it('boolean prop with false value', () => {
        function MyComponent() {
          return <div hidden={false} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('boolean prop with self value', () => {
        function MyComponent() {
          return <div hidden="hidden" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden></div>');
      });

      it('boolean prop with "" value', () => {
        function MyComponent() {
          return <div hidden="" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('boolean prop with string value', () => {
        function MyComponent() {
          return <div hidden="foo" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden></div>');
      });

      it('boolean prop with array value', () => {
        function MyComponent() {
          return <div hidden={['foo', 'bar']} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden></div>');
      });

      it('boolean prop with object value', () => {
        function MyComponent() {
          return <div hidden={{foo: 'bar'}} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden></div>');
      });

      it('boolean prop with non-zero number value', () => {
        function MyComponent() {
          return <div hidden={10} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden></div>');
      });

      it('boolean prop with zero value', () => {
        function MyComponent() {
          return <div hidden={0} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no boolean prop with null value', () => {
        function MyComponent() {
          return <div hidden={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no boolean prop with function value', () => {
        let fun = function() {};
        function MyComponent() {
          return <div hidden={fun} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no boolean prop with symbol value', () => {
        function MyComponent() {
          return <div hidden={Symbol('foo')} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });
    });

    describe('download property (combined boolean/string attribute)', function() {
      it('download prop with true value', () => {
        function MyComponent() {
          return <a download={true} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a download></a>');
      });

      it('download prop with false value', () => {
        function MyComponent() {
          return <a download={false} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });

      it('download prop with string value', () => {
        function MyComponent() {
          return <a download="myfile" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a download="myfile"></a>');
      });

      it('download prop with string "false" value', () => {
        function MyComponent() {
          return <a download="false" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a download="false"></a>');
      });

      it('download prop with string "true" value', () => {
        function MyComponent() {
          return <a download="true" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a download="true"></a>');
      });

      it('download prop with number 0 value', () => {
        function MyComponent() {
          return <a download={0} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a download="0"></a>');
      });

      it('no download prop with null value', () => {
        function MyComponent() {
          return <a download={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });

      it('no download prop with undefined value', () => {
        function MyComponent() {
          return <a download={undefined} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });

      it('no download prop with function value', () => {
        let fun = function() {};
        function MyComponent() {
          return <a download={fun} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });

      it('no download prop with symbol value', () => {
        function MyComponent() {
          return <a download={Symbol('foo')} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<a></a>');
      });
    });

    describe('className property', function() {
      it('className prop with string value', () => {
        function MyComponent() {
          return <div className="myClassName" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div class="myClassName"></div>');
      });

      it('className prop with empty string value', () => {
        function MyComponent() {
          return <div className="" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div class=""></div>');
      });

      it('no className prop with true value', () => {
        function MyComponent() {
          return <div className={true} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no className prop with false value', () => {
        function MyComponent() {
          return <div className={false} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no className prop with null value', () => {
        function MyComponent() {
          return <div className={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('badly cased className with a warning', () => {
        function MyComponent() {
          return <div classname="test" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div classname="test"></div>');
      });

      it('className prop when given the alias with a warning', () => {
        function MyComponent() {
          return <div class="test" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div class="test"></div>');
      });
    });

    describe('htmlFor property', function() {
      // TODO
    });

    describe('numeric properties', function() {
      it('positive numeric property with positive value', () => {
        function MyComponent() {
          return <input size={2} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<input size="2">');
      });

      it('numeric property with zero value', () => {
        function MyComponent() {
          return <ol start={0} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<ol start="0"></ol>');
      });

      it('no positive numeric property with zero value', () => {
        function MyComponent() {
          return <input size={0} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<input>');
      });

      it('no numeric prop with function value', () => {
        let fun = function() {};
        function MyComponent() {
          return <ol start={fun} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<ol></ol>');
      });

      it('no numeric prop with symbol value', () => {
        function MyComponent() {
          return <ol start={Symbol('foo')} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<ol></ol>');
      });

      it('no positive numeric prop with function value', () => {
        let fun = function() {};
        function MyComponent() {
          return <input size={fun} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<input>');
      });

      it('no positive numeric prop with symbol value', () => {
        let fun = function() {};
        function MyComponent() {
          return <input size={Symbol('foo')} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<input>');
      });
    });

    describe('props with special meaning', function() {
      it('no ref attribute', () => {
        function MyComponent() {
          return <div ref="foo" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no children attribute', () => {
        function MyComponent() {
          return createElement('div', {}, 'foo');
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div>foo</div>');
      });

      it('no key attribute', () => {
        function MyComponent() {
          return <div key="foo" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no dangerouslySetInnerHTML attribute', () => {
        function MyComponent() {
          return <div dangerouslySetInnerHTML={{__html: '<foo />'}} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div><foo /></div>');
      });
    });

    describe('inline styles', function() {
      // TODO
    });

    describe('aria attributes', function() {
      it('simple strings', () => {
        function MyComponent() {
          return <div aria-label="hello" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div aria-label="hello"></div>');
      });

      it('aria string prop with false value', () => {
        function MyComponent() {
          return <div aria-label={false} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div aria-label="false"></div>');
      });

      it('aria string prop with null value', () => {
        function MyComponent() {
          return <div aria-label={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('"aria" attribute with a warning', () => {
        function MyComponent() {
          return <div aria="hello" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div aria="hello"></div>');
      });
    });

    describe('cased attributes', function() {
      it('badly cased aliased HTML attribute with a warning', () => {
        function MyComponent() {
          return <meta httpequiv="refresh" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<meta httpequiv="refresh">');
      });

      it('badly cased SVG attribute with a warning', () => {
        function MyComponent() {
          return <svg>
            <text textlength="10" />
          </svg>;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<svg><text textlength="10"></text></svg>');
      });

      it('no badly cased aliased SVG attribute alias', () => {
        function MyComponent() {
          return <svg>
            <text strokedasharray="10 10" />
          </svg>;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<svg><text strokedasharray="10 10"></text></svg>');
      });

      it('no badly cased original SVG attribute that is aliased', () => {
        function MyComponent() {
          return <svg>
            <text stroke-dasharray="10 10" />
          </svg>;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<svg><text stroke-dasharray="10 10"></text></svg>');
      });
    });

    describe('unknown attributes', function() {
      it('unknown attributes', () => {
        function MyComponent() {
          return <div foo="bar" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div foo="bar"></div>');
      });

      it('unknown data- attributes', () => {
        function MyComponent() {
          return <div data-foo="bar" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div data-foo="bar"></div>');
      });

      it('badly cased reserved attributes', () => {
        function MyComponent() {
          return <div CHILDREN="5" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div CHILDREN="5"></div>');
      });

      it('"data" attribute', () => {
        function MyComponent() {
          return <object data="hello" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<object data="hello"></object>');
      });

      it('no unknown data- attributes with null value', () => {
        function MyComponent() {
          return <div data-foo={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('unknown data- attributes with casing', () => {
        function MyComponent() {
          return <div data-fooBar="true" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div data-fooBar="true"></div>');
      });

      it('unknown data- attributes with boolean true', () => {
        function MyComponent() {
          return <div data-foobar={true} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div data-foobar="true"></div>');
      });

      it('unknown data- attributes with boolean false', () => {
        function MyComponent() {
          return <div data-foobar={false} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div data-foobar="false"></div>');
      });

      it('no unknown data- attributes with casing and null value', () => {
        function MyComponent() {
          return <div data-foobar={null} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('custom attributes for non-standard elements', () => {
        function MyComponent() {
          return <nonstandard foo="bar" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<nonstandard foo="bar"></nonstandard>');
      });

      it('SVG tags with dashes in them', () => {
        function MyComponent() {
          return <svg>
            <font-face accent-height={10} />
          </svg>;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<svg><font-face accent-height="10"></font-face></svg>');
      });

      it('cased custom attributes', () => {
        function MyComponent() {
          return <div fooBar="test" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div fooBar="test"></div>');
      });
    });

    describe('event attributes', function() {
      it('no HTML events', () => {
        function MyComponent() {
          return <div onClick={() => {}} />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('unknown events', () => {
        function MyComponent() {
          return <div onunknownevent="alert(&quot;hack&quot;)" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div onunknownevent=\"alert(&quot;hack&quot;)\"></div>');
      });

      it('custom attribute named `on`', () => {
        function MyComponent() {
          return <div on="tap:do-something" />;
        }

        const str = renderToString(<MyComponent />);
        expect(str).toBe('<div on="tap:do-something"></div>');
      });
    });
  });

  describe('custom elements', () => {
    it('class for custom elements', () => {
      function MyComponent() {
        return <div is="custom-element" class="test" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div is="custom-element" class="test"></div>');
    });

    it('className for custom elements', () => {
      function MyComponent() {
        return <div is="custom-element" className="test" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div is="custom-element" class="test"></div>');
    });

    it('htmlFor attribute for custom elements', () => {
      function MyComponent() {
        return <div is="custom-element" htmlFor="test" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div is="custom-element" htmlFor="test"></div>');
    });

    it('for attribute for custom elements', () => {
      function MyComponent() {
        return <div is="custom-element" for="test" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div is="custom-element" for="test"></div>');
    });

    it('unknown attributes for custom elements', () => {
      function MyComponent() {
        return <custom-element foo="bar" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<custom-element foo="bar"></custom-element>');
    });

    it('unknown `on*` attributes for custom elements', () => {
      function MyComponent() {
        return <custom-element onunknown="bar" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<custom-element onunknown="bar"></custom-element>');
    });

    it('no unknown boolean `true` attributes', () => {
      function MyComponent() {
        return <custom-element foo={true} />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<custom-element></custom-element>');
    });

    it('no unknown boolean `false` attributes', () => {
      function MyComponent() {
        return <custom-element foo={false} />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<custom-element></custom-element>');
    });

    it('no unknown attributes for custom elements with null value', () => {
      function MyComponent() {
        return <custom-element foo={null} />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<custom-element></custom-element>');
    });

    it('unknown attributes for custom elements using is', () => {
      function MyComponent() {
        return <div is="custom-element" foo="bar" />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div is="custom-element" foo="bar"></div>');
    });

    it('no unknown attributes for custom elements using is with null value', () => {
      function MyComponent() {
        return <div is="custom-element" foo={null} />;
      }

      const str = renderToString(<MyComponent />);
      expect(str).toBe('<div is="custom-element"></div>');
    });
  });
});