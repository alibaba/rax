
import * as elements from '../elements';

describe('elements', () => {
  it('img element', () => {
    const element = {
      type: 'img',
      props: {
        height: '100',
        width: '100'
      }
    };

    const component = elements[element.type].parse(element);

    expect(component.type).toBe('image');
    expect(component.props.height).toBe(undefined);
    expect(component.props.width).toBe(undefined);
    expect(component.props.style.height).toBe('100');
    expect(component.props.style.width).toBe('100');
  });

  it('block elements', () => {
    const blocks = ['section', 'footer', 'main', 'aside', 'nav'];

    blocks.forEach((block) => {
      const element = {
        type: block
      };
      const component = elements[element.type].parse(element);
      expect(component.type).toBe('div');
    });
  });

  it('video element', () => {
    const element = {
      type: 'video',
      props: {
        height: '100',
        width: '100',
        autoplay: true
      }
    };

    const component = elements[element.type].parse(element);

    expect(component.props.height).toBe(undefined);
    expect(component.props.width).toBe(undefined);
    expect(component.props.style.height).toBe('100');
    expect(component.props.style.width).toBe('100');
    expect(component.props.autoplay).toBe(true);
  });

  it('textarea element', () => {
    const element = {
      type: 'textarea',
      props: {
        placeholder: 'placeholder',
        disabled: true,
        autofocus: false,
        rows: 10,
        children: 'default value'
      }
    };

    const component = elements[element.type].parse(element);

    expect(component.props.value).toBe('default value');
    expect(component.props.children).toBe(null);
    expect(component.props.rows).toBe(10);
  });
});
