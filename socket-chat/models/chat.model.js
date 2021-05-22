
class Message {

  content;
  author;
  timestamp;

  constructor(content, author) {
    this.content = content;
    this.author = author;
    this.timestamp = new Date().getTime();
  }

}

class ChatRoom {

  constructor() {
    this.allMessages = [];
    this.usersInRoom = {};
  }

  get usersOnline() {
    return Object.values(this.usersInRoom);
  }

  joinMessage(content, author) {
    this.allMessages.unshift(new Message(content, author));
  }

  connectUser(user) {
    this.usersInRoom[user.uid] = user;
  }

  disconnectUser(uid) {
    delete this.usersInRoom[uid];
  }

}

module.exports = ChatRoom;