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

const githubClient = require('release-it/lib/github-client');
const git = require('release-it/lib/git');
const parseRepo = require('parse-repo');
const ora = require('ora');

const { getToken } = require('./github-auth');

async function release ({ changelog, tagName, version, zipPath }) {
  const token = await getToken();
  const remoteUrl = await git.getRemoteUrl();
  const repo = parseRepo(remoteUrl);
  const github = {
    releaseName: 'Release %s',
    assets: zipPath,
    token
  };

  const spinner = ora('Publishing the release').start();
  const releaseInfo = await githubClient.release({ version, tagName, repo, changelog, github });

  spinner.succeed();
  spinner.start('Uploading the zip file');
  const [ assetInfo ] = await githubClient.uploadAssets({ release: releaseInfo, repo, github });

  spinner.succeed();

  const assetUrl = assetInfo['browser_download_url'];
  const releaseUrl = releaseInfo['html_url'];

  return { assetUrl, releaseUrl };
}

module.exports = { getToken, release };
