/* eslint-disable @typescript-eslint/no-var-requires */
const { copyFileSync, writeFileSync, readFileSync } = require("fs");
const { resolve } = require("path");
const pkg = require("../package.json");

const dist = resolve(__dirname, "../dist");
const root = resolve(__dirname, "../");

const unwantedPkgKeys = [
  "devDependencies",
  "scripts",
  "config",
  "commitlint",
  "husky",
  "release",
  "files",
];

const PreRelease = {
  writePackage: function () {
    unwantedPkgKeys.map(key => {
      delete pkg[key];
    });
    pkg.main = "index.js";
    writeFileSync(resolve(dist, "package.json"), JSON.stringify(pkg, null, 4));
    console.info("✅ Created package.json in dist folder");
    return this;
  },
  copyFiles: function () {
    let declarationFile = readFileSync(resolve(root, "src/typings/index.d.ts"));
    declarationFile += "export default summary;\n";
    writeFileSync(resolve(dist, "index.d.ts"), declarationFile);
    console.info("✅ Copied over index.d.ts to dist");

    copyFileSync(resolve(root, "README.md"), resolve(dist, "README.md"));
    console.info("✅ Copied over README.md to dist");

    copyFileSync(resolve(root, "LICENSE"), resolve(dist, "LICENSE"));
    console.info("✅ Copied over LICENSE to dist");
    return this;
  },
  prepare: function () {
    console.info("\n⏳ Preparing for release");
    this.writePackage().copyFiles();
    console.info("🎉 Done. Package is ready to be published.\n");
  },
};

PreRelease.prepare();
