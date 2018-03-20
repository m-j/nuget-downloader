import {AxiosInstance} from "axios";
import * as yargs from 'yargs';
import {newerAvailableCommand} from "./newer-available";
import {latestCommand} from "./latest";

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
                // return yargs.option('id', {
                //     description: 'package id',
                //     required: true,
                //     type: 'string',
                //     requiresArg: true
                // });
            }, argv => latestCommand(argv).then(resolve).catch(reject))
            .command('newer-available', 'checks if there is newer version of package outputting true or false', yargs => {
                return yargs
                    // .option('id', {
                    //     description: 'package id',
                    //     required: true,
                    //     type: 'string',
                    //     requiresArg: true
                    // })
                    .option('path', {
                        description: 'instalation path',
                        required: true,
                        type: 'string',
                        requiresArg: true
                    });
            })
            .command('install', 'install package', yargs => {
                return yargs
                    // .option('id', {
                    //     description: 'package id',
                    //     required: true,
                    //     type: 'string',
                    //     requiresArg: true
                    // })
                    .option('path', {
                        description: 'instalation path',
                        required: true,
                        type: 'string',
                        requiresArg: true
                    })
                    .option('version', {
                        description: 'version of package, if not provided uses latest',
                        type: 'string',
                        requiresArg: true
                    })
                    .option('clean', {
                        description: 'should we clean directory before installing',
                        type: 'boolean',
                        requiresArg: false
                    })
            })
            .demandCommand(1, 1, 'must provide a command')
            .help().argv;
    });


    // return new Promise((resolve, reject)=> {
    //
    // })
}