import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../types/hooks";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import {
  Box,
  Text,
  Flex,
  Button,
  IconButton,
  Card,
  Inset,
  Badge,
} from "@radix-ui/themes";

import type { Product } from "../../types/productTypes";
import { FaArrowCircleRight } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import "../../styles.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();

  const addToCartHandler = (product: Product, quantity: number) => {
    // 1. Check if the item already exists in the local state copy
    const existingItem = cartItems.find((item) => item._id === product._id);

    // 2. Calculate what the new quantity would be
    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (product.countInStock === 0) {
      toast.error("Sorry, this product is out of stock", {
        autoClose: 3000,
      });
      return;
    }

    // 3. Check if it would exceed available stock
    if (newQuantity > product.countInStock) {
      toast.error(`Only ${product.countInStock} items available in stock`, {
        autoClose: 3000,
      });
      return; // Don't dispatch if it would exceed stock
    }

    dispatch(addToCart({ ...product, quantity }));

    if (existingItem) {
      toast.info("Item quantity updated in cart", {
        autoClose: 3000,
      });
    } else {
      toast.success("Item added successfully", {
        autoClose: 3000,
      });
    }
  };
  return (
    <Box position="relative" width={{ initial: "18rem", md: "16rem" }} m="1">
      <Card className="bg-[var(--gray-3)]">
        <Inset clip="padding-box" side="top" pb="current">
          <Box position="relative">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full rounded-t-lg object-cover aspect-4/3"
              />
              <Box position="absolute" bottom="3" right="3">
                <Badge
                  variant="solid"
                  radius="full"
                  size={{ initial: "3", md: "1", lg: "2" }}
                >
                  {product?.brand}
                </Badge>
              </Box>
              {product.countInStock === 0 && (
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  align="center"
                  justify="center"
                >
                  <Badge
                    radius="full"
                    variant="solid"
                    color="ruby"
                    size={{ initial: "3", md: "1", lg: "2" }}
                  >
                    {`The product is out of stock`}
                  </Badge>
                </Flex>
              )}
            </Link>
            <HeartIcon product={product} />
          </Box>
        </Inset>

        <Box>
          <Flex justify="between">
            <Text size="3" wrap="pretty" truncate>
              {product?.name}
            </Text>
            <Text>
              {product?.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
          </Flex>

          <Box mt="4">
            <Box height="6rem" overflowY="hidden" mb="4">
              <Text size="2" weight="medium">
                {product?.description}
              </Text>
            </Box>

            <Flex justify="between" align="center">
              <Button size={{ initial: "1", md: "2" }} asChild>
                <Link to={`/product/${product._id}`}>
                  Read More <FaArrowCircleRight />
                </Link>
              </Button>

              <IconButton
                radius="full"
                onClick={() => addToCartHandler(product, 1)}
                variant="ghost"
                disabled={product.countInStock === 0}
              >
                <AiOutlineShoppingCart />
              </IconButton>
            </Flex>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductCard;
