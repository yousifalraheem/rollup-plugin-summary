[![https://img.shields.io/npm/v/rollup-plugin-summary](https://img.shields.io/npm/v/rollup-plugin-summary)](https://www.npmjs.com/package/rollup-plugin-summary)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![https://img.shields.io/github/languages/top/yousifalraheem/rollup-plugin-summary](https://img.shields.io/github/languages/top/yousifalraheem/rollup-plugin-summary)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/rollup-plugin-summary)
[![codecov](https://codecov.io/gh/yousifalraheem/rollup-plugin-summary/branch/master/graph/badge.svg)](https://codecov.io/gh/yousifalraheem/rollup-plugin-summary)
[![Release](https://github.com/yousifalraheem/rollup-plugin-summary/actions/workflows/release.yml/badge.svg)](https://github.com/yousifalraheem/rollup-plugin-summary/actions/workflows/release.yml)

# rollup-plugin-summary

A rollup plugin that summarizes the output of the build.

<img src="docs/assets/sample_output.png" alt="Sample output" />

## Installation

<hr/>

### npm

```terminal
npm i -D rollup-plugin-summary
```

### yarn

```terminal
yarn add -D rollup-plugin-summary
```

<hr/>

## Usage

File: _`rollup.config.js`_

```javascript
import summary from "rollup-plugin-summary";

export default {
  plugins: [summary()],
};
```

<!-- github-only-start -->

<hr/>

## Documentation

Read the full [documentation](https://yousifalraheem.github.io/rollup-plugin-summary/) to learn about options and more.

<hr/>

## License

MIT

<!-- github-only-end -->
