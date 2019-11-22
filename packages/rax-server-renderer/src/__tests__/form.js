/* @jsx createElement */

import {createElement, createContext, Component, Fragment} from 'rax';
import PropTypes from 'prop-types';
import {renderToString} from '../index';

describe('form', () => {
  describe('checkbox', function() {
    it('a checkbox that is checked with an onChange', () => {
      const str = renderToString(
        <input type="checkbox" checked={true} onChange={() => {}} />
      );
      expect(str).toBe('<input type="checkbox" checked>');
    });

    it('a checkbox that is checked with disabled', () => {
      const str = renderToString(
        <input type="checkbox" checked={true} disabled={true} />
      );
      expect(str).toBe('<input type="checkbox" checked disabled>');
    });

    it('a checkbox that is checked and no onChange/disabled', () => {
      const str = renderToString(
        <input type="checkbox" checked={true} />
      );
      expect(str).toBe('<input type="checkbox" checked>');
    });

    it('a checkbox with defaultChecked', () => {
      const str = renderToString(
        <input type="checkbox" defaultChecked={true} />
      );
      expect(str).toBe('<input type="checkbox" checked>');
    });

    it('a checkbox checked overriding defaultChecked', () => {
      const str = renderToString(
        <input
          type="checkbox"
          checked={true}
          defaultChecked={false}
          disabled={true}
        />
      );
      expect(str).toBe('<input type="checkbox" checked disabled>');
    });

    it('a checkbox checked overriding defaultChecked no matter the prop order', () => {
      const str = renderToString(
        <input
          type="checkbox"
          defaultChecked={false}
          checked={true}
          disabled={true}
        />
      );
      expect(str).toBe('<input type="checkbox" checked disabled>');
    });
  });
});
