import {createElement, Component, render} from 'universal-rx';
import {isWeex, isWeb} from 'universal-env';

class TodoList extends Component {
  render() {
    if (isWeex) {
      return (
        <div>
          {this.props.items.map(item => (
            <text key={item.id}>{item.text}</text>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          {this.props.items.map(item => (
            <p key={item.id}>{item.text}</p>
          ))}
        </div>
      );
    }
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
    if (isWeex) {
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
    } else {
      return (
        <div>
          <text>TODO</text>
          <TodoList items={this.state.items} />
          <div>
            <input onChange={this.handleChange} value={this.state.text} />
            <button onClick={this.handleSubmit}>{'Add #' + (this.state.items.length + 1)}</button>
          </div>
        </div>
      );
    }
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
