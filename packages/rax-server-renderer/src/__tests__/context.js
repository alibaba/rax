/* @jsx createElement */

import {createElement, createContext, Component, Fragment, useContext} from 'rax';
import PropTypes from 'prop-types';
import {renderToString} from '../index';

describe('context', () => {
  describe('basic context', function() {
    let Context, PurpleContextProvider, RedContextProvider, Consumer;
    beforeEach(() => {
      Context = createContext('none');

      class Parent extends Component {
        render() {
          return (
            <Context.Provider value={this.props.text}>
              {this.props.children}
            </Context.Provider>
          );
        }
      }
      Consumer = Context.Consumer;
      PurpleContextProvider = props => (
        <Parent text="purple">{props.children}</Parent>
      );
      RedContextProvider = props => (
        <Parent text="red">{props.children}</Parent>
      );
    });

    it('class child with context', () => {
      class ClassChildWithContext extends Component {
        render() {
          return (
            <div>
              <Consumer>{text => text}</Consumer>
            </div>
          );
        }
      }

      const str = renderToString(
        <PurpleContextProvider>
          <ClassChildWithContext />
        </PurpleContextProvider>
      );

      expect(str).toBe('<div>purple</div>');
    });

    it('stateless child with context', () => {
      function FunctionChildWithContext(props) {
        return <Consumer>{text => text}</Consumer>;
      }

      const str = renderToString(
        <PurpleContextProvider>
          <FunctionChildWithContext />
        </PurpleContextProvider>
      );

      expect(str).toBe('purple');
    });

    it('class child with default context', () => {
      class ClassChildWithWrongContext extends Component {
        render() {
          return (
            <div>
              <Consumer>{text => text}</Consumer>
            </div>
          );
        }
      }

      const str = renderToString(<ClassChildWithWrongContext />);

      expect(str).toBe('<div>none</div>');
    });

    it('stateless child with wrong context', () => {
      function FunctionChildWithWrongContext(props) {
        return <Consumer>{text => text}</Consumer>;
      }

      const str = renderToString(<FunctionChildWithWrongContext />);

      expect(str).toBe('none');
    });

    it('with context passed through to a grandchild', () => {
      function Grandchild(props) {
        return (
          <div>
            <Consumer>{text => text}</Consumer>
          </div>
        );
      }

      const Child = props => <Grandchild />;

      const str = renderToString(
        <PurpleContextProvider>
          <Child />
        </PurpleContextProvider>
      );

      expect(str).toBe('<div>purple</div>');
    });

    it('a child context overriding a parent context', () => {
      function Grandchild(props) {
        return (
          <div>
            <Consumer>{text => text}</Consumer>
          </div>
        );
      }

      const str = renderToString(
        <PurpleContextProvider>
          <RedContextProvider>
            <Grandchild />
          </RedContextProvider>
        </PurpleContextProvider>
      );

      expect(str).toBe('<div>red</div>');
    });

    it('multiple contexts', () => {
      const Theme = createContext('dark');
      const Language = createContext('french');
      class Parent extends Component {
        render() {
          return (
            <Theme.Provider value="light">
              <Child />
            </Theme.Provider>
          );
        }
      }

      function Child() {
        return (
          <Language.Provider value="english">
            <Grandchild />
          </Language.Provider>
        );
      }

      const Grandchild = props => {
        return (
          <div>
            <Theme.Consumer>
              {theme => <div id="theme">{theme}</div>}
            </Theme.Consumer>
            <Language.Consumer>
              {language => <div id="language">{language}</div>}
            </Language.Consumer>
          </div>
        );
      };

      const str = renderToString(<Parent />);

      expect(str).toBe('<div><div id="theme">light</div><div id="language">english</div></div>');
    });

    it('nested context unwinding', () => {
      const Theme = createContext('dark');
      const Language = createContext('french');

      const App = () => (
        <div>
          <Theme.Provider value="light">
            <Language.Provider value="english">
              <Theme.Provider value="dark">
                <Theme.Consumer>
                  {theme => <div id="theme1">{theme}</div>}
                </Theme.Consumer>
              </Theme.Provider>
              <Theme.Consumer>
                {theme => <div id="theme2">{theme}</div>}
              </Theme.Consumer>
              <Language.Provider value="sanskrit">
                <Theme.Provider value="blue">
                  <Theme.Provider value="red">
                    <Language.Consumer>
                      {() => (
                        <Language.Provider value="chinese">
                          <Language.Provider value="hungarian" />
                          <Language.Consumer>
                            {language => <div id="language1">{language}</div>}
                          </Language.Consumer>
                        </Language.Provider>
                      )}
                    </Language.Consumer>
                  </Theme.Provider>
                  <Language.Consumer>
                    {language => (
                      <Fragment>
                        <Theme.Consumer>
                          {theme => <div id="theme3">{theme}</div>}
                        </Theme.Consumer>
                        <div id="language2">{language}</div>
                      </Fragment>
                    )}
                  </Language.Consumer>
                </Theme.Provider>
              </Language.Provider>
            </Language.Provider>
          </Theme.Provider>
          <Language.Consumer>
            {language => <div id="language3">{language}</div>}
          </Language.Consumer>
        </div>
      );

      const str = renderToString(<App />);

      expect(str).toBe('<div><div id="theme1">dark</div><div id="theme2">light</div><!-- _ --><div id="language1">chinese</div><div id="theme3">blue</div><div id="language2">sanskrit</div><div id="language3">french</div></div>');
    });

    it('function context', () => {
      let Ctx = createContext();

      function Provider() {
        return (
          <Ctx.Provider value={this.props.value}>
            {this.props.children}
          </Ctx.Provider>
        );
      }

      function FnConsumer() {
        return useContext(Ctx);
      }

      const str = renderToString(
        <Provider value="a">
          <span>
            <FnConsumer />
          </span>
        </Provider>
      );

      expect(str).toBe('<span>a</span>');
    });
  });

  // contextTypes & childContextTypes is not work in ssr
  describe('legacy context', function() {
    let Warning = 'Warning: The legacy "contextTypes" and "childContextTypes" API not working properly in server renderer, use the new context API. ';

    let PurpleContext;
    beforeEach(() => {
      class Parent extends Component {
        getChildContext() {
          return {text: this.props.text};
        }
        render() {
          return this.props.children;
        }
      }

      PurpleContext = props => <Parent text="purple">{props.children}</Parent>;
    });

    it('class child with contextTypes', () => {
      expect(() => {
        class ClassChildWithContext extends Component {
          render() {
            return <div>{this.context.text}</div>;
          }
        }
        ClassChildWithContext.contextTypes = {text: PropTypes.string};

        const str = renderToString(
          <PurpleContext>
            <ClassChildWithContext />
          </PurpleContext>
        );

        expect(str).toBe('<div>purple</div>');
      }).toWarnDev(Warning + '(Current: ClassChildWithContext)', {withoutStack: true});
    });

    it('stateless child with contextTypes', () => {
      expect(() => {
        function FunctionChildWithContext(props, context) {
          return <div>{context.text}</div>;
        }
        FunctionChildWithContext.contextTypes = {text: PropTypes.string};

        const str = renderToString(
          <PurpleContext>
            <FunctionChildWithContext />
          </PurpleContext>
        );

        expect(str).toBe('<div>purple</div>');
      }).toWarnDev(Warning + '(Current: FunctionChildWithContext)', {withoutStack: true});
    });

    it('parent with childContextTypes', () => {
      expect(() => {
        class Parent extends Component {
          getChildContext() {
            return {text: this.props.text};
          }
          render() {
            return this.props.children;
          }
        }

        Parent.childContextTypes = {text: PropTypes.string};

        const PurpleContext = props => <Parent text="purple">{props.children}</Parent>;

        function FunctionChildWithContext(props, context) {
          return <div>{context.text}</div>;
        }

        const str = renderToString(
          <PurpleContext>
            <FunctionChildWithContext />
          </PurpleContext>
        );

        expect(str).toBe('<div>purple</div>');
      }).toWarnDev(Warning + '(Current: Parent)', {withoutStack: true});
    });

    it('can not filter context with contextTypes on the server', () => {
      expect(() => {
        function FunctionChildWithContext(props, context) {
          return <div>{context.text}</div>;
        }
        FunctionChildWithContext.contextTypes = {value: PropTypes.string};

        const str = renderToString(
          <PurpleContext>
            <FunctionChildWithContext />
          </PurpleContext>
        );

        expect(str).not.toBe('<div><!-- _ --></div>');
      }).toWarnDev(Warning + '(Current: FunctionChildWithContext)', {withoutStack: true});
    });

    it('can not prevent context be passed to child without contextTypes on the server', () => {
      function FunctionChildWithContext(props, context) {
        return <div>{context.text}</div>;
      }

      const str = renderToString(
        <PurpleContext>
          <FunctionChildWithContext />
        </PurpleContext>
      );

      expect(str).not.toBe('<div><!-- _ --></div>');
    });
  });
});
