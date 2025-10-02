import express from "express";
import {
  calculateStripeTotalSales,
  calculateStripeSalesByDate,
} from "../controllers/stripeController.js";

const router = express.Router();

router.get("/sales", calculateStripeTotalSales);
router.get("/sales-by-date", calculateStripeSalesByDate);

export default router;
