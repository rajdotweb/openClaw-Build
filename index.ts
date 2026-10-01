#!/usr/bin/env bun

import {Command} from "commander";
const program = new Command();

program
.name("openClawAVI")
.description("Personal Assistant")
.version("0.0.1");

program
.command("wakeup")
.description("show the command and pick cli or telegram mode")
.action(async () => {
    console.log("Wakeup calling...");
});
await program.parseAsync(process.argv);
