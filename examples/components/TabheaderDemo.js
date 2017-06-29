import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import ScrollView from 'rax-scrollview';
import TouchableOpacity from 'rax-touchable';
import TabHeader from 'rax-tabheader';

var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

function renderItem(item, index) {
  return <View style={styles.item}><Text style={styles.text}>{item}</Text></View>;
}
function renderSelect(item, index) {
  return <View style={styles.select}><Text style={styles.text}>{item}</Text></View>;
}

class TabheaderDemo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      top: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.refs.tabheader.select(1);
    }, 1000);
  }

  onPress = (index) => {
    console.log('onPress', index);
  }

  onSelect = (index) => {
    console.log('onSelect', index);
  }

  onSelected = (index) => {
    console.log('onSelected', index);
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <TabHeader
            id="tabheader"
            ref="tabheader"
            style={styles.tabheader}
            dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8']}
            renderItem={renderItem}
            renderSelect={renderSelect}
            onPress={this.onPress}
            onSelected={this.onSelected}
            selected={0}
            itemWidth="166rem"
            dropDownCols={4}
            type={'dropDown-border-scroll'}
          />
          <View style={{height: 50}} />
          <TabHeader
            style={styles.tabheader}
            dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5']}
            renderItem={renderItem}
            renderSelect={renderSelect}
            onPress={this.onPress}
            selected={0}
            type={'normal-border'}
            itemSelectedStyle={{
              color: 'green'
            }}
            runningBorderStyle={{
              borderColor: 'green'
            }}
          />
          <View style={{height: 50}} />
          <TabHeader
            style={styles.tabheader}
            dataSource={[
              {text: 'tab1', icon: base64Icon},
              {text: 'tab2', icon: base64Icon},
              {text: 'tab3', icon: base64Icon},
              {text: 'tab4', icon: base64Icon},
              {text: 'tab5', icon: base64Icon},
              {text: 'tab6', icon: base64Icon},
              {text: 'tab7', icon: base64Icon},
              {text: 'tab8', icon: base64Icon},
              {text: 'tab9', icon: base64Icon}
            ]}
            containerStyle={{
              backgroundColor: '#ededed',
            }}
            renderItem={renderItem}
            renderSelect={renderSelect}
            onPress={this.onPress}
            selected={1}
            itemWidth="233rem"
            type={'icon-bg-scroll'}
            runningBgStyle={{
              backgroundColor: '#dddddd'
            }}
          />
          <View style={{height: 50}} />
          <TabHeader
            style={styles.tabheader}
            dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8', 'tab9']}
            renderItem={renderItem}
            renderSelect={renderSelect}
            onPress={this.onPress}
            selected={5}
            type={'default-anim-scroll'}
            itemWidth="233rem"
          />
        </View>
      </View>
    );
  }
}

let styles = {
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tabheader: {
  },
  item: {
    textAlign: 'center',
    fontSize: 28,
    height: '80rem',
    width: '233rem',
    backgroundColor: '#52bfe6',
    color: '#FFFFFF',
    position: 'relative'
  },
  select: {
    textAlign: 'center',
    fontSize: 28,
    height: '80rem',
    width: '233rem',
    backgroundColor: '#ff4200',
    color: '#FFFFFF',
    position: 'relative'
  },
  text: {
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
  }
};

export default TabheaderDemo;
