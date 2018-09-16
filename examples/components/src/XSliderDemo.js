/** @jsx createElement */
import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import RecyclerView from 'rax-recyclerview';
import Slider from 'rax-xslider';

const styles = {
  item: {
    backgroundColor: 'red',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 5,
    borderColor: '#000',
    height: 750
  },
  txt: {
    color: '#fff',
    fontSize: 50,
    textAlign: 'center'
  },
  title: {
    backgroundColor: '#f7f7f7',
    color: '#444',
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 80
  }
};

const colors = [
  'red',
  'green',
  'blue',
  'orange',
  'yellow'
];

class XSliderDemo extends Component {
  getCardTransitionSpec = () => {
    return {
      props: [
        {
          property: 'transform.scale',
          inputRange: [0, 1],
          outputRange: [0.85, 1]
        },
        // {
        //   property: 'transform.rotateY',
        //   inputRange: [0, 1],
        //   outputRange: [45,0]
        // },
        {
          property: 'opacity',
          inputRange: [0, 1],
          outputRange: [.4, 1]
        }
      ]
    };
  }

  // onClick = () => {
  //   window.open('//market.m.taobao.com/apps/guang/ishopping/new_index.html?__intercept_tracker=true&wh_weex=true&wx_navbar_transparent=true');
  // }

  afterSwitch = (e) => {
    let index = e.loopIndex;
    // console.log(e.index)
  }

  render() {
    const startGap = 75;
    const endGap = 75;
    const viewportSize = 750;
    const cardSize = 600;


    return (<View style={{flex: 1, justifyContent: 'center'}}>
      <RecyclerView>
        <RecyclerView.Cell>
          <Slider ref="slider"
            style={{height: 750}}
            cardSize={cardSize}
            viewportSize={viewportSize}
            startGap={startGap}
            endGap={endGap}
            minOffset={0}
            maxOffset={(colors.length - 1) * cardSize - startGap - endGap}
            // autoPlay={true}
            // interval={500}
            duration={300}
            // loop={true}
            afterSwitch={this.afterSwitch}
            // indicatorComponent={null}
            cardTransitionSpec={this.getCardTransitionSpec}
          >
            {colors.map((color, i) => {
              // let isCurrent = i === 0;
              return (
                <Slider.Panel style={{
                  height: 750,
                  width: 600,
                  // opacity: isCurrent ? 1 : .4,
                  // transform: isCurrent ? 'scale(1)' : 'scale(.85)'
                }}>
                  <Slider.PanLink
                    href={'//market.m.taobao.com/apps/guang/ishopping/new_index.html?__intercept_tracker=true&wh_weex=true&wx_navbar_transparent=true'}
                    style={[styles.item, {backgroundColor: color}]}><Text style={styles.txt}>{i}</Text></Slider.PanLink>
                </Slider.Panel>);
            })}
          </Slider>
        </RecyclerView.Cell>
        {[0, 1, 2, 3, 4, 5, 6].map(() => {
          return <RecyclerView.Cell style={{height: 300, backgroundColor: '#ccc'}}>row</RecyclerView.Cell>;
        })}
      </RecyclerView>
    </View>);
  }
}


export default XSliderDemo;
