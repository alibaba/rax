import {createElement, Component, render} from 'rax';

class Example extends Component {
  state = {
    refresh_display: 'hide',
    loading_display: 'hide',
  };

  onrefresh = (e) => {
    this.state.refresh_display = 'show';
    this.setState(this.state);
    setTimeout(() => {
      this.state.refresh_display = 'hide';
      this.setState(this.state);
    }, 1000);
  }
  onloading = (e) => {
    this.state.loading_display = 'show';
    this.setState(this.state);
    setTimeout(() => {
      console.log('hide', this.state);
      this.state.loading_display = 'hide';
      this.setState(this.state);
    }, 1000);
  }
  renderItems = (sec) => {
    let items = sec.items.map((item, index) => {
      return <div style={styles.item}>
        <text style={styles.itemTitle}>row {item.id}</text>
      </div>;
    });
    return items;
  }
  render() {
    let sections = data.sections.map((sec, index) => {
      return <div style={styles.section}>
        <div style={styles.header}>
          <text style={styles.headerTitle}>{sec.title}</text>
        </div>
        {this.renderItems(sec)}
      </div>;
    });

    return (
      <scroller style={styles.list} append="tree">
        {sections}
        <loading style={styles.loadingView} display={this.state.loading_display} onloading={this.onloading}>
          <loading-indicator style={{height: 60, width: 60}} />
        </loading>
      </scroller>
    );
  }
}

const data = {
  sections: [
    {
      title: 'Header 1',
      items: [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5}
      ]
    },
    {
      title: 'Header 2',
      items: [
        {id: 6},
        {id: 7},
        {id: 8},
        {id: 9},
        {id: 10},
        {id: 11}
      ]
    }
  ],
  moreSections: [
    {
      title: 'Header 3',
      items: [
        {id: 12},
        {id: 13},
        {id: 14},
        {id: 15},
        {id: 16},
        {id: 17},
        {id: 18}
      ]
    },
    {
      title: 'Header 4',
      items: [
        {id: 19},
        {id: 20},
        {id: 21},
        {id: 22}
      ]
    },
    {
      title: 'Header 5',
      items: [
        {id: 23},
        {id: 24},
        {id: 25},
        {id: 26},
        {id: 27}
      ]
    },
    {
      title: 'Header 6',
      items: [
        {id: 28},
        {id: 29},
        {id: 30},
        {id: 31},
        {id: 32}
      ]
    }
  ]
};

const styles = {
  list: {
    height: 850,
  },
  refreshView: {
    height: 120,
    width: 750,
    display: 'flex',
    alignItems: 'center',
  },
  refreshArrow: {
    fontSize: 30,
    color: '#45b5f0',
  },
  loadingView: {
    height: 80,
    width: 750,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dddddd',
  },
  indicator: {
    height: 40,
    width: 40,
    color: '#45b5f0',
  },
  header: {
    backgroundColor: '#45b5f0',
    padding: 20,
    height: 88,
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  item: {
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#c0c0c0',
    height: 100,
    padding: 20,
  },
  itemTitle: {
  }

};

render(<Example />);
