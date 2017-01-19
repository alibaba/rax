import {createElement, Component, render} from 'rax';
import {View, Text, ScrollView} from 'rax-components';
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
import LinkDemo from './LinkDemo';
import TouchableHighlightDemo from './TouchableHighlightDemo';

class Page extends Component {
  render() {
    return <ScrollView>
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
        <Text style={styles.title}>RefreshControl</Text>
        <RefreshControlDemo />
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
