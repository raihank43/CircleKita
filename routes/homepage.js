const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();


router.get("/", Controller.homepage)
router.post("/", Controller.createPost)



module.exports = router