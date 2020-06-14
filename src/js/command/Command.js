class Command {
  constructor(receiver) {
    this._receiver = receiver;
    this._before = null;
    this._after = null;
  }

  // eslint-disable-next-line class-methods-use-this
  execute() {
    throw new Error('execute(): This method should be implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  undo() {
    throw new Error('undo(): This method should be implemented.');
  }
}

export default Command;
