import QuerySelector from '../../src/tree/query-selector';

const querySelector = new QuerySelector();

function toArray(list) {
  return Array.prototype.slice.apply(list);
}

function getExtra(document) {
  return {
    idMap: {
      bb: document.getElementById('bb'),
      bb4: document.getElementById('bb4'),
    },
    tagMap: {
      DIV: toArray(document.getElementsByTagName('div')),
      SPAN: toArray(document.getElementsByTagName('span')),
      HEADER: toArray(document.getElementsByTagName('header')),
      FOOTER: toArray(document.getElementsByTagName('footer')),
    },
    classMap: {
      aa: toArray(document.getElementsByClassName('aa')),
      bb: toArray(document.getElementsByClassName('bb')),
      bb1: toArray(document.getElementsByClassName('bb1')),
      bb2: toArray(document.getElementsByClassName('bb2')),
      bb3: toArray(document.getElementsByClassName('bb3')),
      bb4: toArray(document.getElementsByClassName('bb4')),
    },
  };
}

test('query-selector: parse selector', () => {
  // 标签选择器
  expect(querySelector.parse('tag')).toEqual([{tag: 'tag'}]);

  // id 选择器
  expect(querySelector.parse('#id')).toEqual([{tag: '*', id: 'id'}]);

  // 类选择器
  expect(querySelector.parse('.class')).toEqual([{tag: '*', class: ['class']}]);
  expect(querySelector.parse('.class1.class2')).toEqual([{tag: '*', class: ['class1', 'class2']}]);

  // 亲属选择器
  expect(querySelector.parse('a b')).toEqual([{tag: 'a', kinship: ' '}, {tag: 'b'}]);
  expect(querySelector.parse('a > b')).toEqual([{tag: 'a', kinship: '>'}, {tag: 'b'}]);
  expect(querySelector.parse('a + b')).toEqual([{tag: 'a', kinship: '+'}, {tag: 'b'}]);

  // 基本组合
  expect(querySelector.parse('tag #id .class')).toEqual([
    {tag: 'tag', kinship: ' '},
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class']},
  ]);
  expect(querySelector.parse('tag#id.class1.class2')).toEqual([{tag: 'tag', id: 'id', class: ['class1', 'class2']}]);

  // 伪类选择器
  expect(querySelector.parse('#id .class:pseudo-class')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'pseudo-class'}]}
  ]);
  expect(querySelector.parse('#id .class:pseudo-class(1)')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'pseudo-class', param: '1'}]}
  ]);
  expect(querySelector.parse('#id .class:first-child')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'first-child'}]}
  ]);
  expect(querySelector.parse('#id .class:last-child')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'last-child'}]}
  ]);
  expect(querySelector.parse('#id .class:nth-child(3)')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'nth-child', param: {a: 0, b: 3}}]}
  ]);
  expect(querySelector.parse('#id .class:nth-child(2n+1)')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'nth-child', param: {a: 2, b: 1}}]}
  ]);
  expect(querySelector.parse('#id .class:nth-child(2n-1)')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], pseudo: [{name: 'nth-child', param: {a: 2, b: -1}}]}
  ]);

  // 属性选择器
  expect(querySelector.parse('#id .class[name=value]')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], attr: [{name: 'name', opr: '=', val: 'value'}]}
  ]);
  expect(querySelector.parse('#id .class[name^=value]')).toEqual([
    {tag: '*', id: 'id', kinship: ' '},
    {tag: '*', class: ['class'], attr: [{name: 'name', opr: '^=', val: 'value'}]}
  ]);
});
