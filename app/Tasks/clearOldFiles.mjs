/**
 * Clear old files.
 */


'use strict';


import * as fs from 'node:fs';
import path from 'node:path';
import FS from '../Libraries/FS.mjs';


export const clearOldFilesTask = class ClearOldFiles {


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
     * Initialize the class.
     * 
     * @async
     * @returns {Promise}
     */
    async run() {
        const files = await FS.glob(
            '**',
            {
                absolute: false,
                cwd: this.#configJSON.phpMyAdminDir,
                ignore: this.#configJSON.skipDelete,
            }
        );

        let deletedItems = 0;
        for (const file of files) {
            const fullPath = path.resolve(this.#configJSON.phpMyAdminDir, file);
            if (!fs.existsSync(fullPath)) {
                continue;
            }

            const stats = fs.statSync(fullPath);
            if (stats.isFile()) {
                fs.unlinkSync(fullPath);
                deletedItems++;
            }
        }// endfor;

        // loop again to delete empty folder.
        for (const file of files) {
            const fullPath = path.resolve(this.#configJSON.phpMyAdminDir, file);
            if (!fs.existsSync(fullPath)) {
                continue;
            }
            
            const stats = fs.statSync(fullPath);
            if (!stats.isDirectory()) {
                continue;
            }

            fs.rmSync(fullPath, {'recursive': true});
            deletedItems++;
        }// endfor;

        console.log('Delete old files and folders: ' + deletedItems);
        return Promise.resolve(deletedItems);
    }// run


}