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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjQ0Njk4MzRkNDBmMDVjMWJmYjQxZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3ODQ3NzA0fQ.zfrx7dhe_RKYmbjEAJmmvhioKSIT064eoW92fbKiTTQ";
  return token;
};
