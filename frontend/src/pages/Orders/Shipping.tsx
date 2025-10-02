import { useAppDispatch, useAppSelector } from "../../types/hooks";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  RadioGroup,
  Text,
  TextField,
} from "@radix-ui/themes";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <Container
      mt="6"
      size={{ initial: "1", md: "3", lg: "4" }}
      ml={{ initial: "0", md: "4rem" }}
    >
      <Flex
        align="center"
        justify={{ initial: "center", md: "start" }}
        width="100%"
        px="2"
      >
        <ProgressSteps step1 />
      </Flex>
      <Flex
        justify="between"
        align="center"
        wrap="wrap"
        width={{ initial: "100vw", md: "32rem" }}
        p="2"
      >
        <form className="w-full" onSubmit={submitHandler}>
          <Heading size="4" mb="4">
            Shipping
          </Heading>
          <Box mb="2">
            <Text as="label">Address</Text>
            <TextField.Root
              radius="medium"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            >
              <TextField.Slot pl="1"></TextField.Slot>
            </TextField.Root>
          </Box>
          <Box mb="2">
            <Text as="label">City</Text>
            <TextField.Root
              radius="medium"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <TextField.Slot pl="1"></TextField.Slot>
            </TextField.Root>
          </Box>
          <Box mb="2">
            <Text as="label">Postal Code</Text>
            <TextField.Root
              radius="medium"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            >
              <TextField.Slot pl="1"></TextField.Slot>
            </TextField.Root>
          </Box>
          <Box mb="2">
            <Text as="label">Country</Text>
            <TextField.Root
              radius="medium"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <TextField.Slot pl="1"></TextField.Slot>
            </TextField.Root>
          </Box>
          <Box my="3">
            <Text as="label">Select Method</Text>
            <RadioGroup.Root
              my="3"
              defaultValue="Stripe"
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
              name="payment-methods"
              required
            >
              <RadioGroup.Item value="Stripe">
                Stripe (Card, Link, etc.)
              </RadioGroup.Item>
            </RadioGroup.Root>
          </Box>
          <Button type="submit">Continue</Button>
        </form>
      </Flex>
    </Container>
  );
};

export default Shipping;
