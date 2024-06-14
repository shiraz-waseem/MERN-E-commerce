const passport = require("passport");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "shirazwaseemwork@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

// since function ha tw req.body sy nahi aye gy function ke andr aya ga
exports.sendMail = async function ({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: "E-commerce Store <shirazwaseem@gmail.com>", // sender address
    to, // list of receivers
    subject,
    text,
    html,
  });
  return info;
};

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
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjkzY2MyNWRmNzViZWJiYmQzOGQ2NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE4MTcyOTA2fQ.ACe0jtWbYkG2zgwEYg9qZ8WiZ6Zu43SIOYJ8pKxOPtE";
  return token;
};
