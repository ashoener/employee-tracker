import inquirer from "inquirer";

class BasePrompt {
  /**
   * @param {import("inquirer").QuestionCollection<import("inquirer").Answers>} questions
   */
  constructor(questions) {
    this.questions = questions;
  }

  async prompt() {
    const response = await inquirer.prompt(this.questions);
    return this.handleResponse(response);
  }

  /**
   * Handle the response
   * @param {import("inquirer").Answers} response
   */
  async handleResponse(response) {}
}

export default BasePrompt;
