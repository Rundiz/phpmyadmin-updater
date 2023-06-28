/**
 * Run the command `composer update` to make sure all required vendor files is installed.
 */


'use strict';


import spawn from 'node:child_process';


export const composerUpdater = class ComposerUpdater {


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
        console.log('Installing phpMyAdmin from composer command.');

        let composerPath;
        if (typeof(this.#configJSON.composerPath) === 'string' && this.#configJSON.composerPath !== '') {
            // if `composerPath` is set in config.json and not empty.
            composerPath = this.#configJSON.composerPath;
        } else {
            composerPath = 'composer';
        }

        spawn.execSync(composerPath + ' create-project ' + this.#configJSON.composerPackage + ' --no-dev', {
            'cwd': this.#configJSON.phpMyAdminDir,
            'stdio': [],
        });

        console.log('  Completed.');
        return Promise.resolve(true);
    }// run


}