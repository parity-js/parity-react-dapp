# Parity React Dapp

Tweak Create React App via React App Rewire to best integrate with dapp development.

## Installation

### 1) Install this dependency

```bash
$> yarn add -D parity-react-dapp
```

### 2) Add the init script

Add to your `package.json` file this script:

```json
"scripts": {
  "init": "parity-react-dapp init"
}
```

### 3) Run the init script

```bash
$> yarn run init
```

This will add the base files (eslint config, gitignore file, etc.) to your project,
add will add the required scripts to your `package.json` file.

## Requirements

You must have an `src/index.js` file that _**exports your default component**_, eg:

```js
/* src/index.js */
import React, { Component } from 'react';

export default class App extends Component {
  render () {
    return (
      <div>
        HELLO
      </div>
    );
  }
}
```

You get React Hot Reloading for free, without any configuration needed!

## Usage

You can use these scripts just as you would with Create React App:

```bash
$> yarn start  # Start the dev environment
$> yarn build  # Build your project
```

There are a few more scripts included in here

### Linting

You have included JS and CSS linting:

```bash
$> yarn lint:js   # Lint your Javascript files with eslint
$> yarn lint:css  # Lint your CSS files with stylelint
$> yarn lint      # Run both linters
```
