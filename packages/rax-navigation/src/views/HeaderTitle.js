/* @flow */

import { createElement, Component, PropTypes } from 'rax';
import StyleSheet from 'universal-stylesheet';
import Platform from 'universal-platform';
import Text from 'rax-text';

import type {
  Style,
} from '../TypeDefinition';

type Props = {
  tintColor?: ?string;
  style?: Style,
};

const HeaderTitle = ({ style, ...rest }: Props) => (
  <Text numberOfLines={1} {...rest} style={[styles.title, style]} />
);

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.OS === 'ios' ? 34 : 36,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginLeft: 32,
    marginRight: 32
  },
});

export default HeaderTitle;
