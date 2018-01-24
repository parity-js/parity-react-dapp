import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import Content from './Content';
import Menu from './Menu';

import styles from './App.css';

export default class App extends Component {
  render () {
    return (
      <Container className={ styles.container }>
        <div>
          <Menu />
          <Content />
        </div>
      </Container>
    );
  }
}
