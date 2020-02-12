# import-sort-style-ct

A style for [import-sort](https://github.com/renke/import-sort) we use at
[Charlie Tango](https://www.charlietango.dk). It's based on the default module
sorting.

- React imports are placed first.
- Node.js and NPM modules are grouped without a separator.

## Installation

Add the package to the project:

```sh
yarn add prettier import sort-style-ct
```

Create the [import-sort](https://github.com/renke/import-sort) configuration, so
it uses the `ct` style. This can be done inside the `package.json`:

```json
{
  "importSort": {
    ".js, .jsx, .ts, .tsx": {
      "style": "ct",
      "parser": "typescript"
    }
  }
}
```

Install
[prettier-plugin-import-sort](https://github.com/ggascoigne/prettier-plugin-import-sort),
and Prettier will ensure the imports are sorted whenever it runs on a file.

```sh
yarn add prettier prettier-plugin-import-sort
```

### Example sorting

```js
// Absolute modules with side effects (not sorted because order may matter)
import 'a';
import 'c';
import 'b';

// Relative modules with side effects (not sorted because order may matter)
import './a';
import './c';
import './b';

// React modules, pulled up from other node modules
import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
// Modules from the Node.js "standard" library sorted by name
import { readFile, writeFile } from 'fs';
import * as path from 'path';
// Third-party modules sorted by name
import aa from 'aa';
import bb from 'bb';
import cc from 'cc';

// First-party modules sorted by "relative depth" and then by name
import aaa from '../../aaa';
import bbb from '../../bbb';
import aaaa from '../aaaa';
import bbbb from '../bbbb';
import aaaaa from './aaaaa';
import bbbbb from './bbbbb';
```
