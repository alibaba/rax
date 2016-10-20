import {createElement, Component, render} from 'universal-rx';

class TodoList extends Component {
  render() {
    return (
      <div>
        {this.props.items.map(item => (
          <text key={item.id}>{item.text}</text>
        ))}
      </div>
    );
  }
}

class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {items: [], text: ''};
  }

  render() {
    return (
      <div>
        <text>TODO</text>
        <TodoList items={this.state.items} />
        <div>
          <input onChange={this.handleChange} value={this.state.text} />
          <text onClick={this.handleSubmit}>{'Add #' + (this.state.items.length + 1)}</text>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    var newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
  }
}

render(<TodoApp />, document.body);
