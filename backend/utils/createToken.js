import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, config.jwt, {
    expiresIn: "30d",
  });

  // set JWT as on HTTP-only Cokkie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
