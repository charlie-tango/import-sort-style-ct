import { IStyleAPI, IStyleItem } from 'import-sort-style';
import readPkgUp from 'read-pkg-up';

const firstModules = ['react', 'react-dom', 'prop-types'];

type Package = {
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

export default function(styleApi: IStyleAPI): IStyleItem[] {
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
  const { packageJson } = readPkgUp.sync() || {};
  let modules = packageJson
    ? [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
      ]
    : [];

  const isFromNodeModules =
    modules.length > 0
      ? imported => modules.some(name => imported.moduleName.startsWith(name))
      : isNodeModule;

  // const isReactModule = imported =>
  //   Boolean(imported.moduleName.match(/^(react|prop-types|redux)/));

  const modulesComparator = (name1, name2) => {
    let i1 = firstModules.findIndex(name => name1.startsWith(name));
    let i2 = firstModules.findIndex(name => name2.startsWith(name));

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
      sort: moduleName(modulesComparator),
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
