import getBabelConfig from '../getBabelConfig';

jest.mock('fs');
describe('getBabelConfig', () => {
  it('should get babel config', () => {
    expect(getBabelConfig({
      babel: {
        presets: ['rax']
      }
    })).toEqual({
      presets: ['rax']
    });
  });

  it('should read .babelrc when no babel query', () => {
    expect(getBabelConfig({})).toEqual({
      presets: ['rax']
    });
  });
});
