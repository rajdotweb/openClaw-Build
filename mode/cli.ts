import { runAgentMode } from "./agent/orchestrator";
import chalk from "chalk";
import {select , isCancel} from "@clack/prompts";
import { runAskMode } from "./ask/orchestrator";

export async function runCliMode(){
    while (true) {
        const mode = await select({
            message: "Choose CLI sub mode", 
            options :[
                {value : "agent", label  : "Agent Mode"},
                {value : "plan", label : "Plan Mode"},
                {value : "ask", label: "Ask Mode"},
                {value : "back", label : "<- back to main menu"},
            ],
        });
        if(isCancel(mode) || mode == "back") return;

        if (mode == "agent") {
            await runAgentMode();
        }
        if(mode == "plan"){
            console.log("plan")
        }
        if(mode == "ask"){
            await runAskMode();
        }

        if(mode != "agent" && mode != "plan" && mode != "ask"){
            console.log(chalk.yellow("\nThis mode is not implemented yet.\n"))
        }
    }
}