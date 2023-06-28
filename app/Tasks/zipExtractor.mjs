/**
 * ZIP extractor.
 */


'use strict';


import fs from 'node:fs';
import fse from 'fs-extra';
import path from 'node:path';
import spawn from 'node:child_process';
import FS from '../Libraries/FS.mjs';


export const zipExtractor = class ZipExtractor {


    #configJSON = {};


    #saveFilePath = '';


    /**
     * Class constructor.
     * 
     * @param {object} options The options
     * @param {object} options.configJSON The config.json contents object.
     * @param {string} options.saveFilePath Downloaded and saved phpmyadmin zip file path.
     */
    constructor(options = {}) {
        if (typeof(options?.configJSON) === 'object') {
            this.#configJSON = options.configJSON;
        }
        if (typeof(options?.saveFilePath) === 'string') {
            this.#saveFilePath = options.saveFilePath;
        }
    }// constructor


    /**
     * Delete downloaded zip file.
     */
    async #deleteDownloadedZip() {
        fs.unlinkSync(this.#saveFilePath);
        console.log('  Deleted downloaded zip file successfully.');
    }// #deleteDownloadedZip


    /**
     * Extract files from zip.
     * 
     * It will be contain phpmyadmin/ folder and contents are inside.
     * 
     * @async
     */
    async #extract() {
        const result = spawn.execSync('7z x "' + this.#saveFilePath + '" -o"' + this.#configJSON.phpMyAdminDir + '"');
        console.log('  Extracted files successfully.');
        return result;
    }// #extract


    /**
     * Get extracted parent folder name.
     * 
     * @returns {string}
     */
    async #getExtractedParentFolderName() {
        const files = await FS.glob('*', {
            absolute: false,
            cwd: this.#configJSON.phpMyAdminDir,
            ignore: this.#configJSON.skipDelete,
        });

        let parentFolderName;
        for (const file of files) {
            parentFolderName = file;
            break;
        }

        return parentFolderName;
    }// #getExtractedParentFolderName


    /**
     * Move files and folders inside parent folder that has been extracted to outside.
     * 
     * Then delete that parent folder.
     * 
     * @param {string} parentFolderName 
     */
    async #moveFilesInParentFolderToOutside(parentFolderName) {
        const files = await FS.glob(
            parentFolderName + '/**',
            {
                absolute: false,
                cwd: this.#configJSON.phpMyAdminDir,
            }
        );

        for (const file of files) {
            const fullPathFileItem = path.resolve(this.#configJSON.phpMyAdminDir, file);
            const regexp = new RegExp('^' + parentFolderName + '(\\/)?', 'giu');
            const removeParentName = file.replace(regexp, '');
            const newPath = path.resolve(this.#configJSON.phpMyAdminDir, removeParentName);
            if (fs.existsSync(fullPathFileItem)) {
                fse.moveSync(fullPathFileItem, newPath, {'overwrite': true});
            }
        }

        // delete parent folder.
        fs.rmSync(
            path.resolve(this.#configJSON.phpMyAdminDir, parentFolderName),
            {
                'recursive': true,
            }
        );

        console.log('  Moved files successfully.');
    }// #moveFilesInParentFolderToOutside


    /**
     * Initialize the class.
     * 
     * @async
     * @returns {Promise}
     */
    async run() {
        console.log('Extracting zip');

        await this.#extract();
        const parentFolderName = await this.#getExtractedParentFolderName();
        await this.#moveFilesInParentFolderToOutside(parentFolderName);
        await this.#deleteDownloadedZip();

        console.log('Extract completed.');
    }// run


}