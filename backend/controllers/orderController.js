import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import stripe from "../config/stripe.js";

//Utility Function
const calcPrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0.15 : 3;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: itemsPrice,
    shippingPrice: shippingPrice,
    taxPrice: taxPrice,
    totalPrice: totalPrice,
  };
};

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemsFromDB) => itemsFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(400);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const pageNumber = Number(req.query.page) || 1;
    const count = await Order.countDocuments({});
    const skipAmount = pageSize * (pageNumber - 1);
    const orders = await Order.find({})
      .populate("user", "id username")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skipAmount);
    res.json({
      orders,
      pageNumber,
      pages: Math.ceil(count / pageSize),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const pageNumber = Number(req.query.page) || 1;
    const count = await Order.countDocuments({ user: req.user._id });
    const skipAmount = pageSize * (pageNumber - 1);
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "id username")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skipAmount);
    res.json({
      orders,
      pageNumber,
      pages: Math.ceil(count / pageSize),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { totalPrice } = req.body; // amount from frontend
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // for cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: new Date().toDateString(),
        email_address: req.body.receipt_email || req.user.email,
      };

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  findOrderById,
  createPaymentIntent,
  markOrderAsPaid,
  markOrderAsDelivered,
};
