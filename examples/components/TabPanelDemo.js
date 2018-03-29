import {Component, createElement, render } from 'rax';
import {TabController,TabPanel} from '../../packages/rax-tab-panel/src/';
import Text from '../../packages/rax-text/src/';
import View from '../../packages/rax-view/src/';
import ScrollView from '../../packages/rax-scrollview/src/';
import Touchable from '../../packages/rax-touchable/src/';
import TabHeader from '../../packages/rax-tabheader/src/';


let styles = {
  container: {
    width: 750,
    height: 80,
  },
  item: {
    textAlign: 'center',
    fontSize: 28,
    height: '80rem',
    width: '233rem',
    backgroundColor: '#52bfe6',
    color: '#FFFFFF',
    position: 'relative'
  },
  select: {
    textAlign: 'center',
    fontSize: 28,
    height: '80rem',
    width: '233rem',
    backgroundColor: '#ff4200',
    color: '#FFFFFF',
    position: 'relative'
  },
  tabController:{
    width:750,
    height:600,
    position:'relative'
  },
  tabPanel:{
    width:750
  }
}

let icon = 'https://img.alicdn.com/tfs/TB1J3O7QXXXXXbIapXXXXXXXXXX-75-75.png';

function renderItem(item, index) {
  return <View style={styles.item}><Text style={styles.text}>{item}</Text></View>;
}
function renderSelect(item, index) {
  return <View style={styles.select}><Text style={styles.text}>{item}</Text></View>;
}


class TabPanelDemo extends Component {
  
  onSelect = (index) => {
    console.log('select', index);
    this.refs.tabController.switchTo(index,{params:{type:'click'}});
  }
  
  beforeSwitch = (e)=>{
    if(e.params.type !== 'click' && e.params.type !== 'default'){
     this.refs.tabHeader.select(e.index);
    }
  }

  render() {
    
    let dataSource = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8'];
    
    
    return (
      <View style={{flex:1}}>
        <TabHeader 
          ref="tabHeader"
          style={styles.container} 
          dataSource={dataSource} 
          onSelect={this.onSelect}
          selected={0}
          itemWidth={166}
          dropDownCols={4}
          type={'dropDown-border-scroll'}
        />
        <TabController
          beforeSwitch={this.beforeSwitch}
          ref="tabController" 
          style={styles.tabController}>
          {dataSource.map((data,i)=>{
            return <TabPanel key={i} style={styles.tabPanel}>{i}</TabPanel>
          })}
        </TabController>
        
      </View>
    );
  }
}

export default TabPanelDemo;
