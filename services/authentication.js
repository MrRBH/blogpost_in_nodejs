const JWT = require('jsonwebtoken');

const secret = '$uperMan@123';

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
    };
    const token = JWT.sign(payload, secret);
    // console.log(token,1)
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};
