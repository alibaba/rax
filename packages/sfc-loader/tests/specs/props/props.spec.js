import { render, createElement } from 'rax';

describe('declear props', () => {
  it('by Array<string>', () => {
    const SimpleProps = require('./simple-props').default;
    const div = document.createElement('div');
    render(createElement(SimpleProps, { foo: 'foo', bar: 'bar' }), div);
    document.body.appendChild(div);

    expect(div.innerText).to.equal('foo-bar');
  });

  it('by Object with default val', () => {
    const SimpleProps = require('./object-props').default;
    const div = document.createElement('div');
    render(createElement(SimpleProps, { foo: 'foo' }), div);
    document.body.appendChild(div);

    expect(div.innerText).to.equal('foo-bar');
  });
});
