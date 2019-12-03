const postcss = require('postcss');
const postcssRpxToVw = require('..');

describe('postcssRpxToVw', () => {
  it('should work simple example', () => {
    const input = `
.a {
  margin: -10rpx .5vh;
  padding: 5vmin 9.5rpx 1rpx;
  border: 3rpx solid black;
  border-bottom-width: 1rpx;
  font-size: 14rpx;
  line-height: 20rpx;
}

.b {
  border: 1rpx solid black;
  margin-bottom: 1rpx;
  font-size: 20rpx;
  line-height: 30rpx;
}

@media (min-width: 750rpx) {
  .c {
    font-size: 16rpx;
    line-height: 22rpx;
  }
}    
    `;
    const output = `
.a {
  margin: -1.33333vw .5vh;
  padding: 5vmin 1.26667vw 0.13333vw;
  border: 0.4vw solid black;
  border-bottom-width: 0.13333vw;
  font-size: 1.86667vw;
  line-height: 2.66667vw;
}

.b {
  border: 0.13333vw solid black;
  margin-bottom: 0.13333vw;
  font-size: 2.66667vw;
  line-height: 4vw;
}

@media (min-width: 100vw) {
  .c {
    font-size: 2.13333vw;
    line-height: 2.93333vw;
  }
}    
    `;

    const processed = postcss(postcssRpxToVw()).process(input).css;
    expect(processed).toBe(output);
  });

  it('should change viewportWidth from options', () => {
    const input = '.box { width: 100rpx; height: 200rpx; }';
    const output = '.box { width: 10vw; height: 20vw; }';

    const processed = postcss(postcssRpxToVw({
      viewportWidth: 1000
    })).process(input).css;
    expect(processed).toBe(output);
  });

  it('should change unitPrecision from options', () => {
    const input = '.box { width: 100rpx; height: 200rpx; }';
    const output = '.box { width: 13.33vw; height: 26.67vw; }';

    const processed = postcss(postcssRpxToVw({
      unitPrecision: 2
    })).process(input).css;
    expect(processed).toBe(output);
  });

  it('should not transform px', () => {
    const input = '.box { width: 100px; height: 100px; }';
    const output = '.box { width: 100px; height: 100px; }';

    const processed = postcss(postcssRpxToVw()).process(input).css;
    expect(processed).toBe(output);
  });

  it('should transform 0rpx to 0', () => {
    const input = '.box { width: 0rpx; }';
    const output = '.box { width: 0; }';

    const processed = postcss(postcssRpxToVw()).process(input).css;
    expect(processed).toBe(output);
  });

  it('should not transform media when not rpx', () => {
    const input = '@media (min-width: 750px) {}';
    const output = '@media (min-width: 750px) {}';

    const processed = postcss(postcssRpxToVw()).process(input).css;
    expect(processed).toBe(output);
  });
});
