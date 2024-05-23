const jwt = require('jsonwebtoken');
const secret = '$uperMan@123';

function checkForAuthenticationCookie() {
  return (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
      return next();
    }

    try {
      const userPayload = jwt.verify(token, secret);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
}

function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) {
    return res.redirect('/user/signin');
  }

  try {
    const user = jwt.verify(token, secret);
    req.user = user;
    return next();
  } catch (err) {
    return res.redirect('/user/signin');
  }
}

module.exports = {
  checkForAuthenticationCookie,
  authenticateToken,
};
