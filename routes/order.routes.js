const express = require("express");
const router = express.Router();

const OrderController = require("../controller/order.controller.js");
// router index order

router.get("/", OrderController.index);

// router order - logined

router.get("/order/:id", OrderController.order);


router.post("/order", OrderController.orderPost);

router.get("/order/submit", OrderController.submit);

router.post("/order/submit", OrderController.submitPost);
// router order - not login

router.get("/create", OrderController.create);

router.post("/create", OrderController.createPost);

module.exports = router;