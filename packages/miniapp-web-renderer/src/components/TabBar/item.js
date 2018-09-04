import { createElement, Component } from 'rax';

export default class TabbarItem extends Component {
  render() {
    const { data } = this.props;

    return (
      <navigator
        url={data.pageName}
        style={{ textAlign: 'center' }}
        id={`tabbar-page-${data.pageName}`}
        data-page-name={data.pageName}
      >
        <image
          src={data.iconPath}
          aria-hidden="true"
          style={{ width: '31.5rem', heigt: '31.5rem' }}
        />
        <view
          style={{
            fontSize: '3.2vw',
            color: '#686868',
            whiteSpace: 'nowrap',
            lineHeight: '1em',
          }}
        >
          {data.text}
        </view>
      </navigator>
    );
  }
}
