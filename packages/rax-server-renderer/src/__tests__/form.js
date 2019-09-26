import {createElement, useState, useEffect, createContext, useContext, useReducer} from 'rax';
import {renderToString} from '../index';

describe('renderToString', () => {
  describe('form', function() {
    describe('checkbox', function() {
      it('render a blank div', () => {
        function MyComponent() {
          return <div />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });
    });

    describe('input', function() {

    });

    describe('progress', function() {

    });

    describe('select', function() {

    });

    describe('textarea', function() {

    });
  });
});