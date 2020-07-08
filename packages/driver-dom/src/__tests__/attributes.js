import { createElement, render } from 'rax';
import * as DriverDOM from '../';

describe('attributes', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  describe('string properties', () => {
    it('render string prop with simple numbers', () => {
      render((
        <div width={30} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.getAttribute('width')).toBe('30');
    });

    it('render string prop with true value', () => {
      render((
        <a href={true} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.getAttribute('href')).toBe('true');
    });

    it('render string prop with object value', () => {
      render((
        <input type="checkbox" data={{foo: 'bar'}} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.getAttribute('data')).toBe('[object Object]');
    });
  });

  describe('boolean properties', () => {
    it('render boolean prop with true value', () => {
      render((
        <div hidden={true} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.getAttribute('hidden')).toBe('');
    });

    it('render boolean prop with false value', () => {
      render((
        <div hidden={false} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.getAttribute('hidden')).toBe(null);
    });

    it('render boolean prop with self value', () => {
      render((
        <div hidden={'hidden'} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.getAttribute('hidden')).toBe('');
    });
  });

  describe('properties must set with property', () => {
    it('render boolean prop with true', () => {
      render((
        <input type="checkbox" checked={true} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.checked).toBe(true);
    });

    it('render boolean prop with false', () => {
      render((
        <input type="checkbox" checked={false} />
      ), container, {
        driver: DriverDOM
      });

      let node = container.children[0];
      expect(node.checked).toBe(false);
    });
  });
});
