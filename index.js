/**
 * PHP MyAdmin updater.
 */


'use strict';


import * as fs from 'node:fs';
import { clearOldFilesTask } from './app/Tasks/clearOldFiles.mjs';
import { gitDownloader } from './app/Tasks/gitDownloader.mjs';
import { zipExtractor } from './app/Tasks/zipExtractor.mjs';


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

let result, saveFilePath;
try {
    const clearOldFilesTaskObj = new clearOldFilesTask({'configJSON': configJSON});
    result = await clearOldFilesTaskObj.run();
} catch (ex) {
    console.error('Error: ' + ex.message);
}

if (typeof(result) !== 'undefined') {
    try {
        const gitDownloaderObj = new gitDownloader({'configJSON': configJSON});
        saveFilePath = await gitDownloaderObj.run();
    } catch (ex) {
        console.error('Error: ' + ex.message);
    }
}

if (saveFilePath) {
    try {
        const zipExtractorObj = new zipExtractor({
            'configJSON': configJSON, 
            'saveFilePath': saveFilePath,
        });
        await zipExtractorObj.run();
        console.log('Update completed successfully.');
    } catch (ex) {
        console.error('Error: ' + ex.message);
    }
}