/**
 * File system class.
 */


'use strict';



import fs from 'node:fs';
import { globby } from 'globby';


export default class FS {


    /**
     * Perform asynchronous glob search.
     * 
     * @link https://www.npmjs.com/package/globby globby document.
     * @link https://github.com/mrmlnc/fast-glob fast glob document.
     * @async
     * @param {string[]} pattern Pattern to be matched.
     * @param {object} options The node package 'fast-glob' options. Set to empty object to use default options.
     * @return {Promise} Return Promise object.
     */
    static async glob(pattern, options = {}) {
        if (typeof(pattern) !== 'string' && typeof(pattern) !== 'object') {
            throw new Error('The pattern argument must be string or array.');
        }

        if (typeof(options) !== 'object') {
            throw new Error('The options argument must be object.');
        }

        let defaults = {
            absolute: true,
            baseNameMatch: false,
            dot: true,
            onlyDirectories: false,
            onlyFiles: false,
        };
        options = {
            ...defaults,
            ...options
        };

        const result = await globby(pattern, options);
        return result;
    }// glob


    /**
     * Check if folder is empty or not.
     * 
     * @param {string} dirname 
     * @returns 
     */
    static async isDirEmpty(dirname) {
        return fs.promises.readdir(dirname).then(files => {
            return files.length === 0;
        });
    }


}