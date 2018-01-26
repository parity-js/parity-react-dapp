# Parity React Dapp

[![Dependency Status](https://david-dm.org/Parity-JS/parity-react-dapp.svg)](https://david-dm.org/Parity-JS/parity-react-dapp)

Tweak Create React App via React App Rewire to best integrate with dapp development.

## Installation

### 1) Install this dependency

```bash
$> npm install parity-react-dapp --save-dev
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
$> npm run init
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
$> npm start  # Start the dev environment
$> npm build  # Build your project
```

There are a few more scripts included in here

### Linting

You have included JS and CSS linting:

```bash
$> npm run lint:js   # Lint your Javascript files with eslint
$> npm run lint:css  # Lint your CSS files with stylelint
$> npm run lint      # Run both linters
```
