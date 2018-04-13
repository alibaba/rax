import { createElement, PropTypes } from 'rax';
import { View, Text, Image } from 'rax-components';
import { getRandomValue } from '../../mods/util.js';
import OpenUrl from '../../mods/openUrl';

const style = {
  container: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 26,
    paddingRight: 14,
    height: 268,
    backgroundColor: '#fff',
    position: 'relative'
  },
  text: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 28,
    lineHeight: 40,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  subTitle: {
    fontSize: 22,
    lineHeight: 30,
    color: '#999',
    maxWidth: 143,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  image: {
    position: 'absolute',
    right: 22,
    bottom: 20,
    width: 146,
    height: 146
  }

};

function rowCell(props) {
  let dataSource = props.dataSource || {};
  if (dataSource.title) {
    return (
      <OpenUrl style={[style.container, props.style]} url={dataSource.appUrl}>
        <View style={style.text}>
          <Text style={[style.title, props.textStyle]} numberOfLines="1">{dataSource.title}</Text>
          <Text style={[style.subTitle, props.textStyle]} numberOfLines="1">{dataSource.subTitle}</Text>
        </View>
        <Image style={style.image} source={{uri: getRandomValue(dataSource.offers).picUrlOf290x290}}
          resizeMode="cover" />
      </OpenUrl>
    );
  } else {
    return null;
  }
}

rowCell.propTypes = {
  dataSource: PropTypes.object,
  textStyle: PropTypes.object
};

rowCell.defaultProps = {
  dataSource: {}
};

export default rowCell;