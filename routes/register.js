const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();

router.get("/", Controller.register);
router.post("/", Controller.postRegister);


module.exports = router;