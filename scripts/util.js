const fs = require('fs');
const path = require('path');

module.exports = function (source, target) {
    if (fs.existsSync(source) && fs.existsSync(target)) {
        const folderName = path.basename(source);
        let files = fs.readdirSync(source);

        if (fs.existsSync(`${target}/${folderName}`)) {
            throw new Error(`A folder with the same name ${folderName} already exists in the target.`);
        } else {
            fs.mkdirSync(`${target}/${folderName}`);
        }

        files.forEach((filename) => {
            fs.copyFileSync(`${source}/${filename}`, `${target}/${folderName}/${filename}`);
        });
    } else {
        console.table({ source, target });
        throw new Error("Either the source or the target doesn't exist");
    }
}
