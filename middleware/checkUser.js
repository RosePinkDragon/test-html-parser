import axios from "axios";

import { AUTH_URL } from "../config.js";

export const requireUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw Error("Not Authorized");
    const { data } = await axios.get(
      `${AUTH_URL}/auth/check-auth`,
      { that: "thit" },
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (!data.success) throw Error("Not Authorized");
    next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ success: false, error: error.message || "Not Authorized" });
  }
};
