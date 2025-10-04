import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

import type { StripePaymentResult } from "../types/orderTypes";
import { Button } from "@radix-ui/themes";
import type { usePayOrderMutation } from "../redux/api/orderApiSlice";

interface CheckoutFormProps {
  orderId: string;
  payOrder: ReturnType<typeof usePayOrderMutation>[0];
  refetch: () => void;
}
const CheckoutForm = ({ orderId, payOrder, refetch }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Paiment failed");
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await payOrder({
        orderId,
        details: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          payment_method: paymentIntent.payment_method as string,
        } as StripePaymentResult,
      });

      refetch();
      toast.success("Payment successful!");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button style={{ width: "100%" }} mt="4" type="submit" disabled={!stripe}>
        Pay now
      </Button>
    </form>
  );
};

export default CheckoutForm;
