const express = require("express");
const router = express.Router();

const User = require("../controller/user.controller.js");

router.get("/", User.index);

router.get("/profile/", User.profile);

router.get("/profile/edit/:id", User.edit);

router.post("/profile/edit/", User.editPost);

module.exports = router;