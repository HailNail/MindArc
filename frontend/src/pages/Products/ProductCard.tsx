import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../types/hooks";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { Box, Text, Flex, Button, IconButton } from "@radix-ui/themes";

import type { Product } from "../../types/productTypes";
import { FaArrowCircleRight } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();

  const addToCartHandler = (product: Product, quantity: number) => {
    // 1. Check if the item already exists in the local state copy
    const existingItem = cartItems.find((item) => item._id === product._id);

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
    <Box position="relative">
      <Box
        position="relative"
        width={{ initial: "10rem", md: "12rem", lg: "16rem" }}
      >
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full rounded-t-lg object-cover aspect-4/3"
          />
          <Box
            position="absolute"
            bottom="3"
            right="3"
            px="2"
            className="bg-[var(--teal-5)] rounded-full"
          >
            <Text weight="medium" size={{ initial: "3", md: "1", lg: "2" }}>
              {product?.brand}
            </Text>
          </Box>
        </Link>
        <HeartIcon product={product} />
      </Box>

      <Box
        py="4"
        width={{ initial: "10rem", md: "12rem", lg: "16rem" }}
        className="bg-[var(--gray-3)] border border-[var(--gray-6)] rounded-b-lg"
      >
        <Flex justify="between" px="2">
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

        <Box mt="1" px="2">
          <Box height="6rem" overflowY="hidden">
            <Text size="2" weight="medium">
              {product?.description}
            </Text>
          </Box>

          <Flex justify="between" align="center" mt="2">
            <Button size={{ initial: "1", md: "2" }} asChild>
              <Link to={`/product/${product._id}`}>
                Read More <FaArrowCircleRight />
              </Link>
            </Button>

            <IconButton
              radius="full"
              onClick={() => addToCartHandler(product, 1)}
              variant="ghost"
            >
              <AiOutlineShoppingCart />
            </IconButton>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
