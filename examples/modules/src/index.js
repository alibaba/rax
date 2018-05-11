import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import ScrollView from 'rax-scrollview';

import FontFaceDemo from './FontFaceDemo';
import WindowDemo from './WindowDemo';
import Base64Demo from './Base64Demo';
import ScreenDemo from './ScreenDemo';
import DocumentDemo from './DocumentDemo';
import TimersDemo from './TimersDemo';
import NavigatorDemo from './NavigatorDemo';
import PerformanceDemo from './PerformanceDemo';
import FetchDemo from './FetchDemo';
import URLDemo from './URLDemo';
import URLSearchParamsDemo from './URLSearchParamsDemo';
import LocationDemo from './LocationDemo';
import EnvDemo from './EnvDemo';
import JsonpDemo from './JsonpDemo';
import PlatformDemo from './PlatformDemo';
import ToastDemo from './ToastDemo';
import WebSocketDemo from './WebSocketDemo';

class Page extends Component {
  render() {
    return <ScrollView>
      <View>
        <Text style={styles.title}>FontFace</Text>
        <FontFaceDemo />
      </View>

      <View>
        <Text style={styles.title}>WebSocket</Text>
        <WebSocketDemo />
      </View>

      <View>
        <Text style={styles.title}>window</Text>
        <WindowDemo />
      </View>

      <View>
        <Text style={styles.title}>Timers</Text>
        <TimersDemo />
      </View>

      <View>
        <Text style={styles.title}>Base 64</Text>
        <Base64Demo />
      </View>

      <View>
        <Text style={styles.title}>screen</Text>
        <ScreenDemo />
      </View>

      <View>
        <Text style={styles.title}>document</Text>
        <DocumentDemo />
      </View>

      <View>
        <Text style={styles.title}>navigator</Text>
        <NavigatorDemo />
      </View>

      <View>
        <Text style={styles.title}>performance</Text>
        <PerformanceDemo />
      </View>

      <View>
        <Text style={styles.title}>fetch</Text>
        <FetchDemo />
      </View>

      <View>
        <Text style={styles.title}>URL</Text>
        <URLDemo />
      </View>

      <View>
        <Text style={styles.title}>URLSearchParams</Text>
        <URLSearchParamsDemo />
      </View>

      <View>
        <Text style={styles.title}>location</Text>
        <LocationDemo />
      </View>

      <View>
        <Text style={styles.title}>universal-env</Text>
        <EnvDemo />
      </View>

      <View>
        <Text style={styles.title}>universal-jsonp</Text>
        <JsonpDemo />
      </View>

      <View>
        <Text style={styles.title}>universal-platform</Text>
        <PlatformDemo />
      </View>

      <View>
        <Text style={styles.title}>universal-toast</Text>
        <ToastDemo />
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
