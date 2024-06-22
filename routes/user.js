const { Router } = require("express");
const User = require("../models/user");
require("../middlewares/authentication");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("authToken", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password ,role } = req.body;
  await User.create({
    fullname,
    email,
    password,
    role
  });
  return res.redirect("/user/signin");
});

router.get("/logout", (req, res) => {
  res.clearCookie("authToken").redirect("/");
});

module.exports = router;
