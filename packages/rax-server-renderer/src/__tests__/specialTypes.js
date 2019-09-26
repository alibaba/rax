/* @jsx createElement */

import {createElement, useState, useEffect, createContext, useContext, useReducer} from 'rax';
import {renderToString} from '../index';

describe('renderToString', () => {
  describe('special types', function() {
    it('render a blank div', () => {
      function MyComponent() {
        return <div />;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div></div>');
    });
  });
});