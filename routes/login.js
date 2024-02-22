const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();

router.get("/", Controller.login);
router.post("/", Controller.postLogin);


module.exports = router;