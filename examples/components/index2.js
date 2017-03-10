import {createElement, Component, render} from 'rax';
import {View, Text, ScrollView} from 'rax-components';
import CalendarDemo from './CalendarDemo';
import CountdownDemo from './CountdownDemo';
import GotopDemo from './GotopDemo';
import GridDemo from './GridDemo';
import IconDemo from './IconDemo';
import ModalDemo from './ModalDemo';
import MultirowDemo from './MultirowDemo';
import PictureDemo from './PictureDemo';
import PlayerDemo from './PlayerDemo';
import TabbarDemo from './TabbarDemo';
import TabheaderDemo from './TabheaderDemo';

class Page extends Component {
  render() {
    return (
      <ScrollView ref={(scrollview) => {
        this.scrollview = scrollview;
      }
      }>
        <View>
          <Text style={styles.title}>Gotop</Text>
          <GotopDemo onTop={() => {
            this.scrollview.scrollTo({y: 0});
          }} />
        </View>

        <View>
          <Text style={styles.title}>Tabheader</Text>
          <TabheaderDemo />
        </View>

        <View>
          <Text style={styles.title}>Calendar</Text>
          <CalendarDemo />
        </View>

        <View>
          <Text style={styles.title}>Countdown</Text>
          <CountdownDemo />
        </View>

        <View>
          <Text style={styles.title}>Grid</Text>
          <GridDemo />
        </View>

        <View>
          <Text style={styles.title}>Icon</Text>
          <IconDemo />
        </View>

        <View>
          <Text style={styles.title}>Modal</Text>
          <ModalDemo />
        </View>

        <View>
          <Text style={styles.title}>Multirow</Text>
          <MultirowDemo />
        </View>

        <View>
          <Text style={styles.title}>Picture</Text>
          <PictureDemo />
        </View>

        <View>
          <Text style={styles.title}>Player</Text>
          <PlayerDemo />
        </View>

      </ScrollView>
    );
  }
}

let styles = {
  title: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingLeft: 20,
    fontSize: 40,
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
};

render(<Page />);
