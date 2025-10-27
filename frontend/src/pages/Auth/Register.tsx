import React, { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  type CustomFetchError,
} from "../../types/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useLoginWithGoogleMutation,
  useRegisterMutation,
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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [register, { isLoading }] = useRegisterMutation();
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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res, loginType: "local" }));
        navigate(redirect);
        toast.success("User successfully registered");
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
    }
  };

  return (
    <>
      <Box width="100%" pl={{ initial: "0", md: "14rem" }} mt="6">
        <Flex
          pl={{ initial: "0", md: "5rem" }}
          direction={{ initial: "column", md: "row" }}
          gap="3"
        >
          <Box mr="4" mt="6">
            <Heading weight="medium" align={{ initial: "center", md: "left" }}>
              Register
            </Heading>
            <Container width="20rem">
              <form onSubmit={submitHandler}>
                <Box my="3">
                  <Text as="label" htmlFor="userName" size="2" weight="medium">
                    Username
                  </Text>
                  <TextField.Root
                    type="text"
                    id="username"
                    radius="medium"
                    mt="1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                  >
                    <TextField.Slot px="1"></TextField.Slot>
                  </TextField.Root>
                </Box>
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
                    placeholder="Enter your Email"
                  >
                    <TextField.Slot px="1"></TextField.Slot>
                  </TextField.Root>
                </Box>
                <Box my="3">
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
                    placeholder="Enter your Password"
                  >
                    <TextField.Slot px="1"></TextField.Slot>
                  </TextField.Root>
                </Box>
                <Box my="3">
                  <Text
                    as="label"
                    htmlFor="confirmPassword"
                    size="2"
                    weight="medium"
                  >
                    Confirm Password
                  </Text>
                  <TextField.Root
                    type="password"
                    id="conformPassword"
                    radius="medium"
                    mt="1"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your Password"
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
                    {isLoading ? <Spinner /> : "Register"}
                  </Button>
                </Flex>
              </form>
              <Box mt="4">
                <GoogleLogin
                  theme={theme === "dark" ? "filled_black" : "outline"}
                  size="large"
                  shape="circle"
                  text="signup_with"
                  logo_alignment="center"
                  onSuccess={async (credentialResponse) => {
                    try {
                      const token = credentialResponse.credential!;
                      const user = await loginWithGoogle({ token }).unwrap();
                      dispatch(
                        setCredentials({ ...user, loginType: "google" })
                      );
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
                  Already have account?{" "}
                  <RadixLink asChild>
                    <Link
                      to={redirect ? `/login?redirect=${redirect}` : "/login"}
                    >
                      Login
                    </Link>
                  </RadixLink>
                </Text>
              </Box>
            </Container>
          </Box>
          <AspectRatio ratio={18 / 8}>
            <img
              src="img-reg.png"
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
    </>
  );
};

export default Register;
