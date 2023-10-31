import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

class BasePrompt {
  /**
   * Create a basic prompt. handleResponse must be implemented by a sub class.
   * @param {import("inquirer").QuestionCollection<import("inquirer").Answers>} questions
   */
  constructor(questions) {
    this.questions = questions;
  }

  /**
   * Start the actual prompt
   */
  async prompt() {
    let response;
    try {
      response = await inquirer.prompt(this.questions);
    } catch (e) {
      if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
        console.clear();
        return this.prompt();
      }
    }
    return this.handleResponse(response);
  }

  /**
   * Handle the response
   * @param {import("inquirer").Answers} response
   */
  async handleResponse(response) {}
}

export default BasePrompt;
