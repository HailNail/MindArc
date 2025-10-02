import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  findOrderById,
  createPaymentIntent,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizedAdmin, getAllOrders);
router.route("/create-payment-intent").post(authenticate, createPaymentIntent);
router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizedAdmin, markOrderAsDelivered);

export default router;
