/**
 * Move files from inside parent folder to outside where it is main folder.
 * 
 * Example: files are in dir/phpmyadmin/*.*  
 * Move them to dir/*.*
 */


'use strict';


import fs from 'node:fs';
import fse from 'fs-extra';
import path from 'node:path';
import FS from '../Libraries/FS.mjs';


export const filesMover = class FilesMover {


    #configJSON = {};


    /**
     * Class constructor.
     * 
     * @param {object} options The options
     * @param {object} options.configJSON The config.json contents object.
     */
    constructor(options = {}) {
        if (typeof(options?.configJSON) === 'object') {
            this.#configJSON = options.configJSON;
        }
    }// constructor


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
        console.log('Moving files and folders inside sub folder to main folder.');

        const parentFolderName = await this.#getExtractedParentFolderName();
        await this.#moveFilesInParentFolderToOutside(parentFolderName);

        return Promise.resolve(true);
    }// run


}