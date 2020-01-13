import { createElement, render } from 'rax';
import createDriver from '..';

const JS_TO_DART = '__kraken_js_to_dart__';
const DART_TO_JS = '__kraken_dart_to_js__';

describe('Driver', function() {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should works', () => {
    const logs = [];
    global[JS_TO_DART] = function(message) {
      logs.push(message);
    };
    global[DART_TO_JS] = () => { };

    render(createElement('div', { foo: 'bar' }), null, {
      driver: createDriver(),
    });

    expect(logs).toEqual([
      JSON.stringify([
        'createElement',
        [
          {
            'type': 'DIV',
            'id': 2,
            'props': {
              'foo': 'bar'
            },
          }
        ]
      ]),
      JSON.stringify(['insertAdjacentNode', [-1, 'beforeend', 2]])
    ]);
  });
});
