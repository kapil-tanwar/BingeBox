import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { ENV_VARS } from "../config/envVar.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies["netflix-jwt"] || bearerToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    const secret = ENV_VARS.JWT_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
