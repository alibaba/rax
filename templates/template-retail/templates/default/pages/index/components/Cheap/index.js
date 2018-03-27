import { PropTypes, Component, createElement } from 'rax';
import { View, Text, RecyclerView } from 'rax-components';
import style from './style';
import { Convert as convert } from '../../mods/util.js';
import OpenUrl from '../../mods/openUrl';
import CheapOffer from './offer';

export default class Cheap extends Component {
  static propsTypes = {
    sourceData: PropTypes.object
  }

  static defaultProps = {
    sourceData: {}
  }

  render() {
    const { sourceData } = this.props;
    if (!sourceData.title) {
      return null;
    }
    if ((sourceData.offers || []).length < 3) {
      return null;
    }

    if (sourceData.offers[0].simpleSubject === undefined &&
      sourceData.offers[1].simpleSubject === undefined &&
      sourceData.offers[2].simpleSubject === undefined
    ) {
      return null;
    }

    const moreUrl = sourceData.moreUrl;

    return (
      [<RecyclerView.Cell onDisappear={this.onDisappear}>
        {sourceData.moreUrl ?
          <OpenUrl style={style.titleContainer} url={moreUrl}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>{sourceData.title}</Text>
            {sourceData.moreUrl &&
                    <View style={style.moreUrl}>
                      <Text style={{fontSize: 24, color: '#666666', marginRight: 8}}>更多</Text>

                    </View>
            }
          </OpenUrl> :
          <View style={style.titleContainer}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>{sourceData.title}</Text>
          </View>
        }
      </RecyclerView.Cell>,
      <RecyclerView.Cell style={style.offerContainer}>
        {
          (sourceData.offers || []).slice(0, 3).map((item, index) => {
            let offerData = convert(item);
            return (<View><CheapOffer offerData={offerData} key={index} /></View>);
          })
        }
      </RecyclerView.Cell>]
    );
  }
}
