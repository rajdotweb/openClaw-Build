#!/usr/bin/env bun
import { runWakeup } from "./tui/wakeup";
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
    await runWakeup()
});
await program.parseAsync(process.argv);
