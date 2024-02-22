const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();

// routes login & register
router.use("/register", require("./register"));
router.use("/login", require("./login"));

// middleware
router.use(function (req, res, next) {
  //   console.log(req.session);
  if (!req.session.userId) {
    const error = `Please Login First!`;
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
}); // session untuk user

// homepage
router.use("/homepage", require("./homepage"))
router.get("/", (req, res) => {
  res.redirect("/homepage");
});
router.use("/profile", require("./profile"))
router.get("/logout", Controller.getLogout);

module.exports = router;
