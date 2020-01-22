'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const read_pkg_up_1 = __importDefault(require('read-pkg-up'));
const fixedOrder = ['react', 'react-dom', 'prop-types'];
function default_1(styleApi) {
  const {
    alias,
    and,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  const { pkg } = read_pkg_up_1.default.sync() || {};

  let modules = pkg
    ? [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
      ]
    : [];

  const isFromNodeModules =
    modules.length > 0
      ? imported => modules.includes(imported.moduleName)
      : isNodeModule;

  const reactComparator = (name1, name2) => {
    let i1 = fixedOrder.indexOf(name1);
    let i2 = fixedOrder.indexOf(name2);
    i1 = i1 === -1 ? Number.MAX_SAFE_INTEGER : i1;
    i2 = i2 === -1 ? Number.MAX_SAFE_INTEGER : i2;
    return i1 === i2 ? naturally(name1, name2) : i1 - i2;
  };
  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },
    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },
    // import … from "fs";
    {
      match: isFromNodeModules,
      sort: moduleName(reactComparator),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import … from "foo";
    {
      match: isAbsoluteModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import … from "./foo";
    // import … from "../foo";
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
  ];
}
exports.default = default_1;
