import { parse } from '../../parser';
import { generate } from '../';
import { baseOptions } from '../../options';

function assertCodegen(template) {
  const ast = parse(template, baseOptions);
  const generated = generate(ast, baseOptions);
  expect(generated.render).toMatchSnapshot();
  return generated;
}

describe('codegen', () => {
  it('generate template', () => {
    assertCodegen('<view></view>');
  });

  it('v-bind', () => {
    assertCodegen('<view foo="bar" :foo="bar"><text>hello world</text></view>');
  });

  it('v-for', () => {
    assertCodegen(
      '<view v-for="(item, index) in foo"></view>'
    );
  });

  it('v-if', () => {
    assertCodegen(
      '<view v-if="foo"></view>'
    );

    assertCodegen(
      '<view><view v-if="show">hello</view><view v-else>world</view></view>'
    );
  });

  it('generate ref', () => {
    assertCodegen(
      '<view ref="ref"></view>'
    );
  });

  it('generate template tag', () => {
    assertCodegen(
      '<view><template><text>{{hello}}</text></template></view>',
    );
  });

  it('generate single slot', () => {
    assertCodegen(
      '<view><slot></slot></view>',
    );
  });


  it('generate named slot', () => {
    assertCodegen(
      '<view><slot name="one"></slot></view>'
    );
  });

  it('generate slot fallback content', () => {
    assertCodegen(
      '<view><slot><view>hi</view></slot></view>'
    );
  });

  it('generate slot target', () => {
    assertCodegen(
      '<view slot="one">hello world</view>'
    );
  });

  it('generate scoped slot', () => {
    assertCodegen(
      '<foo><template slot-scope="bar">{{ bar }}</template></foo>'
    );
    assertCodegen(
      '<foo><view slot-scope="bar">{{ bar }}</view></foo>'
    );
  });

  it('v-key', () => {
    assertCodegen(
      '<view :key="bar"></view>'
    );
  });

  describe('events', () => {
    it('bind prop', () => {
      assertCodegen(`
        <view>
          <view @click="handleClick"></view>
          <view v-on:click="handleClick"></view>
        </view>
      `);
    });
  });
});
