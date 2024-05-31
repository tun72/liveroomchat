module.exports = function format(username, message) {
  return { username, message, sent_at:  Date.now() };
};
