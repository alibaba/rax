import {createElement, Component} from 'rax';
import Picture from 'rax-picture';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import styles from './style';

class Card extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.dataSource || nextProps.dataSource[0].itemId !== this.props.dataSource[0].itemId;
  }

  render() {
    let {dataSource, ...otherProps} = this.props;
    if (dataSource.length === 0) {
      return null;
    }
    let returnDOM = dataSource.map((item, index) => {
      let titleLineClamp = item.titleLineClamp ? item.titleLineClamp : 1;
      let subTitleLineClamp = item.subTitleLineClamp ? item.subTitleLineClamp : 1;
      let descLineClamp = item.descLineClamp ? item.descLineClamp : 1;

      return (
        <Link key={index} href={item.url} style={styles.itemwrap} {...otherProps}>
          <View style={styles.item}>
            <Picture source={{uri: item.pic}} style={styles.pic} />
            <View style={styles.content}>
              <View style={styles.textwrap}>
                <Text numberOfLines={titleLineClamp} style={styles.title}>{item.title}</Text>
                {item.subTitle ? <Text numberOfLines={subTitleLineClamp} style={styles.subtitle}>{item.subTitle}</Text> : null}
                {item.desc ? <Text numberOfLines={descLineClamp} style={styles.desc}>{item.desc}</Text> : null}
              </View>
              <View style={styles.sign}>
                {item.price ? <Text style={styles.highlightext}>{item.price}</Text> : null}
                {item.discount ? <Text style={styles.weakentext}>{item.discount}</Text> : null}
              </View>
              {item.extra ? <Text style={styles.extratext}>{item.extra}</Text> : null}
              {item.tagging ? <Text style={styles.tagtext}>{item.tagging}</Text> : null}
            </View>
          </View>
        </Link>
      );
    });

    return (<View style={styles.container}>{returnDOM}</View>);
  }
}

export default Card;
