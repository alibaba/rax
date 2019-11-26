/* @jsx createElement */

import {createElement} from 'rax';
import {renderToString} from '../index';

describe('url', () => {
  it('a http link with the word javascript in it', () => {
    const str = renderToString(
      <a href="http://javascript:0/thisisfine">Click me</a>
    );
    expect(str).toBe('<a href="http://javascript:0/thisisfine">Click me</a>');
  });

  it('a javascript protocol href', () => {
    const str = renderToString(
      <div>
        <a href="javascript:notfine">p0wned</a>
        <a href="javascript:notfineagain">p0wned again</a>
      </div>,
    );
    expect(str).toBe('<div><a href="javascript:notfine">p0wned</a><a href="javascript:notfineagain">p0wned again</a></div>');
  });

  it('a javascript protocol with leading spaces', () => {
    const str = renderToString(
      <a href={'  \t \u0000\u001F\u0003javascript\n: notfine'}>p0wned</a>,
    );
    expect(str).toBe('<a href="  \t \u0000\u001F\u0003javascript\n: notfine">p0wned</a>');
  });

  it('a javascript protocol with intermediate new lines and mixed casing', () => {
    const str = renderToString(
      <a href={'\t\r\n Jav\rasCr\r\niP\t\n\rt\n:notfine'}>p0wned</a>,
    );
    expect(str).toBe('<a href="\t\r\n Jav\rasCr\r\niP\t\n\rt\n:notfine">p0wned</a>');
  });

  it('a javascript protocol area href', () => {
    const str = renderToString(
      <map>
        <area href="javascript:notfine" />
      </map>,
    );
    expect(str).toBe('<map><area href="javascript:notfine"></map>');
  });

  it('a javascript protocol form action', () => {
    const str = renderToString(
      <form action="javascript:notfine">p0wned</form>
    );
    expect(str).toBe('<form action="javascript:notfine">p0wned</form>');
  });

  it('a javascript protocol button formAction', () => {
    const str = renderToString(
      <input formAction="javascript:notfine" />
    );
    expect(str).toBe('<input formAction="javascript:notfine">');
  });

  it('a javascript protocol input formAction', () => {
    const str = renderToString(
      <button formAction="javascript:notfine">p0wned</button>,
    );
    expect(str).toBe('<button formAction="javascript:notfine">p0wned</button>');
  });
});
