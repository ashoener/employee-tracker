import BasePrompt from "./basePrompt.js";

class CallbackPrompt extends BasePrompt {
  /**
   * Pass an array questions, and the callback will be fired when they are submitted
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
