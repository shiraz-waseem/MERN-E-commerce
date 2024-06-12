const passport = require("passport");

exports.isAuth = async = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // TODO : this is temporary token for testing without cookie
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjkzY2MyNWRmNzViZWJiYmQzOGQ2NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE4MTcyOTA2fQ.ACe0jtWbYkG2zgwEYg9qZ8WiZ6Zu43SIOYJ8pKxOPtE";
  return token;
};
