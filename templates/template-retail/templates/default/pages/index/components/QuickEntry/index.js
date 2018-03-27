import { Component, PropTypes, createElement } from 'rax';
import { View, Text, Image, RecyclerView } from 'rax-components';
import OpenUrl from '../../mods/openUrl';
import style from './style';

const QuickEntry = function(props) {
  let sourceData = props.sourceData;
  if (sourceData.length === 0) {
    return null;
  }
  return (
    <RecyclerView.Cell style={style.container}>
      {sourceData.map(getEntryItem)}
    </RecyclerView.Cell>
  );
};

function getEntryItem(item = {}) {
  if (!item.appImg) return null;

  const appUrl = item.appUrl;
  return (
    <OpenUrl style={style.item} url={appUrl}>
      <View>
        <Image source={{uri: item.appImg}} style={style.image} />
        <Text style={style.text}>{item.title}</Text>
      </View>
    </OpenUrl>
  );
}

QuickEntry.propTypes = {
  sourceData: PropTypes.array
};

QuickEntry.defaultProps = {
  sourceData: []
};

export default QuickEntry;