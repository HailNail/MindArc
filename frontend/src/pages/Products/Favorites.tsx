import { useAppSelector } from "../../types/hooks";
import React from "react";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Products from "./Products";
import { Box, Card, Container, Flex, Heading } from "@radix-ui/themes";

const Favorites = () => {
  const favorites = useAppSelector(selectFavoriteProduct);
  return (
    <Container mt="7" ml={{ initial: "0", md: "4rem", xl: "0" }}>
      <Heading
        ml="4"
        my="2"
        weight="medium"
        align={{ initial: "center", md: "left" }}
      >
        FAVORITE PRODUCTS
      </Heading>

      <Flex wrap="wrap" justify={{ initial: "center", md: "start" }}>
        {favorites.map((product) => (
          <React.Fragment>
            <Products key={product._id} product={product} />
          </React.Fragment>
        ))}
      </Flex>
    </Container>
  );
};

export default Favorites;
