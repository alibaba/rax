import Text from '../Text';
import { TEXT_NODE } from '../NodeTypes';

describe('Text', () => {
  it('type', () => {
    const text = new Text('hello');
    expect(text.nodeType).toEqual(TEXT_NODE);
  });

  it('textContent', () => {
    const text = new Text('hello');
    expect(text.data).toEqual('hello');
    expect(text.textContent).toEqual('hello');

    text.textContent = 'world';
    expect(text.data).toEqual('world');
  });
});
