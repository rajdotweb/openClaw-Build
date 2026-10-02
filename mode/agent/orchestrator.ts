
import { isCancel, text, confirm } from "@clack/prompts";
import chalk from "chalk";
import { generateText, stepCountIs } from "ai";
import { getAgentModel } from "../../ai/ai.config";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-executor";
import { createAgentTools } from "./agent-tools";

export async function runAgentMode() {
  console.log(chalk.bold("\n Agent Mode\n"));

  const goal = await text({
    message: "What would you like the agent to do?",
    placeholder: "Concrete task for this codebase...",
  });
  if (isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);

  console.log(chalk.dim("\nThinking...\n"));
  const result = await generateText({
    model: getAgentModel(),
    system:
      "You are a coding agent working in the user's project. Explore with list_files, search_files and read_file before changing anything. " +
      "Changes are only staged and the user must approve them. Give a short summary when done.",
    prompt: goal,
    tools: createAgentTools(executor),
    stopWhen: stepCountIs(15),
  });

  console.log(result.text);

  const pending = tracker.getpendingMutations();
  if (pending.length === 0) return;

  console.log(chalk.bold(`\n${pending.length} change(s) proposed:\n`));
  for (const a of pending) {
    console.log(chalk.cyan(`${a.type}: ${a.path}`));
    if (a.type === "tool_execute") console.log(chalk.yellow(a.details.command ?? ""));
    else if (a.details.after) console.log(chalk.dim(a.details.after.slice(0, 800)));

    const ok = await confirm({ message: "Approve this change?" });
    if (isCancel(ok)) break; // leaves the rest pending, nothing is applied
    tracker.updateStatus(a.id, ok ? "approved" : "rejected", ok);
  }

  const { errors } = executor.applyApprovedFromTracker();
  if (errors.length) console.log(chalk.red("\nErrors:\n" + errors.join("\n")));
  else console.log(chalk.green("\nDone."));
}