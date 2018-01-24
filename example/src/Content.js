import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

export default class Content extends Component {
  state = {
    blockNumber: 'unknown'
  };

  componentWillMount () {
    this.fetchBlockNumber();
    this.intervalId = setInterval(() => this.fetchBlockNumber(), 2000);
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  fetchBlockNumber () {
    window.ethereum.send('eth_blockNumber', [], (err, val) => {
      if (err) {
        return console.error(err);
      }

      this.setState({ blockNumber: parseInt(val, 16) });
    });
  }

  render () {
    const { blockNumber } = this.state;

    return (
      <Segment>
        <p>Current block: {blockNumber}</p>
      </Segment>
    );
  }
}
