import {createElement, Component, render} from 'universal-rx';

class Example extends Component {

  state = {
    appearMin: 1,
    appearMax: 1,
  };
  appearIds = [];
  onappear = (e) => {
    var appearId = data.rows[e.target.attr.index].id;
    var appearIds = this.appearIds;
    appearIds.push(appearId);
    this.getMinAndMaxIds(appearIds);
  }
  ondisappear = (e) => {
    var disAppearId = data.rows[e.target.attr.index].id;
    var appearIds = this.appearIds;
    var index = appearIds.indexOf(disAppearId);
    if (index > -1) {
      appearIds.splice(index, 1);
    }
    this.getMinAndMaxIds(appearIds);
  }

  getMinAndMaxIds = (appearIds) => {
    appearIds.sort(function(a, b) {
      return a - b;
    });
    this.appearIds = appearIds;
    this.state.appearMax = appearIds[appearIds.length - 1];
    this.state.appearMin = appearIds[0];
    this.setState(this.state);
  }

  render() {
    let rows = data.rows.map((item, index) => {
      return <cell style={styles.row}>
          <div
            index={index}
            style={styles.item}
            onAppear={this.onappear}
            onDisappear={this.ondisappear}>
            <text style={styles.itemTitle}>row {item.id}</text>
          </div>
        </cell>;
    });

    return (
      <div>
        <list style={styles.list}>
          {rows}
        </list>
        <text style={styles.count}>
          Appear items: {this.state.appearMin} ~ {this.state.appearMax}
        </text>
      </div>
    );
  }
}

const styles = {
  list: {
    height: 850,
  },
  count: {
    fontSize: 48,
    margin: 10,
  },
  indicator: {
    height: 40,
    width: 40,
    color: '#45b5f0',
  },
  row: {
    width: 750,
    height: 100,
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

const data = {
  rows: [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9},
    {id: 10},
    {id: 11},
    {id: 12},
    {id: 13},
    {id: 14},
    {id: 15},
    {id: 16},
    {id: 17},
    {id: 18},
    {id: 19},
    {id: 20},
    {id: 21},
    {id: 22},
    {id: 23},
    {id: 24},
    {id: 25},
    {id: 26},
    {id: 27},
    {id: 28},
    {id: 29}
  ]
};

render(<Example />);
