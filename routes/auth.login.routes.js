const express = require("express");
const router = express.Router();

const Sign = require('../controller/sign.controller.js');


router.get("/signin", Sign.signIn);

router.post("/signin", Sign.signInPost);

router.get("/signup", Sign.signUp);

router.post("/signup", Sign.signUpPost)

router.get("/resetpassword/:id", Sign.resetPwd);

router.post("/resetpassword", Sign.resetPwdPost);

router.get("/logout", Sign.logOut);

router.get("/forgetpassword", Sign.indexForget);

router.post("/forgetpassword", Sign.indexForgetPost);

module.exports = router;