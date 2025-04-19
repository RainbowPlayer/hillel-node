const Chat = require('./chat');
const chat = new Chat();

chat.on('message', (msg) => {
  console.log('New message:', msg);
});

chat.send('Hello World');
