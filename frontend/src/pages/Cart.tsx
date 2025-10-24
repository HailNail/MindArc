import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../types/hooks";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../redux/features/cart/cartSlice";
import {
  Box,
  Container,
  Flex,
  Text,
  Link as RadixLink,
  Heading,
  AspectRatio,
  Select,
  Button,
} from "@radix-ui/themes";
import type { CartItem } from "../types/cartTypes";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { apiSlice } from "../redux/api/apiSlice";
import { orderApiSlice } from "../redux/api/orderApiSlice";
import { productApiSlice } from "../redux/api/productApiSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cart);
  const { cartItems } = cart;

  const updateQuantityHandler = (productId: string, quantity: number) => {
    dispatch(updateCartQuantity({ _id: productId, quantity }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      cartItems.forEach((item) => {
        dispatch(
          productApiSlice.endpoints.getProductDetails.initiate(item._id)
        );
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [cartItems, dispatch]);
  return (
    <Container ml={{ initial: "0", md: "4rem" }}>
      <Flex justify="between" wrap="wrap" mx="2" mt="7">
        {cartItems.length === 0 ? (
          <Box>
            <Text>
              Your card is empty{" "}
              <RadixLink asChild>
                <Link to="/shop">Go To Shop</Link>
              </RadixLink>
            </Text>
          </Box>
        ) : (
          <>
            <Flex direction="column">
              <Heading weight="medium" mb="4">
                Shopping Cart
              </Heading>

              {cartItems.map((item) => (
                <Flex align="center" mb="2" key={item._id}>
                  <Box
                    flexShrink="0"
                    flexBasis={{ initial: "6rem", md: "10rem" }}
                    position="relative"
                  >
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </AspectRatio>
                  </Box>

                  <Box flexGrow="1" ml="4">
                    <RadixLink asChild>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </RadixLink>

                    <Box mt="2">
                      <Text>{item.brand}</Text>
                    </Box>
                    <Box mt="2">
                      {" "}
                      <Text weight="medium">$ {item.price}</Text>
                    </Box>
                  </Box>
                  <Box>
                    <Select.Root
                      value={String(item.quantity)}
                      onValueChange={(val) => {
                        const newQuantity = Number(val);
                        if (newQuantity <= item.countInStock) {
                          updateQuantityHandler(item._id, newQuantity);
                        } else {
                          toast.error(
                            `Only ${item.countInStock} items available`
                          );
                        }
                      }}
                    >
                      <Select.Trigger>{item.quantity}</Select.Trigger>
                      <Select.Content
                        position="popper"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {[...Array(item?.countInStock).keys()].map((x) => (
                          <Select.Item key={x + 1} value={String(x + 1)}>
                            {x + 1}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Button
                      ml="4"
                      onClick={() => removeFromCartHandler(item._id)}
                      variant="soft"
                      color="ruby"
                    >
                      <FaTrash />
                    </Button>
                  </Box>
                </Flex>
              ))}

              <Container mt="5">
                <Box p="4" className="rounded-lg">
                  <Text size="3" weight="medium">
                    Items (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </Text>

                  {cartItems.some(
                    (item) => item.quantity > item.countInStock
                  ) && (
                    <Box
                      mt="2"
                      style={{
                        background: "var(--red-3)",
                        padding: "8px",
                        borderRadius: "4px",
                      }}
                    >
                      <Text size="2" color="red">
                        ⚠️ Some items in your cart exceed available stock
                      </Text>
                    </Box>
                  )}

                  <Box mt="4">
                    <Text size="5" as="p" weight="medium">
                      ${" "}
                      {cartItems
                        .reduce(
                          (acc, item) => acc + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </Text>
                  </Box>
                  <Button
                    mt="4"
                    radius="full"
                    disabled={
                      cartItems.length === 0 ||
                      cartItems.some(
                        (item) => item.quantity > item.countInStock
                      )
                    }
                    onClick={checkoutHandler}
                  >
                    {cartItems.some((item) => item.quantity > item.countInStock)
                      ? "Adjust quantities to proceed"
                      : "Proceed To Checkout"}
                  </Button>
                </Box>
              </Container>
            </Flex>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default Cart;
