// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

const ora = require('ora');

let spinner = null;

function trim (text) {
  if (!text) {
    return text;
  }

  const columns = process.stdout.columns || process.stderr.columns || 120;
  const length = text.length + 2;

  if (length <= columns) {
    return text;
  }

  const words = text.split(/\s+/);
  const longest = words.reduce((cur, word, index) => {
    const l = word.length;

    return (l > cur.length)
      ? { word, index, length: l }
      : cur;
  }, { word: '', index: -1, length: 0 });

  const toTrim = length - columns + 4;
  const toTrimLeft = Math.floor(toTrim / 2);
  const toTrimRight = toTrim - toTrimLeft;

  const trimIndex = Math.floor(longest.length / 2);
  const trimIndexLeft = trimIndex - toTrimLeft;
  const trimIndexRight = trimIndex + toTrimRight;

  const trimmedWord = longest.word.slice(0, trimIndexLeft) + '[..]' + longest.word.slice(trimIndexRight);

  const textIndex = text.indexOf(longest.word);

  return text.slice(0, textIndex) + trimmedWord + text.slice(textIndex + longest.length);
}

function fail (text) {
  if (spinner) {
    spinner.fail(trim(text));
  }
}

function succeed (text) {
  if (spinner) {
    spinner.succeed(trim(text));
  }
}

function start (text) {
  spinner = ora(trim(text)).start();

  return { succeed, fail };
}

function update (text) {
  if (spinner) {
    spinner.text = text;
  } else {
    start(text);
  }
}

module.exports = {
  start,
  fail,
  succeed,
  update
};
