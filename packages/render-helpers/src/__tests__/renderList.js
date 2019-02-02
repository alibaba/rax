import * as Rax from 'rax';
import setRender from '../setRender';
import renderList from '../renderList';
import createElement from '../createElement';

setRender(Rax);
function render(value, index) {
  return createElement('view', [value, index]);
}

describe('renderList', () => {
  it('should render list by number', () => {
    const el = renderList(5, render);
    expect(el).toMatchSnapshot();
  });

  it('should render list by string', () => {
    const el = renderList('hello world', render);
    expect(el).toMatchSnapshot();
  });

  it('should render list by array', () => {
    const el = renderList([0, 1, 2, 3, 4], render);
    expect(el).toMatchSnapshot();
  });

  it('should render list by object', () => {
    const el = renderList({
      a: 1,
      b: 2,
      c: 3,
    }, render);
    expect(el).toMatchSnapshot();
  });
});
