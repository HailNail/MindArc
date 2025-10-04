import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  Grid,
  Button,
  Card,
  AspectRatio,
  Inset,
} from "@radix-ui/themes";
import { FaArrowCircleRight } from "react-icons/fa";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  if (isLoading) {
    return (
      <Flex height="100vh" justify="center" align="center">
        <Spinner size="3" />;
      </Flex>
    );
  }

  if (isError) {
    return <Container>Error loading products</Container>;
  }
  return (
    <Container mt="7" ml={{ initial: "0", md: "4rem", xl: "0" }}>
      <AdminMenu />
      <Flex direction={{ initial: "row", md: "column" }}>
        <Box p="3">
          <Heading ml="2" mb="3" weight="bold">
            All Products ({products?.length})
          </Heading>
          <Grid
            columns={{ initial: "1", md: "2", lg: "3" }}
            gap="3"
            width="auto"
          >
            {products?.map((product) => (
              <Box
                width={{ initial: "18rem", md: "22rem" }}
                position="relative"
                m="1"
                key={product._id}
              >
                <Card>
                  <Inset clip="padding-box" side="top" pb="current">
                    <Box position="relative">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </Box>
                  </Inset>

                  <Flex direction="column" justify="center">
                    <Flex justify="between" width="100%">
                      <Box maxWidth="70%">
                        <Heading size="3" weight="medium" truncate>
                          {product?.name}
                        </Heading>
                      </Box>
                      <Text as="p" size="2" align="right">
                        {moment(product.createdAt).format("MMM Do YYYY")}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text as="p" truncate mb="4">
                        {product?.description}
                      </Text>
                    </Flex>

                    <Flex justify="between">
                      <Link to={`/admin/product/update/${product._id}`}>
                        <Button>
                          <Text mr="3">Update Product</Text>
                          <FaArrowCircleRight />
                        </Button>
                      </Link>
                      <Flex align="center">
                        <Text as="p">$ {product?.price}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Box>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Container>
  );
};

export default AllProducts;
