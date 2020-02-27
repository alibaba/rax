import { createElement, Fragment, render, useState } from 'rax';
import * as DriverDOM from '../';

describe('NodeOperations', () => {
  let container;
  let updateHandler;

  beforeEach(() => {
    jest.useFakeTimers();
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  it('should append child', () => {
    const Component = () => {
      const [temp, setTemp] = useState(false);
      updateHandler = setTemp;
      return <Fragment>{temp ? <div /> : null}</Fragment>;
    };

    render(<Component />, container, { driver: DriverDOM });

    updateHandler(true);
    jest.runAllTimers();
    expect(container.childNodes[0].tagName).toBe('DIV');
  });

  it('should update text', () => {
    const Component = () => {
      const [temp, setTemp] = useState('');
      updateHandler = setTemp;
      return <p>{temp}</p>;
    };

    render(<Component />, container, { driver: DriverDOM });

    updateHandler('hello');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('hello');
  });

  it('should removeAttribute className', () => {
    const Component = () => {
      const [temp, setTemp] = useState(true);
      updateHandler = setTemp;
      return <div {...(temp ? { className: 'hello' } : {})} />;
    };

    render(<Component />, container, { driver: DriverDOM });

    updateHandler(false);
    jest.runAllTimers();
    expect(container.childNodes[0].className).toBe('');
  });
});
