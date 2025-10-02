import { Link, useParams } from "react-router-dom";
import React from "react";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { type CustomFetchError } from "../types/hooks";
import Header from "../components/Header";
import Message from "../components/Message";
import { Flex, Heading, Spinner, Button, Container } from "@radix-ui/themes";
import Products from "./Products/Products";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Message variant="error">
          {(error as CustomFetchError).data?.message || "Something went wrong"}
        </Message>
      ) : (
        <>
          <Container>
            <Flex
              style={{ justifyContent: "space-around" }}
              align="center"
              mt="4"
            >
              <Heading>Special Products</Heading>

              <Button asChild size="2" radius="full">
                <Link to="/shop">Shop</Link>
              </Button>
            </Flex>
            <Flex justify="center" wrap="wrap" mt="3">
              {data?.products.map((product) => (
                <React.Fragment key={product._id}>
                  <Products product={product} />
                </React.Fragment>
              ))}
            </Flex>
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
