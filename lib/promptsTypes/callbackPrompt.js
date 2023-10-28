import BasePrompt from "./basePrompt.js";

class CallbackPrompt extends BasePrompt {
  /**
   * @param {import("inquirer").QuestionCollection<import("inquirer").Answers>} questions
   */
  constructor(questions, callback) {
    super(questions);

    this.callback = callback;
  }

  /**
   * Handle the response
   * @param {import("inquirer").Answers} response
   */
  async handleResponse(response) {
    return this.callback(response);
  }
}
