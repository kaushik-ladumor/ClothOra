import express from "express";
import passport from "passport";

const route = express.Router();

route.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Welcome to protected route", user: req.user });
  }
);

export default route;
