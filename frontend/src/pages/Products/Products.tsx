import {
  AspectRatio,
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Inset,
  Text,
} from "@radix-ui/themes";
import { Link } from "react-router-dom";
import type { Product } from "../../types/productTypes";
import HeartIcon from "./HeartIcon";

interface ProductProps {
  product: Product;
}

const Products = ({ product }: ProductProps) => {
  return (
    <Box width={{ initial: "20rem", md: "18rem" }} position="relative" m="2">
      <Card>
        <Link to={`/product/${product._id}`}>
          <Inset clip="padding-box" side="top" pb="current">
            <Box position="relative">
              <AspectRatio ratio={4 / 3}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </Box>
          </Inset>

          <Flex justify="between" align="center">
            <Heading size="4" weight="regular" truncate>
              {product.name}
            </Heading>
            <Badge size="3" radius="full">
              $ {product.price}
            </Badge>
          </Flex>
        </Link>
        <HeartIcon product={product} />
      </Card>
    </Box>
  );
};

export default Products;
