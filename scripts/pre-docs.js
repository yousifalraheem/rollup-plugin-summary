const fs = require("fs");
const path = require("path");

const lisenseNote = `
<hr/>

## License

MIT
`;

const root = path.resolve(__dirname, "../");
const docs = path.resolve(__dirname, "../docs");
const dist = path.resolve(__dirname, "../dist");

function cleanDist() {
    if (fs.existsSync(dist)) {
        fs.rmdirSync(dist, { recursive: true });
        fs.mkdirSync(dist);
    } else {
        fs.mkdirSync(dist);
    }
    console.info("✅ Cleaned dist folder");
}

function prepareDocs() {
    let readme = fs.readFileSync(path.resolve(root, "README.md")).toString();
    let docsIndex = fs.readFileSync(path.resolve(docs, "docs.md")).toString();

    let docsTitle = readme.indexOf("<!-- REMOVE -->");
    readme = readme.substring(0, docsTitle);

    let newDocs = readme + "\n" + docsIndex + "\n" + lisenseNote;
    fs.writeFileSync(path.resolve(dist, "index.md"), newDocs);

    console.info("✅ Created index.md");
}

function copyFiles() {
    fs.copyFileSync(path.resolve(docs, "_config.yml"), path.resolve(dist, "_config.yml"));
    console.info("✅ Copied Jekyll config file to dist");
}

cleanDist();
prepareDocs();
copyFiles();

console.info("🎉 Done. Docs generated successully!");
