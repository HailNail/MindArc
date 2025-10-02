import React, { useState, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  type CustomFetchError,
} from "../../types/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/usersApiSlice";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  TextField,
  Link as RadixLink,
  AspectRatio,
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        const err = error as CustomFetchError;
        toast.error(err.data.message);
      } else {
        // SerializedError or unknown
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Box style={{ background: "var(--gray-3)" }} width="100vw" mt="6">
      <Flex pl="5rem">
        <Box mr="4" mt="6">
          <Heading weight="medium">Sign IN</Heading>
          <form onSubmit={submitHandler}>
            <Container width="20rem">
              <Box my="3">
                <Text as="label" htmlFor="email" size="2" weight="medium">
                  Email Address
                </Text>
                <TextField.Root
                  type="email"
                  id="email"
                  radius="medium"
                  mt="1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                >
                  <TextField.Slot px="1"></TextField.Slot>
                </TextField.Root>
              </Box>
              <Box my="2">
                <Text as="label" htmlFor="password" size="2" weight="medium">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  id="password"
                  radius="medium"
                  mt="1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                >
                  <TextField.Slot px="1"></TextField.Slot>
                </TextField.Root>
              </Box>
              <Flex align="center" gapX="2">
                <Button
                  disabled={isLoading}
                  type="submit"
                  radius="medium"
                  my="1"
                >
                  {isLoading ? <Spinner /> : "Sign In"}
                </Button>
              </Flex>
            </Container>
            <Box my="4">
              <Text as="p">
                New Customer?{" "}
                <RadixLink asChild>
                  <Link
                    to={
                      redirect ? `/register?redirect=${redirect}` : "/register"
                    }
                  >
                    Register
                  </Link>
                </RadixLink>
              </Text>
            </Box>
          </form>
        </Box>
        <AspectRatio ratio={18 / 8}>
          <img
            src="img-log.png"
            alt="register"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "var(--radius-2)",
            }}
          />
        </AspectRatio>
      </Flex>
    </Box>
  );
};

export default Login;
