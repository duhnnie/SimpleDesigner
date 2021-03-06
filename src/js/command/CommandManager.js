import CommandFactory from './CommandFactory';

class CommandManager {
  constructor(settings) {
    settings = { ...settings };

    this._size = settings.size;
    this._stack = null;
    this._index = null;
    this.clear();
  }

  /**
   * Executes a command, and if its succesfully executed it is added to commands stack.
   * @param  {Command} command A command to execute.
   * @returns {Boolean} If the command was successfully executed.
   *//**
    *
    * @param  {String} command The valid product key for {@link CommandFactory}.
    * @param  {...any} args The list of arguments for the respective command. Check {@link CommandFactory} for more
    * details about arguments for each product.
    * @returns {Boolean} If the command was successfully executed.
    */
  executeCommand(...args) {
    let command = null;

    if (args.length === 1) {
      [command] = args;
    } else {
      command = CommandFactory.create(...args);
    }

    this._stack = this._stack.slice(0, this._index + 1);
    this._stack.push(command);

    const result = this.redo();
    this._stack = this._stack.slice(this._size * -1, this._index + 1);
    this._index = Math.min(this._index, this._size - 1);

    return result;
  }

  getSteps() {
    return [
      this._index + 1,
      this._stack.length - 1 - this._index,
    ];
  }

  undo() {
    const command = this._stack[this._index];
    let executed = false;

    if (command && command.undo() !== false) {
      this._index -= 1;

      executed = true;
    }

    return executed;
  }

  redo() {
    const nextIndex = this._index + 1;
    const command = this._stack[nextIndex];
    let executed = false;

    if (command && command.execute() !== false) {
      this._index = nextIndex;

      executed = true;
    }

    return executed;
  }

  clear() {
    this._stack = [];
    this._index = -1;
  }
}

export default CommandManager;
