#!/usr/bin/env node
import {processArguments} from "./commands/process-arguments";

async function main(){
    await processArguments();
}

main();