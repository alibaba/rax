import { createElement, Component } from 'rax';

export default class TabbarItem extends Component {
  render() {
    const { data } = this.props;

    return (
      <navigator style={styles.link} url={data.pageName} id={`tabbar-page-${data.pageName}`} data-page-name={data.pageName}>
        <image style={styles.icon} src={data.iconPath} aria-hidden="true" />
        <view style={styles.text}>{data.text}</view>
      </navigator>
    );
  }
}

const styles = {
  link: { textAlign: 'center' },
  icon: { width: '31.5rem', heigt: '31.5rem' },
  text: { fontSize: '24rem', color: '#686868', whiteSpace: 'nowrap', lineHeight: '1' },
};
