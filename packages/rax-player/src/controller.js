import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import TouchableHighlight from 'rax-touchable';
import Icon from 'rax-icon';

import Progress from './progress';

const playButtonImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAAz1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+oiJ5HAAAARHRSTlMAAQIDBAYHCAkLEBESFBUiIyYnKCkqOTo7PD9AQUJYWVtcX2FiY3x+f4CFhoiJi5qjpaatr7Cyx8jKz9Hk5unr9/n7/V5oMmcAAADoSURBVEjHldVrO0JBFMXxaY4uigqhiBAh5FYup3Lq+H//z+S9nqfW2q9/L2bP7L0mhDBJD4NewEfd0TCqOJr8JjE0ZGcFQ8O05WiY1B0NTxVHk18nhoasWzA0TA8cDeNdR8Nj2dHk/cTQkJ06GtJ9R6+2y4Z6KDua/CoaGn5OHA3pnqPhfdvRjBw92NL1S1U/92dDv5PZkf46i/Oov+WgqM/Ja1Wfwa+GPt+zY33TFr2o7+VtUd/5t5qeJ99NPdnmbT01lxdRz9i7kp7fa5pb0Wub+6fnHf0HXF5G8b/8hftSUGv4vKPSPzUd/ugvFZ/fAAAAAElFTkSuQmCC';
const pauseButtonImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAAVFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////8wXzyWAAAAG3RSTlMAAQoLDA4VFhgbHCUuNThCRExPVVaer8jV9fky2J+9AAAAXUlEQVRIS+3KSQ6AIBAF0Y8zqKDizP3v6aKVlkRv0LWsPAAAoBpDVQpcrmnqAklreFp41nEGk2j+B0/L1/3o81MPokWLFi1atGjs8W88W9ZdostppsbsdXtP09t7XKB8ZhFk+PxMAAAAAElFTkSuQmCC';
const fullScreenImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAABOFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8CSeP7AAAAZ3RSTlMAAQIDBAUGBwgKCw0PEBESFBYYGRocHR4jJCUvNTg5Oz0+P0BBSUpNTk9QVVhZXmFiY2doaWtwcXN5e3+Ag4WLj5GUlZidpaaoq62yur7AxcfIyszO09XZ2tze4uTm6e/x8/X3+fv9zYUdSQAAAd5JREFUGBntwYdWE0EAhtE/y5rEroBYEaUpRSEqimLDBsToKAhsojGoyPf+b+C2zM4snMMLeK/wLMo3hkf4NqpyTOMTJd0RWfcoEVYvSu2OK/eIMmG16/LMmkwXSxS2T+gI9Q6WcHwJdUh1m4JwtQKVhJs4hKdZkWfgEy7he1+RI/iIR8S+LmC9VqHyAet+BxAxoxms57LeYU0pAkTMSLexHiv3ir6DG1IE6DNgJF0/oO+SUk/o278qKYJthZtgFLuyT2ZUmQt7ZPYGFYv4e06q7mCUGNojtn9NfRd/kfhxVomIW4rVO0ap8z+hN6jC4G9g56RS0UulTjWVOd35fkau4T+YqjLrgTI15ep1+UY2BpSr6b/jDel4E8qN8kK+iUnlZpQZ2VXmDrAs1yzMKWMeKFHtRko1SCyosEhsSSnDvGJNIiWekplR3zKpFSUMTEkNiCRVVukbV+YluTcVSQYYExBJwRrWpFLDWOuBZIgJiBS2sOaUu4nVCmWICYhqW1hLsu5ibdUMMQG9NtaKHA2sdpeY8LyV5xk+4VqvyLeKRzhagUoqa7hEYSvUIUELh7DaNR0h/EZBWF2TmZWn1sYSZQ+Vm9iNUj0sUTIv63KXEuGblqPaxCc8Y/I18PwDVK2CYvWMbnAAAAAASUVORK5CYII=';

class Controller extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * @description Toggle playback status event processing
   */
  switch = () => {
    let status = !this.props.pause;
    this.props.onPauseOrStart && this.props.onPauseOrStart(status);
  }

  /**
   * @description justify
   */
  justify(time, status) {
    this.props.onJustify && this.props.onJustify(time, status);
  }

  /**
   * @description fullScreen
   */
  fullScreen() {
    this.props.onFullScreen && this.props.onFullScreen();
  }

  /**
   * @description render
   */
  render() {
    let playImage;
    if (this.props.pause) {
      playImage = playButtonImage;
    } else {
      playImage = pauseButtonImage;
    }
    let styles = defaultStyles;
    styles.controller = {
      ...defaultStyles.controller,
      ...this.props.style
    };
    return <View style={styles.controller}>
      <View style={styles.background} />
      <View onClick={this.switch} style={styles.iconContainer} >
        <Icon style={styles.play} source={{uri: playImage}} />
      </View>
      <Progress style={styles.progress} onJustify={(time, status) => {
        this.justify(time, status);
      }} totalTime={this.props.totalTime} currentTime={this.props.currentTime} />
      { this.props.hasFullScreen ? <View onClick={this.fullScreen} style={styles.iconContainer}>
        <Icon style={styles.fullScreen} source={{uri: fullScreenImage}} />
        </View> : null
      }
    </View>;
  }
}

const defaultStyles = {
  controller: {
    display: 'flex',
    flexDirection: 'row',
    height: 70,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.5,
    zIndex: '-1'
  },
  iconContainer: {
    paddingLeft: 15,
    paddingRight: 15
  },
  play: {
    width: 40,
    height: 40,
    marginTop: 15
  },
  progress: {},
  fullScreen: {
    width: 40,
    height: 40,
    marginTop: 15
  }
};

export default Controller;
