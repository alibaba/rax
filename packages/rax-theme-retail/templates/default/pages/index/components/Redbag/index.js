import { createElement, PropTypes } from 'rax';
import { RecyclerView, Image } from 'rax-components';
import OpenUrl from '../../mods/openUrl';
import style from './style';

export default function Redbag(props) {
  const dataSource = props.sourceData[0];
  if (!dataSource || !dataSource.appImg) {
    return null;
  }

  const appUrl = dataSource.appUrl;

  return (
    <OpenUrl component={RecyclerView.Cell} style={style.container} url={appUrl}>
      <Image source={{uri: dataSource.appImg}} style={style.image} />
    </OpenUrl>
  );
}

Redbag.propTypes = {
  sourceData: PropTypes.array
};

Redbag.defaultProps = {
  sourceData: []
};