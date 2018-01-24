/**
  MIT License

  Copyright (c) 2017 Leonhardt Koepsell

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  soure code: https://github.com/codebandits/react-app-rewire-css-modules
 */

const ruleChildren = (loader) => {
  return loader.use || loader.oneOf || (Array.isArray(loader.loader) && loader.loader) || [];
};

const findIndexAndRules = (rulesSource, ruleMatcher) => {
  const rules = Array.isArray(rulesSource)
    ? rulesSource
    : ruleChildren(rulesSource);

  let result;

  rules.some((rule, index) => {
    result = ruleMatcher(rule)
      ? { index, rules }
      : findIndexAndRules(ruleChildren(rule), ruleMatcher);

    return result;
  });

  return result;
};

const findRule = (rulesSource, ruleMatcher) => {
  const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher);

  return rules[index];
};

const createLoaderMatcher = (loader) => {
  return (rule) => rule.loader && rule.loader.indexOf(`/${loader}/`) !== -1;
};

const addAfterRule = (rulesSource, ruleMatcher, value) => {
  const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher);

  rules.splice(index + 1, 0, value);
};

const addBeforeRule = (rulesSource, ruleMatcher, value) => {
  const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher);

  rules.splice(index, 0, value);
};

const replacePlugin = (plugins, nameMatcher, newPlugin) => {
  const pluginIndex = plugins.findIndex((plugin) => {
    return plugin.constructor && plugin.constructor.name && nameMatcher(plugin.constructor.name);
  });

  if (pluginIndex === -1) {
    return plugins;
  }

  const nextPlugins = plugins.slice(0, pluginIndex).concat(newPlugin).concat(plugins.slice(pluginIndex + 1));

  return nextPlugins;
};

module.exports = {
  addAfterRule,
  addBeforeRule,

  createLoaderMatcher,

  findIndexAndRules,
  findRule,

  replacePlugin
};
