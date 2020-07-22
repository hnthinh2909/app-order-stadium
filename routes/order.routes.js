const express = require("express");
const router = express.Router();

const OrderController = require("../controller/order.controller.js");
// router index order

router.get("/", OrderController.index);

router.get("/:page", OrderController.index);
// router order - logined

router.get("/order/:id", OrderController.order);

router.post("/order", OrderController.orderPost);

router.get("/delete/:id", OrderController.delete);

router.get("/order/submit", OrderController.submit);

router.post("/order/submit", OrderController.submitPost);
// router order - not login


module.exports = router;