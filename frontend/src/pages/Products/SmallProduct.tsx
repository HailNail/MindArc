import {
  Box,
  Flex,
  Heading,
  Text,
  AspectRatio,
  Inset,
  Badge,
  Card,
} from "@radix-ui/themes";
import { Link } from "react-router-dom";
import type { Product } from "../../types/productTypes";
import HeartIcon from "./HeartIcon";

interface SmallProductProps {
  product: Product;
}

const SmallProduct = ({ product }: SmallProductProps) => {
  return (
    <Box width={{ initial: "20rem", md: "18rem" }} m="1">
      <Card>
        <Inset clip="padding-box" side="top" pb="current">
          <Box position="relative">
            <AspectRatio ratio={4 / 3}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full rounded object-cover"
              />
            </AspectRatio>
            <HeartIcon product={product} />
          </Box>
        </Inset>

        <Link to={`/product/${product._id}`}>
          <Flex justify="between" align="center">
            <Heading size="3" truncate>
              {product.name}
            </Heading>

            <Badge size="3" radius="full">
              $ {product.price}
            </Badge>
          </Flex>
        </Link>
      </Card>
    </Box>
  );
};

export default SmallProduct;
