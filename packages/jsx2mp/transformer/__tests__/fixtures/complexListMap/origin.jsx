import { createElement, Component } from 'rax';

export default class extends Component {
  state = {
    loop: true
  }

  render() {
    const { arr, outsideArr, insideArr } = this.state;
    return (
      <view>
        {
          outsideArr.map(outsideItem => {
            return <view>
              {insideArr.map(insideItem => <text>{insideItem}</text>)}
            </view>
          })
        }
        {
          arr.length > 2 ? arr.map(item => <text>{item}</text>) : <text>Nothing!</text>
        }
        {
          arr.length > 2 ? arr.map(item => <text>{item}</text>) : null
        }
        {
          arr.length > 2 ? null : arr.map(item => <text>{item}</text>)
        }
      </view>
    );
  }
}
