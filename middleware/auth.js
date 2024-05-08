const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET_KEY;

const authenticateJwt = (request, response, next) => {
    const header = request.headers["authorization"];

    let jwtToken;

    if (header !== undefined) {
        jwtToken = header.split(" ")[1];
    }

    if (header === undefined) {
        return response.status(401).json({message: "Invalid JWT Token"})
    } else {
        jwt.verify(jwtToken, SECRET, async (error, payload) => {
            if (error) {
                return response.status(401).json({message: "Invalid JWT Token"})
            } else {
              request.userData = {user_id: payload.user_id, role: payload.role};
              next();
            }
        });
    }
}

module.exports = {SECRET, authenticateJwt};