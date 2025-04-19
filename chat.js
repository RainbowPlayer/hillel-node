const EventEmitter = require('events');

class Chat extends EventEmitter {
  send(text) {
    this.emit('message', text);
  }
}

module.exports = Chat;
