
import {createElement, render, Component} from 'rax';
import Page from './mods/Page';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import ListView from 'rax-listview';
import Icon from 'rax-icon';
import MultiRow from 'rax-multirow';
import styles from './App.css';
import data from './data';

class App extends Component {
  render() {
    return (
      <Page>


        <View style={styles.header}>
          <View style={styles.headerPlaceholder}>
            <Icon style={styles.headerPlaceholderIcon} fontFamily="iconfont" source={{uri: data.iconfont, codePoint: '\uE603'}} />
            <Text style={styles.headerPlaceholderText}>搜索</Text>
          </View>
        </View>


        <View style={styles.headerBar}>
          <MultiRow
            dataSource={data.headerData}
            cells={3}
            renderCell={(item, index) => {
              let firstStyle = {};
              if (index == 0) {
                firstStyle.borderLeftWidth = 0;
              }
              return (
                <View style={{...styles.headerBarItem, ...firstStyle}}>
                  <Icon style={styles.headerBarIcon} fontFamily="iconfont" source={{uri: data.iconfont, codePoint: item.icon}} />
                  <Text style={styles.headerBarText}>{item.text}</Text>
                </View>
              );
            }
            } />
        </View>


        <ListView
          renderRow={(item) => {
            return (
              <View style={styles.listItem}>
                <View style={styles.bottom} />
                <View style={styles.listItemInfo}>
                  <Image style={styles.listItemInfoImg} source={{uri: item.userImage}} />
                  <Text style={styles.listItemInfoTopic}>来自话题：{item.topic}</Text>
                </View>
                <Image style={styles.listItemMainImage} resizeMode="cover" source={{uri: item.image}} />
                <Text style={styles.listItemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.listItemContent} numberOfLines={3}>{item.content}</Text>
                <View style={styles.listItemBottom}>
                  <Text style={styles.listItemBottomText}>
                    827 赞
                  </Text>
                  <View style={styles.listItemBottomPoint} />
                  <Text style={styles.listItemBottomText}>
                    110 评论
                  </Text>
                  <View style={styles.listItemBottomPoint} />
                  <Text style={styles.listItemBottomText}>
                    去往文章列表
                  </Text>
                </View>
              </View>
            );
          }}
          dataSource={data.listdata}
        />


        <View style={styles.bottomBar}>
          <MultiRow
            dataSource={data.barData}
            cells={5}
            renderCell={(item, index) => {
              let colorStyle = {};
              if (index == 0) {
                colorStyle.color = '#008bff';
              }
              return (
                <View style={styles.bottomBarItem}>
                  <Icon style={{...styles.bottomBarIcon, ...colorStyle}} fontFamily="iconfont" source={{uri: data.iconfont, codePoint: item.icon}} />
                  <Text style={{...styles.bottomBarText, ...colorStyle}}>{item.text}</Text>
                </View>
              );
            }
            } />
        </View>


      </Page>
    );
  }
}

export default App;
