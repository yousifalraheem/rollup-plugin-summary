const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const dist = path.resolve(__dirname, "../dist");
const root = path.resolve(__dirname, "../");
const unwantedPkgKeys = ["dependencies", "devDependencies", "scripts", "config", "commitlint", "husky", "release"];

function writePackage() {
    unwantedPkgKeys.map(key => { delete pkg[key] });
    fs.writeFileSync(path.resolve(dist, "package.json"), JSON.stringify(pkg, null, 4));
}

function copyFiles() {
    fs.copyFileSync(path.resolve(root, "README.md"), path.resolve(dist, "README.md"));
    fs.copyFileSync(path.resolve(root, "LICENSE"), path.resolve(dist, "LICENSE"));
}

writePackage();
copyFiles();