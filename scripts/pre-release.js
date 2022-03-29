const { copyFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");
const pkg = require("../package.json");

const dist = resolve(__dirname, "../dist");
const root = resolve(__dirname, "../");

const unwantedPkgKeys = ["devDependencies", "scripts", "config", "commitlint", "husky", "release"];

const PreRelease = {
  writePackage: function () {
    unwantedPkgKeys.map(key => {
      delete pkg[key];
    });
    writeFileSync(resolve(dist, "package.json"), JSON.stringify(pkg, null, 4));
    console.info("✅ Created package.json in dist folder");
    return this;
  },
  copyFiles: function () {
    copyFileSync(resolve(root, "index.d.ts"), resolve(dist, "index.d.ts"));
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
