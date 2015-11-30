import React from 'react';
import { PropTypes } from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import Todo from './Todo';
import * as TodoActions from 'actions/TodoActions';

export default class TodosView extends React.Component {
  static propTypes = {
    todos:      PropTypes.instanceOf(Immutable.List).isRequired
  }

  render() {
    const btnStyle = {
      'margin': '1em 0 1em 1em'
    };
    const dispatch = this.props.dispatch;
    console.log(this.props.todos);

    return (
      <div id="todos-list">
        {
          this.props.todos.map( (todo, index) => {
            return (
              <Todo todo={todo} index={index} key={index} {...bindActionCreators(TodoActions, dispatch)} />
            );
          })
        }
      </div>
    );
  }
}
