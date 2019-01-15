import createTextElement from '../createTextElement';

describe('createTextElement', () => {
  it('should get a string', () => {
    expect(createTextElement('hello'))
      .toEqual('hello');
  });

  it('should transform to string', () => {
    const arr = [0, 1, 2];
    expect(createTextElement(arr))
      .toEqual(arr.toString());
  });
});
