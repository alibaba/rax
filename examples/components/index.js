import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import ScrollView from 'rax-scrollview';

import StyleDemo from './StyleDemo';
import ViewDemo from './ViewDemo';
import ScrollViewDemo from './ScrollViewDemo';
import RefreshControlDemo from './RefreshControlDemo';
import ImageDemo from './ImageDemo';
import VideoDemo from './VideoDemo';
import TextInputDemo from './TextInputDemo';
import TextDemo from './TextDemo';
import ButtonDemo from './ButtonDemo';
import SwitchDemo from './SwitchDemo';
import ListViewDemo from './ListViewDemo';
import RecyclerViewDemo from './RecyclerViewDemo';
import WaterfallDemo from './WaterfallDemo';
import LinkDemo from './LinkDemo';
import TouchableHighlightDemo from './TouchableHighlightDemo';
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
import SliderDemo from './SliderDemo';
import TableDemo from './TableDemo';

class Page extends Component {
  render() {
    return <ScrollView ref={(scrollview) => {
      this.scrollview = scrollview;
    }}>
      <View>
        <Text style={styles.title}>Style</Text>
        <StyleDemo />
      </View>

      <View>
        <Text style={styles.title}>View</Text>
        <ViewDemo />
      </View>

      <View>
        <Text style={styles.title}>Text</Text>
        <TextDemo />
      </View>

      <View>
        <Text style={styles.title}>Link</Text>
        <LinkDemo />
      </View>

      <View>
        <Text style={styles.title}>TouchableHiglight</Text>
        <TouchableHighlightDemo />
      </View>

      <View>
        <Text style={styles.title}>Button</Text>
        <ButtonDemo />
      </View>

      <View>
        <Text style={styles.title}>Image</Text>
        <ImageDemo />
      </View>

      <View>
        <Text style={styles.title}>Video</Text>
        <VideoDemo />
      </View>

      <View>
        <Text style={styles.title}>Switch</Text>
        <SwitchDemo />
      </View>

      <View>
        <Text style={styles.title}>TextInput</Text>
        <TextInputDemo />
      </View>

      <View>
        <Text style={styles.title}>ScrollView</Text>
        <ScrollViewDemo />
      </View>

      <View>
        <Text style={styles.title}>RecyclerView</Text>
        <RecyclerViewDemo />
      </View>

      <View>
        <Text style={styles.title}>ListView</Text>
        <ListViewDemo />
      </View>

      <View>
        <Text style={styles.title}>Waterfall</Text>
        <WaterfallDemo />
      </View>

      <View>
        <Text style={styles.title}>RefreshControl</Text>
        <RefreshControlDemo />
      </View>

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

      <View>
        <Text style={styles.title}>Slider</Text>
        <SliderDemo />
      </View>

      <View>
        <Text style={styles.title}>Table</Text>
        <TableDemo />
      </View>

    </ScrollView>;
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
