import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAppDispatch,
  useAppSelector,
  type CustomFetchError,
} from "../../types/hooks";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useEffect } from "react";
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Table,
  Link as RadixLink,
  Heading,
  DataList,
  Badge,
  Text,
  Button,
} from "@radix-ui/themes";
import type { OrderItem, ShippingAddress } from "../../types/orderTypes";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const dispatch = useAppDispatch();

  const placeOrderHandler = async () => {
    // Transform CartItem → OrderItem
    // The backend expects each order item to have `product` (product ID),
    // but our CartItem uses `_id`. So here we map the cart data into the
    // shape required by the API (OrderItem).
    const orderItemsToSend: OrderItem[] = cart.cartItems.map((item) => ({
      _id: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    }));
    try {
      const res = await createOrder({
        orderItems: orderItemsToSend,
        shippingAddress: cart.shippingAddress as ShippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(
        (error as CustomFetchError).data?.message || "Failed to create order"
      );
    }
  };
  console.log(cart.shippingPrice);
  return (
    <Container
      mt="6"
      size={{ initial: "1", md: "3", lg: "4" }}
      ml={{ initial: "0", md: "4rem" }}
    >
      <Flex
        align="center"
        justify={{ initial: "center", md: "start" }}
        width="100%"
        p="2"
      >
        <ProgressSteps step1 step2 />
      </Flex>
      <Box>
        {cart.cartItems.length === 0 ? (
          <Message variant="error">Your cart is empty</Message>
        ) : (
          <Box>
            <Table.Root size="3">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cart.cartItems.map((item, index) => (
                  <Table.Row key={index} style={{ verticalAlign: "middle" }}>
                    <Table.RowHeaderCell>
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
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <RadixLink asChild>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </RadixLink>
                    </Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>{item.price.toFixed(2)}</Table.Cell>
                    <Table.Cell>
                      {(item.quantity * item.price).toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Flex mt="6" direction={{ initial: "column", md: "row" }}>
              <Box py="2" pr="4" ml={{ initial: "4", md: "0" }}>
                <Heading size="3" mb="2">
                  Order Summary
                </Heading>
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label>Items:</DataList.Label>
                    <DataList.Value>
                      {cart.itemsPrice.toFixed(2)}
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Shipping:</DataList.Label>
                    <DataList.Value>
                      $ {cart.shippingPrice.toFixed(2)}
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Tax:</DataList.Label>
                    <DataList.Value>
                      $ {cart.taxPrice.toFixed(2)}
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Total:</DataList.Label>
                    <DataList.Value>
                      <Badge>$ {cart.totalPrice.toFixed(2)}</Badge>
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>

                {error && (
                  <Message variant="error">
                    {(error as CustomFetchError).data?.message ||
                      "Something went wrong"}
                  </Message>
                )}
              </Box>
              <Box py="2" px="4">
                <Heading size="3" mb="2">
                  Shipping
                </Heading>

                <Text weight="medium">Address: </Text>
                <Text>
                  {cart.shippingAddress.address} {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.postalCode}{" "}
                  {cart.shippingAddress.country}
                </Text>
              </Box>
              <Box py="2" px="4">
                <Heading size="3" mb="2">
                  Payment method
                </Heading>
                <Text weight="medium">Method: </Text>
                <Text>{cart.paymentMethod}</Text>
              </Box>
            </Flex>

            <Button
              mt="4"
              type="submit"
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
              loading={isLoading}
            >
              Place Order
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PlaceOrder;
