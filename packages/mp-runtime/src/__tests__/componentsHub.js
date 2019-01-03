import { registerComponent, getComponent } from '../componentsHub';

const Component = Symbol('COMPONENT');

describe('componentsHub', () => {
  it('should register a component and get right', () => {
    const componentPath = 'path/to/component';
    registerComponent(componentPath, Component);

    expect(getComponent(componentPath)).toBe(Component);
  });
});
