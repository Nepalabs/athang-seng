const verifyAuth = require("../../../../book-library/middlewares/verifyAuth.middleware");
const RevokedToken = require("../modles/revokedToken");
const { verifyJWTToken } = require("../utils/jwt.util");

const verifyJWTToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: `Please provide authorization header` });
  }
  if (!authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: `Please provide token in a valid format` });
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: `Please provide token` });
  }

  const revokedToken = await RevokedToken.findOne({ token });

  if (revokedToken) {
    return res.status(401).json({ message: `Token is already revoked` });
  }

  const data = verifyJWTToken(token);
  if (data.error) {
    return res
      .status(401)
      .json({ message: ` Please provide a valid tken - ${data.message}` });
  }
  req.user = data;
  next();
};
module.exports = verifyAuth;
