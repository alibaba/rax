import mock from '../../renderMock';

import parser from '../../src/tree/parser';

function getTokenizeResult(content) {
  const startStack = [];
  const endStack = [];
  const textStack = [];

  parser.tokenize(content, {
    start(tagName, attrs, unary) {
      startStack.push({tagName, attrs, unary});
    },
    end(tagName) {
      endStack.push(tagName);
    },
    text(content) {
      content = content.trim();
      if (content) textStack.push(content);
    },
  });

  return {startStack, endStack, textStack};
}

test('tokenize html', () => {
  const res1 = getTokenizeResult('<div><br/></div>');
  expect(res1.startStack.length).toBe(2);
  expect(res1.endStack.length).toBe(1);
  expect(res1.textStack.length).toBe(0);
  expect(res1.startStack).toEqual([{tagName: 'div', attrs: [], unary: false}, {tagName: 'br', attrs: [], unary: true}]);
  expect(res1.endStack).toEqual(['div']);

  const res2 = getTokenizeResult(`
    <div><br/></div>
    <div id="a" class="xx">123123</div>
    <input id="b" type="checkbox" checked/>
    <div>
      <ul>
        <li><span>123</span></li>
        <li><span>321</span></li>
        <li><span>567</span></li>
      </ul>
    </div>
  `);
  expect(res2.startStack.length).toBe(12);
  expect(res2.endStack.length).toBe(10);
  expect(res2.textStack.length).toBe(4);
  expect(res2.startStack).toEqual([
    {tagName: 'div', attrs: [], unary: false},
    {tagName: 'br', attrs: [], unary: true},
    {tagName: 'div', attrs: [{name: 'id', value: 'a'}, {name: 'class', value: 'xx'}], unary: false},
    {tagName: 'input', attrs: [{name: 'id', value: 'b'}, {name: 'type', value: 'checkbox'}, {name: 'checked', value: undefined}], unary: true},
    {tagName: 'div', attrs: [], unary: false},
    {tagName: 'ul', attrs: [], unary: false},
    {tagName: 'li', attrs: [], unary: false},
    {tagName: 'span', attrs: [], unary: false},
    {tagName: 'li', attrs: [], unary: false},
    {tagName: 'span', attrs: [], unary: false},
    {tagName: 'li', attrs: [], unary: false},
    {tagName: 'span', attrs: [], unary: false}
  ]);
  expect(res2.endStack).toEqual(['div', 'div', 'span', 'li', 'span', 'li', 'span', 'li', 'ul', 'div']);
  expect(res2.textStack).toEqual(['123123', '123', '321', '567']);

  const res3 = getTokenizeResult(`
    <div>123</div>
    <script type="text/javascript">
      var msg = "hello world";
      console.log(msg);
    </script>
    <span>haha</span>
    <div>321</div>
  `);
  expect(res3.startStack.length).toBe(4);
  expect(res3.endStack.length).toBe(4);
  expect(res3.textStack.length).toBe(4);
  expect(res3.startStack).toEqual([
    {tagName: 'div', attrs: [], unary: false},
    {tagName: 'script', attrs: [{name: 'type', value: 'text/javascript'}], unary: false},
    {tagName: 'span', attrs: [], unary: false},
    {tagName: 'div', attrs: [], unary: false}
  ]);
  expect(res3.endStack).toEqual(['div', 'script', 'span', 'div']);
  expect(res3.textStack).toEqual(['123', 'var msg = "hello world";\n      console.log(msg);', 'haha', '321']);
});

test('parse html', () => {
  const res = parser.parse(mock.html);

  expect(res).toEqual([{
    type: 'element',
    tagName: 'div',
    attrs: [{name: 'class', value: 'aa'}],
    unary: false,
    children: [{
      type: 'element',
      tagName: 'div',
      attrs: [{name: 'id', value: 'bb'}, {name: 'class', value: 'bb'}],
      unary: false,
      children: [{
        type: 'element',
        tagName: 'header',
        attrs: [],
        unary: false,
        children: [{
          type: 'element',
          tagName: 'div',
          attrs: [{name: 'class', value: 'bb1'}],
          unary: false,
          children: [{type: 'text', content: '123'}]
        }, {
          type: 'element',
          tagName: 'div',
          attrs: [{name: 'class', value: 'bb2'}, {name: 'data-a', value: '123'}],
          unary: false,
          children: [{type: 'text', content: '321'}]
        }],
      }, {
        type: 'element',
        tagName: 'div',
        attrs: [{name: 'class', value: 'bb3'}],
        unary: false,
        children: [{type: 'text', content: 'middle'}],
      }, {
        type: 'element',
        tagName: 'footer',
        attrs: [],
        unary: false,
        children: [{
          type: 'element',
          tagName: 'span',
          attrs: [{name: 'id', value: 'bb4'}, {name: 'class', value: 'bb4'}, {name: 'data-index', value: '1'}],
          unary: false,
          children: [{type: 'text', content: '1'}],
        }, {
          type: 'element',
          tagName: 'span',
          attrs: [{name: 'class', value: 'bb4'}, {name: 'data-index', value: '2'}],
          unary: false,
          children: [{type: 'text', content: '2'}],
        }, {
          type: 'element',
          tagName: 'span',
          attrs: [{name: 'class', value: 'bb4'}, {name: 'data-index', value: '3'}],
          unary: false,
          children: [{type: 'text', content: '3'}],
        }],
      }, {
        type: 'element',
        tagName: 'div',
        attrs: [],
        unary: false,
        children: [{type: 'text', content: 'tail'}],
      }],
    }],
  }]);
});
