/* @jsx createElement */

import {createElement} from 'rax';
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

  describe('input', function() {
    it('an input with a value and an onChange', () => {
      const str = renderToString(
        <input value="foo" onChange={() => {}} />
      );
      expect(str).toBe('<input value="foo">');
    });

    it('an input with a value and readOnly', () => {
      const str = renderToString(
        <input value="foo" readOnly={true} />
      );
      expect(str).toBe('<input value="foo" readOnly>');
    });

    it('an input with a value and no onChange/readOnly', () => {
      const str = renderToString(
        <input value="foo" />
      );
      expect(str).toBe('<input value="foo">');
    });

    it('an input with a defaultValue', () => {
      const str = renderToString(
        <input defaultValue="foo" />
      );
      expect(str).toBe('<input value="foo">');
    });

    it('an input value overriding defaultValue', () => {
      const str = renderToString(
        <input value="foo" defaultValue="bar" readOnly={true} />
      );
      expect(str).toBe('<input value="foo" readOnly>');
    });

    it('an input value overriding defaultValue no matter the prop order', () => {
      const str = renderToString(
        <input defaultValue="bar" value="foo" readOnly={true} />
      );
      expect(str).toBe('<input value="foo" readOnly>');
    });

    it('an zero input value overriding defaultValue', () => {
      const str = renderToString(
        <input defaultValue={9} value={0} readOnly={true} />
      );
      expect(str).toBe('<input value="0" readOnly>');
    });
  });

  describe('select', function() {
    let options;
    beforeEach(() => {
      options = [
        <option key={1} value="foo" id="foo">
          Foo
        </option>,
        <option key={2} value="bar" id="bar">
          Bar
        </option>
      ];
    });

    it('a select with a value and an onChange', () => {
      const str = renderToString(
        <select value="bar" onChange={() => {}}>
          {options}
        </select>
      );
      expect(str).toBe('<select value="bar"><option value="foo" id="foo">Foo</option><option value="bar" id="bar">Bar</option></select>');
    });

    it('a select value overriding defaultValue', () => {
      const str = renderToString(
        <select value="bar" defaultValue="baz" readOnly={true}>
          {options}
        </select>
      );
      expect(str).toBe('<select value="bar" readOnly><option value="foo" id="foo">Foo</option><option value="bar" id="bar">Bar</option></select>');
    });

    it('a select option with flattened children', () => {
      const str = renderToString(
        <select value="bar">
          <option value="bar">A {'B'}</option>
        </select>
      );
      expect(str).toBe('<select value="bar"><option value="bar">A <!--|-->B</option></select>');
    });
  });

  describe('textarea', function() {
    it('a textarea with an onChange', () => {
      const str = renderToString(
        <textarea onChange={() => {}} />
      );
      expect(str).toBe('<textarea></textarea>');
    });

    it('a textarea with and readOnly', () => {
      const str = renderToString(
        <textarea readOnly={true} />
      );
      expect(str).toBe('<textarea readOnly></textarea>');
    });

    it('a textarea with a value and no onChange/readOnly', () => {
      const str = renderToString(
        <textarea />
      );
      expect(str).toBe('<textarea></textarea>');
    });
  });

  describe('progress', function() {
    it('prop with null value', () => {
      const str = renderToString(
        <progress value={null} />
      );
      expect(str).toBe('<progress></progress>');
    });

    it('prop with number value', () => {
      const str = renderToString(
        <progress value={50} />
      );
      expect(str).toBe('<progress value="50"></progress>');
    });
  });
});
