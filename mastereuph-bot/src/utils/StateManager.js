const { EventEmitter } = require('events');
const connection = require('../database/db');

class StateManager extends EventEmitter {
  constructor (opts) {
    super(opts);
    connection
      .then((connection) => {
        this.connection = connection;
      });
  }
}

module.exports = new StateManager();