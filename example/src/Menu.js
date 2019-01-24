import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Input, Menu } from 'semantic-ui-react';

import MenuStore from './Menu.store';

export default @observer class CustomMenu extends Component {
  store = new MenuStore();

  render () {
    const { active } = this.store;

    return (
      <Menu pointing>
        <Menu.Item
          name='home'
          active={ active === 'home' }
          onClick={ this.handleItemClick }
        />
        <Menu.Item
          name='messages'
          active={ active === 'messages' }
          onClick={ this.handleItemClick }
        />
        <Menu.Item
          name='friends'
          active={ active === 'friends' }
          onClick={ this.handleItemClick }
        />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  handleItemClick = (_, { name }) => {
    this.store.setActive(name);
  };
}
