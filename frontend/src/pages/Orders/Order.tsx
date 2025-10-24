import { useParams, Link } from "react-router-dom";
import { useAppSelector, type CustomFetchError } from "../../types/hooks";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import CheckoutForm from "../../components/CheckoutForm";
import { useEffect, useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  DataList,
  Flex,
  Heading,
  Spinner,
  Table,
  AspectRatio,
  Link as RadixLink,
} from "@radix-ui/themes";

const Order = () => {
  const { data, isLoading: loadingPublishKey } =
    useGetStripePublishableKeyQuery();
  const stripePromise = useMemo(() => {
    if (data?.publishableKey) {
      return loadStripe(data.publishableKey);
    }
    return null; // don’t init until we have the key
  }, [data]);

  const { id: orderId } = useParams();
  const { userInfo } = useAppSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId!);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [
    createPaymentIntent,
    {
      data: paymentIntentData,
      isLoading: loadingPaymentIntent,
      error: paymentIntentError,
    },
  ] = useCreatePaymentIntentMutation();

  const clientSecret = paymentIntentData?.clientSecret || null;

  useEffect(() => {
    if (order && !order.isPaid && !clientSecret && !loadingPaymentIntent) {
      createPaymentIntent({
        totalPrice: order.totalPrice,
      });
    }
  }, [order, clientSecret, loadingPaymentIntent, createPaymentIntent]);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId!).unwrap();
      refetch();
      toast.success("Order delivered");
    } catch (error) {
      toast.error(
        (error as CustomFetchError).data?.message || "Something went wrong"
      );
    }
  };

  if (loadingPublishKey || !stripePromise) {
    return (
      <Flex width="100%" justify="center">
        <Spinner />
      </Flex>
    );
  }

  if (paymentIntentError) {
    return (
      <Message variant="error">
        {(paymentIntentError as CustomFetchError).data?.message ||
          "Payment initialization failed"}
      </Message>
    );
  }

  return isLoading ? (
    <Flex width="100%" justify="center">
      <Spinner />
    </Flex>
  ) : error ? (
    <Message variant="error">
      {" "}
      {(error as CustomFetchError).data?.message || "Something went wrong"}
    </Message>
  ) : (
    <Container
      mt="6"
      size={{ initial: "1", md: "3", lg: "4" }}
      ml={{ initial: "0", md: "4rem" }}
    >
      <Flex direction={{ initial: "column", md: "row" }} gap="4">
        {/* Left - order items */}
        <Box p="2" width={{ initial: "100%", md: "66%" }}>
          {order?.orderItems.length === 0 ? (
            <Message variant="info">Order is empty</Message>
          ) : (
            <Table.Root size="3">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {order?.orderItems.map((item, index) => (
                  <Table.Row key={index} style={{ verticalAlign: "middle" }}>
                    <Table.ColumnHeaderCell>
                      <Box width="4rem">
                        <AspectRatio ratio={4 / 4}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                              borderRadius: "var(--radius-2)",
                            }}
                          />
                        </AspectRatio>
                      </Box>
                    </Table.ColumnHeaderCell>
                    <Table.Cell>
                      <RadixLink asChild>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </RadixLink>
                    </Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>$ {item.price}</Table.Cell>
                    <Table.Cell>
                      $ {(item.quantity * item.price).toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
        {/* Right - summary + payment */}
        <Box p="2" width={{ initial: "100%", md: "34%" }}>
          <Heading size="5" mb="3">
            Shipping
          </Heading>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Order:</DataList.Label>
              <DataList.Value>{order?._id}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Name:</DataList.Label>
              <DataList.Value>{order?.user.username}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Email:</DataList.Label>
              <DataList.Value>{order?.user.email}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Address:</DataList.Label>
              <DataList.Value>
                <Badge size="2">
                  {order?.shippingAddress.address} {order?.shippingAddress.city}{" "}
                  {order?.shippingAddress.postalCode}{" "}
                  {order?.shippingAddress.country}
                </Badge>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Method:</DataList.Label>
              <DataList.Value>{order?.paymentMethod}</DataList.Value>
            </DataList.Item>
          </DataList.Root>

          <Heading size="5" my="3">
            Order Summary
          </Heading>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Items:</DataList.Label>
              <DataList.Value>$ {order?.itemsPrice.toFixed(2)}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Shipping:</DataList.Label>
              <DataList.Value>
                $ {order?.shippingPrice.toFixed(2)}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Tax:</DataList.Label>
              <DataList.Value>$ {order?.taxPrice.toFixed(2)}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Total:</DataList.Label>
              <DataList.Value>
                <Badge size="2">$ {order?.totalPrice.toFixed(2)}</Badge>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
          {order?.isPaid ? (
            <Box my="4">
              <Message variant="success">Paid on {order.paidAt}</Message>
            </Box>
          ) : (
            <Box mt="4">
              {loadingPay && <Spinner />}
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    orderId={orderId!}
                    payOrder={payOrder}
                    refetch={refetch}
                  ></CheckoutForm>
                </Elements>
              )}
            </Box>
          )}
          {loadingDeliver && <Spinner />}
          {userInfo?.isAdmin && order?.isPaid && !order.isDelivered && (
            <Button onClick={deliverHandler}>Mark As Delivered</Button>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default Order;
