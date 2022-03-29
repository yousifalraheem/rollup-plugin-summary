const { readFileSync, writeFileSync } = require("fs");
const { removeSync, copySync } = require("fs-extra");
const { resolve } = require("path");

const dist = resolve(__dirname, "../dist");
const docs = resolve(__dirname, "../docs");
const index = resolve(dist, "index.md");
const readme = resolve(__dirname, "../README.md");

const PreDocs = {
  cleanDist: function () {
    removeSync(dist);
    console.info("✅ Cleaned dist");
    return this;
  },
  copyDocs: function () {
    copySync(docs, dist, { recursive: true });
    console.info("✅ Copied docs to dist");
    return this;
  },
  mergeIndexes: function () {
    const licenseStr = "\n<hr/>\n\n## License\n\nMIT";
    let readmeStr = readFileSync(readme).toString();
    const docsIndexStr = readFileSync(index).toString();

    const newDocs = (
      readmeStr.split(readmeStr.match(/(<!-- github-only-start -->)([\s\S]*)(<!-- github-only-end -->)/gm)).join("") +
      "\n" +
      docsIndexStr +
      licenseStr
    ).replace('src="docs/assets', 'src="assets');

    writeFileSync(index, newDocs);
    console.info("✅ Merged README with docs index");
    return this;
  },
  prepare: function () {
    console.info("⏳ Generating docs...");
    this.cleanDist().copyDocs().mergeIndexes();
    console.info("🎉 Done. Docs generated successully!\n");
  },
};

PreDocs.prepare();
