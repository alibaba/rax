import flattenStyle from '../flattenStyle';

describe('flattenStyle', () => {
  it('should merge objects', () => {
    const style1 = {
      width: 20
    };
    const style2 = {
      height: 50
    };
    const flatStyle = flattenStyle([style1, style2]);
    expect(flatStyle.width).toBe(20);
    expect(flatStyle.height).toBe(50);
  });

  it('should override before style properties', () => {
    const style1 = {
      width: 50,
      height: 60
    };
    const style2 = {
      width: 20,
      height: 10
    };
    const flatStyle = flattenStyle([style1, style2]);
    expect(flatStyle.width).toBe(20);
    expect(flatStyle.height).toBe(10);
  });
});
