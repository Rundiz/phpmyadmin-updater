/**
 * PHP MyAdmin updater.
 */


'use strict';


import * as fs from 'node:fs';
import { clearOldFilesTask } from './app/Tasks/clearOldFiles.mjs';
import { composerUpdater } from './app/Tasks/composerUpdater.mjs';
import { filesMover } from './app/Tasks/filesMover.mjs';


// read config.json. ---------------------------
const filePath = new URL('./config.json', import.meta.url);
const configJSON = JSON.parse(
    fs.readFileSync(filePath, {encoding: 'utf8'})
);
// read config.json. ---------------------------

if (typeof(configJSON) !== 'object') {
    console.error('Error: config.json is not exists or malform.');
    process.exit(1);
}
console.log('Update phpMyAdmin');


let pmaVersion, result, saveFilePath;
try {
    const clearOldFilesTaskObj = new clearOldFilesTask({'configJSON': configJSON});
    result = await clearOldFilesTaskObj.run();
} catch (ex) {
    console.error('Error: ' + ex.message);
}


if (result) {
    try {
        const composerUpdaterObj = new composerUpdater({'configJSON': configJSON});
        result = await composerUpdaterObj.run();
    } catch (ex) {
        console.error('Error: ' + ex.message);
    }
}


if (result) {
    try {
        const filesMoverObj = new filesMover({'configJSON': configJSON});
        await filesMoverObj.run();
        console.log('Update completed successfully.');
    } catch (ex) {
        console.error('Error: ' + ex.message);
    }
}