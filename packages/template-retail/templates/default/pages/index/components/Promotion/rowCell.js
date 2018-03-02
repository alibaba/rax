import { createElement, PropTypes } from 'rax';
import { View, Text, Image } from 'rax-components';
import { getRandomValue } from '../../mods/util.js';
import OpenUrl from '../../mods/openUrl';
import {
  percent
} from '../../mods/commonStyle';

const style = {
  container: {
    marginTop: 20,
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 26,
    width: percent(50),
    height: 200,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  text: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden'
  },
  title: {
    fontSize: 28,
    lineHeight: 40,
    fontWeight: 'bold'
  },
  imageSubTitle: {
    height: 28,
    marginTop: 8,
    paddingRight: 6,
    maxWidth: 170
  },
  subTitleWrapper: {
    height: 28,
    marginTop: 8,
    paddingRight: 8,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden'
  },
  border: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderStyle: 'solid',
    borderColor: '#DF2211',
    borderWidth: 1,
    height: 28,
    paddingRight: 6,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden'
  },
  subTitle: {
    fontSize: 20,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: '#DF2211',
    maxWidth: 150
  },
  image: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 160,
    height: 160
  },
  icons: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DF2211',
    position: 'absolute',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#fff',
    top: 7
  },
  leftIcon: {
    left: -11
  },
  rightIcon: {
    right: -11
  }
};

function rowCell(props) {
  const dataSource = props.dataSource || {};
  if (dataSource.title) {
    return (
      <OpenUrl style={[style.container, props.style]} url={dataSource.appUrl}>
        <View style={style.text}>
          <Text style={style.title}>{dataSource.title}</Text>
          <View style={style.subTitleWrapper}>
            <Text style={[style.subTitle, {
              opacity: 0
            }]} numberOfLines="1">
              {dataSource.subTitle}
            </Text>
            <View style={style.border}>
              <Text style={style.subTitle} numberOfLines="1">
                {dataSource.subTitle}
              </Text>
            </View>
            <View style={[style.icons, style.leftIcon]} />
            <View style={[style.icons, style.rightIcon]} />
          </View>
        </View>
        <Image style={style.image} source={{uri: getRandomValue(dataSource.offers).picUrlOf290x290}} resizeMode="cover" />
      </OpenUrl>
    );
  } else {
    return null;
  }
}

rowCell.propTypes = {
  dataSource: PropTypes.object,
  style: PropTypes.object,
  indexid: PropTypes.object
};

rowCell.defaultProps = {
  dataSource: {}
};

export default rowCell;