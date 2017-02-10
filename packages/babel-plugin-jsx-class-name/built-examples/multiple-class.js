import class_name_styles1 from 'foo.css';

class App extends Component {
  render() {
    return <div style={[class_name_styles.foo1, class_name_styles.foo2]} />;
  }
}
let class_name_styles = class_name_styles1;