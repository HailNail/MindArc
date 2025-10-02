import config from "./config.js";
import Stripe from "stripe";

const stripe = new Stripe(config.stripe.secretKey);

export default stripe;
