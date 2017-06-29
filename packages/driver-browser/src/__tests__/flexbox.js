import flexbox from '../flexbox';

describe('flexbox', () => {
  it('convert flex style to polyfill', () => {
    expect(flexbox.isFlexProp('flex')).toEqual(true);
    expect(flexbox.isFlexProp('display')).toEqual(true);

    expect(Boolean(flexbox.isFlexProp('border'))).toEqual(false);


    expect(flexbox.display('flex', {})).toEqual({
      display: ['-webkit-box', '-webkit-flex', 'flex']
    });

    expect(flexbox.flex(1)).toEqual({
      flex: 1,
      webkitBoxFlex: 1,
      webkitFlex: 1,
    });

    expect(flexbox.flexWrap('wrap')).toEqual({
      flexWrap: 'wrap'
    });

    expect(flexbox.alignItems('flex-start')).toEqual({
      alignItems: 'flex-start',
      webkitAlignItems: 'flex-start',
      webkitBoxAlign: 'start',
    });

    expect(flexbox.alignSelf('wrap')).toEqual({
      webkitAlignSelf: 'wrap',
      alignSelf: 'wrap'
    });

    expect(flexbox.flexDirection('row')).toEqual({
      webkitBoxOrient: 'horizontal',
      webkitFlexDirection: 'row',
      flexDirection: 'row'
    });

    expect(flexbox.justifyContent('flex-start')).toEqual({
      justifyContent: 'flex-start',
      webkitJustifyContent: 'flex-start',
      webkitBoxPack: 'start'
    });
  });
});
