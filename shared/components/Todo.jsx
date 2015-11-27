import React from 'react';

export default class Todo extends React.Component {
  handleDelete = (e) => {
    console.log(this.props);
    this.props.deleteTodo(this.key);
  }

  handleEdit = (e) => {
    // 2do: better UI
    let text = window.prompt('', this.props.todo);

    this.props.editTodo(this.key, text);
  }

  render() {
    const { todo, index } = this.props;
    const btnStyle = {
      'margin': '1em 0 1em 1em'
    };

    return (
      <div style={btnStyle}>
        <span>{todo}</span>

        <button style={btnStyle} onClick={this.handleDelete}>X</button>
        <button style={btnStyle} onClick={this.handleEdit}>Edit</button>
      </div>
    );
  }
}
