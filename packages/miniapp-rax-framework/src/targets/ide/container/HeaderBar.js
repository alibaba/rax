import { createElement } from 'rax';
import prevIcon from './prev.png';

export default function HeaderBar(props) {
  const { appWindow, showPrev, onPrev } = props;
  const {
    defaultTitle,
    navigationBarBackgroundColor,
    navigationBarTextStyle,
    navigationBarTitleText,
  } = appWindow;
  const headerBarStyle = {
    backgroundColor: navigationBarBackgroundColor || '#fff',
    color: navigationBarTextStyle || '#000',
  };

  return (
    <div id="headerBar" style={{ ...headerBarStyle, ...styles.headerBar}}>
      <div className="headerInfo" style={styles.headerInfo}>

        <div onClick={onPrev} style={{ ...styles.prevIcon, visibility: showPrev ? 'initial' : 'hidden' }}>
          <img src={prevIcon} style={{ width: 18 }} />
        </div>
        <div className="title" style={styles.title}>{navigationBarTitleText || defaultTitle}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={styles.actionBar}>
            <svg style={styles.actionIcon} viewBox="0 0 1024 1024">
              <path
                d="M768 448c-35.36 0-64 28.64-64 64s28.64 64 64 64 64-28.64 64-64-28.64-64-64-64m-256 0c-35.36 0-64 28.64-64 64s28.64 64 64 64 64-28.64 64-64-28.64-64-64-64m-256 0c-35.36 0-64 28.64-64 64s28.64 64 64 64 64-28.64 64-64-28.64-64-64-64"
                fill="#888888" />
            </svg>
            <svg onClick={reload} style={styles.actionIcon} viewBox="0 0 1024 1024">
              <path
                d="M764.8 312.256l-53.12-53.12L512 458.88 312.256 259.136l-53.12 53.12L458.88 512 259.136 711.68l53.12 53.12L512 565.12 711.68 764.8l53.12-53.12L565.12 512 764.8 312.256zm0 0"
                fill="#888888" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function reload() {
  location.hash = '';
  location.reload();
}

const styles = {
  headerBar: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: 75,
    backgroundColor: '#f9f9f9',
  },
  headerInfo: {
    fontSize: 32,
    color: '#272727',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
    height: '100%',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  prevIcon: {
    flex: 1,
    visibility: 'hidden',
  },
  actionBar: {
    border: '1px solid #ccc',
    borderRadius: 40,
    display: 'flex',
    width: 100,
    height: 40,
  },
  actionIcon: {
    cursor: 'pointer',
    width: 35,
    padding: '0 5',
  },
};

