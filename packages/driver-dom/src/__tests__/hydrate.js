import { createElement, render } from 'rax';

describe('Hydrate', () => {
  let DriverDOM;
  let container;

  beforeEach(() => {
    jest.resetModules();
    DriverDOM = require('../');

    jest.useFakeTimers();
    container = document.createElement('div');
    container.innerHTML = '<div class="container"><div>About Rax</div><div>Docs</div></div>';
    (document.body || document.documentElement).appendChild(container);
  });

  it('should keep comment node when rendering multi adjacent text nodes', () => {
    container = document.createElement('div');
    container.innerHTML = '<div>About:<!--|-->Rax</div>';
    (document.body || document.documentElement).appendChild(container);

    const Component = (props) => {
      return (
        <div>About:{props.name}</div>
      );
    };

    render(<Component name="Rax" />, container, { driver: DriverDOM, hydrate: true });
    jest.runAllTimers();

    expect(container.childNodes[0].childNodes[0].data).toBe('About:');
    expect(container.childNodes[0].childNodes[1].nodeType).toBe(8); // comment
    expect(container.childNodes[0].childNodes[2].data).toBe('Rax');
  });

  it('should warn for replaced hydratable element', () => {
    const Component = () => {
      return (
        <div className="container">
          <img src="./logo.png" />
          <div>About Rax</div>
          <div>Docs</div>
        </div>
      );
    };

    expect(() => {
      render(<Component />, container, { driver: DriverDOM, hydrate: true });

      jest.runAllTimers();
    }).toWarnDev('Warning: Expected server HTML to contain a matching <img> in <div.container>, but got <div>', {
      withoutStack: true,
    });

    expect(container.childNodes[0].childNodes[0].tagName).toBe('IMG');
  });

  it('should not warn for replaced comment', () => {
    container = document.createElement('div');
    container.innerHTML = '<div><!-- --><div>About Rax</div><div>Docs</div></div>';
    (document.body || document.documentElement).appendChild(container);

    const Component = () => {
      return (
        <div class="container">
          <img src="./logo.png" />
          <div>About Rax</div>
          <div>Docs</div>
        </div>
      );
    };

    render(<Component />, container, { driver: DriverDOM, hydrate: true });
    jest.runAllTimers();

    expect(container.childNodes[0].childNodes[0].tagName).toBe('IMG');
  });

  it('should warn for deleted hydratable element', () => {
    const Component = () => {
      return (
        <div class="container">
          <div>About Rax</div>
        </div>
      );
    };

    expect(() => {
      jest.useFakeTimers();
      render(<Component />, container, { driver: DriverDOM, hydrate: true });

      jest.runAllTimers();
    }).toWarnDev('Warning: Did not expect server HTML to contain a <div> in <div.container>', {
      withoutStack: true,
    });

    expect(container.childNodes[0].childNodes[1]).toBe(undefined);
  });

  it('should warn for inserted Hydrated element', () => {
    const Component = () => {
      return (
        <div className="container">
          <div>About Rax</div>
          <div>Docs</div>
          <div className="example">Examples</div>
        </div>
      );
    };

    expect(() => {
      render(<Component />, container, { driver: DriverDOM, hydrate: true });

      jest.runAllTimers();
    }).toWarnDev('Warning: Expected server HTML to contain a matching <div> in <div.container>', {
      withoutStack: true,
    });

    expect(container.childNodes[0].childNodes[2].tagName).toBe('DIV');
  });

  it('should not compare and delete hydration child with innerHTML', () => {
    const Component = () => {
      return (
        <div className="container" dangerouslySetInnerHTML={{__html: '<div>About Rax</div><div>Docs</div>'}} />
      );
    };

    render(<Component />, container, { driver: DriverDOM, hydrate: true });

    jest.runAllTimers();

    expect(container.childNodes[0].childNodes[0].tagName).toBe('DIV');
  });
});
