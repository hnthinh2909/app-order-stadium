const express = require("express");
const router = express.Router();

const StadiumController = require("../controller/stadium.controller.js");

router.get("/", StadiumController.create);

router.post("/", StadiumController.createPost);

module.exports = router;