import {createElement, Component} from 'universal-rx';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div style={styles.app}>
        <div style={styles.appHeader}>
          <h2>Welcome to Rx</h2>
        </div>
        <p style={styles.appIntro}>
          To get started, edit src/App.js and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
