import React, { useState, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  type CustomFetchError,
} from "../../types/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
} from "../../redux/api/usersApiSlice";

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
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [login, { isLoading }] = useLoginMutation();
  const [loginWithGoogle] = useLoginWithGoogleMutation();

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
      dispatch(setCredentials({ ...res, loginType: "local" }));
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
    <Box width="100%" mt="6" pl={{ initial: "0", md: "14rem" }}>
      <Flex
        pl={{ initial: "0", md: "5rem" }}
        direction={{ initial: "column", md: "row" }}
        gap="3"
      >
        <Box mr="4" mt="6">
          <Heading weight="medium" align={{ initial: "center", md: "left" }}>
            Sign IN
          </Heading>
          <Container width="20rem">
            <form onSubmit={submitHandler}>
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
            </form>
            <Box mt="4">
              <GoogleLogin
                theme={theme === "dark" ? "filled_black" : "outline"}
                size="large"
                shape="circle"
                text="signin_with"
                logo_alignment="center"
                onSuccess={async (credentialResponse) => {
                  try {
                    const token = credentialResponse.credential!;
                    const user = await loginWithGoogle({
                      token,
                    }).unwrap();
                    dispatch(setCredentials({ ...user, loginType: "google" }));
                  } catch (error) {
                    console.error("Google login failed", error);
                  }
                }}
                onError={() => {
                  console.log("Google login failed");
                }}
              ></GoogleLogin>
            </Box>
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
          </Container>
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
