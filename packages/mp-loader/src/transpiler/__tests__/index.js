const transpiler = require('..');

describe('transpiler', () => {
  it('transform', () => {
    const content = `
      <view></view>
    `;
    const result = transpiler(content, {
      templatePath: __filename,
    });

    expect(result).toMatchSnapshot();
  });
});
