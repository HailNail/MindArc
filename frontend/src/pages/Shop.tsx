import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../types/hooks";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  Radio,
  Separator,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useAppDispatch();
  const { categories, products, checked, radio } = useAppSelector(
    (state) => state.shop
  );
  const categoriesQuery = useFetchCategoriesQuery();

  const [priceFilter, setPriceFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (categoriesQuery.data && !categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const products = filteredProductsQuery.data ?? [];
        const filteredProducts = products.filter((product) => {
          // Check if the product price includes the entered price  filter value
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand: string) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand ?? []));
  };

  const handleCheck = (value: boolean, id: string) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  //Add "all Brands" option to uniqueBrands
  const uniqueBrands: string[] = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Update the price filter state when the user types in the input field
    setPriceFilter(e.target.value);
  };
  return (
    <Container
      mt="6"
      size={{ initial: "1", md: "3", lg: "4" }}
      ml={{ initial: "0", md: "4rem" }}
    >
      <Flex direction={{ initial: "column", md: "row" }}>
        <Flex justify="center" display={{ initial: "flex", md: "none" }}>
          <Button
            onClick={toggleFilter}
            variant="soft"
            size="4"
            style={{ width: "100%" }}
          >
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </Flex>
        <Box
          display={{ initial: isFilterOpen ? "block" : "none", md: "block" }}
          p="3"
          mb="2"
          style={{ backgroundColor: "var(--gray-3)" }}
          width={{ initial: "100%", md: "250px" }}
        >
          <Heading size="4" align="center">
            Filter By Categories
          </Heading>
          <Separator size="4" my="2" color="teal" />

          <Box
            p="4"
            mb="4"
            maxHeight={{ initial: "10rem", md: "15rem" }}
            overflowY="auto"
          >
            {categories?.map((c) => (
              <Box key={c._id} mb="2">
                <Flex align="center" mr="4">
                  <Checkbox
                    value={c._id}
                    // !!checked makes sure you always pass a strict boolean into your handleCheck.
                    onCheckedChange={(checked) => handleCheck(!!checked, c._id)}
                  />
                  <Text as="label" ml="2">
                    {c.name}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Box>

          {/* Brands */}
          <Heading size="4" align="center">
            Filter by Brands
          </Heading>
          <Separator size="4" my="2" color="teal" />

          <Box
            p="4"
            mb="4"
            maxHeight={{ initial: "10rem", md: "15rem" }}
            overflowY="auto"
          >
            {uniqueBrands?.map((brand, index) => (
              <React.Fragment key={index}>
                <Flex align="center" mr="4" mb="4">
                  <Radio
                    name="brand-filter"
                    value={brand}
                    onChange={() => handleBrandClick(brand)}
                  />
                  <Text as="label" ml="2">
                    {brand}
                  </Text>
                </Flex>
              </React.Fragment>
            ))}
          </Box>

          {/* Price */}
          <Heading size="4" align="center">
            Filter by Price
          </Heading>

          <Box p="4">
            <TextField.Root
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
            >
              <TextField.Slot pl="1"></TextField.Slot>
            </TextField.Root>
          </Box>

          <Box p="4">
            <Button
              onClick={() => window.location.reload()}
              color="ruby"
              variant="soft"
            >
              Reset
            </Button>
          </Box>
        </Box>
        <Box p="3" width="100%">
          <Heading ml="3" mb="2" align={{ initial: "center", md: "left" }}>
            {products?.length} Products
          </Heading>
          <Flex wrap="wrap" justify={{ initial: "center", md: "start" }}>
            {products.length === 0 ? (
              <Flex width="100%" justify="center" p="4">
                <Spinner />
              </Flex>
            ) : (
              products?.map((p) => (
                <Box key={p._id}>
                  <ProductCard product={p} />
                </Box>
              ))
            )}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default Shop;
