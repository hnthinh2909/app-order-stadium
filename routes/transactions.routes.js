var express = require("express");
var router = express.Router();

const Transaction = require("../controller/transaction.controller.js");


router.get("/", Transaction.index);

router.get("/edit/:id", Transaction.edit );

router.post("/edit", Transaction.editPost);

router.get("/delete/:id", Transaction.delete);


module.exports = router;