import React, { PropTypes } from 'react';
import { updatePath } from 'redux-simple-router';
import { connect } from 'react-redux';

@connect()
export default class MainView extends React.Component {
  static propTypes = {
    children: PropTypes.object
  }

  componentDidMount = () => {
    this.props.dispatch(updatePath('/home'));
  }

  render() {
    return (
      <div id="main-view">
        <h1>Todos</h1>
        <hr />
        {this.props.children}
      </div>
    );
  }
}
