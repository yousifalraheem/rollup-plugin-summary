const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const dist = path.resolve(__dirname, "../dist");
const root = path.resolve(__dirname, "../");
const unwantedPkgKeys = ["devDependencies", "scripts", "config", "commitlint", "husky", "release"];

function writePackage() {
    unwantedPkgKeys.map(key => { delete pkg[key] });
    fs.writeFileSync(path.resolve(dist, "package.json"), JSON.stringify(pkg, null, 4));
    console.info("✅ Created package.json in dist folder");
}

function copyFiles() {
    fs.copyFileSync(path.resolve(root, "index.d.ts"), path.resolve(dist, "index.d.ts"));
    fs.copyFileSync(path.resolve(root, "README.md"), path.resolve(dist, "README.md"));
    fs.copyFileSync(path.resolve(root, "LICENSE"), path.resolve(dist, "LICENSE"));
    console.info("✅ Copied over index.d.ts to dist");
    console.info("✅ Copied over README.md to dist");
    console.info("✅ Copied over LICENSE to dist");
}

console.info("\n⏳ Preparing for release")
writePackage();
copyFiles();
console.info("🎉 Done. Package is ready to be published.\n");
