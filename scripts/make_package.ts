import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const SRC_DIR = 'public';
const DEST_DIR = 'packages';
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', SRC_DIR, 'manifest.json'), {encoding: 'utf8'}));
const PACKAGE_NAME = `${manifest.name}_${manifest.version}.zip`;

const absoluteSrcDir = path.join(__dirname, '..', SRC_DIR);
const absoluteDestDir = path.join(__dirname, '..', DEST_DIR);

if (!fs.existsSync(absoluteDestDir)) {
    fs.mkdirSync(absoluteDestDir);
}

const output = fs.createWriteStream(path.join(absoluteDestDir, PACKAGE_NAME));

const archive = archiver.create('zip', {
    zlib: { level: 9 }
});

archive.pipe(output);
archive.glob('**', {cwd: absoluteSrcDir});
archive.finalize()
    .then(() => console.log('build success!'))
    .catch(e => {
        console.error('build Failed...');
        console.error(e);
    });
