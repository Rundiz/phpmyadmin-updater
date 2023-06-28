/**
 * GitHub downloader.
 */


'use strict';


import path from 'node:path';
import spawn from 'node:child_process';


export const gitDownloader = class GitDownloader {


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
     * Download file from `url` and save to phpMyAdmin folder.
     * 
     * @param {string} url 
     * @param {string} saveFilePath
     */
    #download(url, saveFilePath) {
        return spawn.execSync('curl -o "' + saveFilePath + '" "' + url + '" -L -s');
    }// #download


    /**
     * Initialize the class.
     * 
     * @async
     * @returns {Promise}
     */
    async run() {
        let execResult;
        let downloadResult;
        let saveFilePath;

        try {
            execResult = spawn.execSync('curl -s ' + this.#configJSON.phpMyAdminGitHubReleaseURL);
            const resultJSON = JSON.parse(execResult.toString());
            saveFilePath = path.resolve(this.#configJSON.phpMyAdminDir, 'phpmyadmin_dl.zip');

            console.log('Downloading latest phpMyAdmin from ' + resultJSON.zipball_url);
            downloadResult = await this.#download(resultJSON.zipball_url, saveFilePath);
        } catch (ex) {
            console.error('Error: ' + ex.message);
            return Promise.reject(ex);
        }

        if (downloadResult) {
            console.log('Download completed.');
            return Promise.resolve(saveFilePath);
        } else {
            return Promise.reject();
        }
    }// run


}