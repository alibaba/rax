import renderSlot from '../renderSlot';

const viewModel = {
  $slots: {
    default: Symbol('defaultSlot'),
    foo: Symbol('foo'),
  },
};
describe('renderSlot', () => {
  it('should render default slot', () => {
    expect(renderSlot(viewModel)).toEqual(viewModel.$slots.default);
  });

  it('should render named slot', () => {
    expect(renderSlot(viewModel, 'foo')).toEqual(viewModel.$slots.foo);
  });

  it('should render empty slot', () => {
    expect(renderSlot(viewModel, 'notExists')).toBeFalsy();
  });

  it('should render component default slot', () => {
    expect(
      renderSlot({ $slots: {} }, 'default', 'defaultSlot')
    ).toEqual('defaultSlot');
    expect(
      renderSlot({ $slots: { default: 'someValue'} }, 'default', 'defaultSlot')
    ).toEqual('someValue');
  });
});
