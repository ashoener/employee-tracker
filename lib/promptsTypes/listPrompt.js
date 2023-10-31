import BasePrompt from "./basePrompt.js";

class ListPrompt extends BasePrompt {
  /**
   * Pass an array with arrays of strings and functions
   * The strings are used as the prompts, and the functions are called when that prompt is selected
   * @param {String} question The question to ask
   * @param {[[string, function]]} choices Choices paired with callback methods
   */
  constructor(question, choices) {
    let choiceArray = choices.map((c) => c[0]);
    super([
      {
        name: "option",
        message: question,
        type: "list",
        choices: choiceArray,
      },
    ]);

    this.choices = choiceArray;
    this.callbacks = choices.map((c) => c[1]);
  }

  /**
   * Handle the response
   * @param {{
   *    option: String
   * }} response
   */
  async handleResponse({ option }) {
    return this.callbacks[this.choices.indexOf(option)]();
  }
}

export default ListPrompt;
