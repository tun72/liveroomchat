let users = [];

exports.getUser = (id) => users.find((user) => user._id === id);

exports.removeUser = (id) => {
  users = users.filter((user) => user._id !== id);

};
exports.getSameRoomUsers = (room) => users.filter((user) => user.room === room);

exports.storeUser = (_id, username, room) => {
  let user = users.find((user) => user.username === username);
  if (!user) {
    user = { _id, username, room };

    users.push(user);
  }

  return user;
};
