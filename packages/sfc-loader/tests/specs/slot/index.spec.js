import { renderSFCModule } from 'utils';

describe('slots', () => {
  it('should render slots and named slots', () => {
    const container = renderSFCModule(require('./parent'));
    expect(container.innerHTML).to.equal(
      '<div><header><h1>这里可能是一个页面标题</h1></header> <main> <p>主要内容的一个段落。</p> <p>另一个主要段落。</p> </main> <footer><p>这里有一些联系信息</p></footer></div>'
    );
  });
});
