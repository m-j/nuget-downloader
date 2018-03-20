import {AxiosInstance} from "axios";
import * as yargs from 'yargs';
import {newerAvailableCommand} from "./newer-available";
import {latestCommand} from "./latest";
import {installPackageCommand} from "./install-package";

export function processArguments() {
    return new Promise((resolve: any, reject: any) => {
        yargs
            .option('id', {
                description: 'package id',
                required: true,
                type: 'string',
                requiresArg: true
            })
            .option('config', {
                description: 'nuget.config path defaults to home dir config',
                required: false,
                type: 'string',
                requiresArg: true
            })
            .option('source', {
                description: 'source from config to use',
                required: true,
                type: 'string',
                requiresArg: true
            })
            .command('latest', 'gets latest version of package', yargs => {
                return yargs;
            }, argv => latestCommand(argv).then(resolve).catch(reject))
            .command('newer-available', 'checks if there is newer version of package outputting true or false', yargs => {
                return yargs
                    .option('path', {
                        description: 'instalation path',
                        required: true,
                        type: 'string',
                        requiresArg: true
                    });
            }, argv => newerAvailableCommand(argv).then(resolve).catch(reject))
            .command('install', 'install package', yargs => {
                return yargs
                    .option('path', {
                        description: 'installation path',
                        required: true,
                        type: 'string',
                        requiresArg: true
                    })
                    .option('pversion', {
                        description: 'version of package, if not provided uses latest',
                        type: 'string',
                        requiresArg: true
                    })
                    .option('clean', {
                        description: 'should we clean directory before installing',
                        type: 'boolean',
                        requiresArg: false
                    })
            }, argv => installPackageCommand(argv).then(resolve).catch(reject))
            .demandCommand(1, 1, 'must provide a command')
            .help().argv;
    });


    // return new Promise((resolve, reject)=> {
    //
    // })
}