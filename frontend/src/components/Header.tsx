import { Box, Grid, Heading, Spinner } from "@radix-ui/themes";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Heading>ERROR</Heading>;
  }
  return (
    <>
      <div className="flex justify-around">
        <Box display={{ initial: "none", lg: "block" }} mt="7">
          <Grid columns="2" gap="2">
            {data?.map((product) => (
              <Box key={product._id}>
                <SmallProduct product={product} />
              </Box>
            ))}
          </Grid>
        </Box>
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;
