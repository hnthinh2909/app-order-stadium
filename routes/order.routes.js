const express = require("express");
const router = express.Router();

const OrderController = require("../controller/order.controller.js");
// router index order

router.get("/", OrderController.index);

// router order - logined

router.get("/order", OrderController.order);


router.post("/order", OrderController.orderPost);

router.get("/order/submit", OrderController.submit);

router.post("/order/submit", OrderController.submitPost);
// router order - not login

module.exports = router;