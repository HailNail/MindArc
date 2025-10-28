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
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const GoogleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 48 48"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l5.9-5.7C34.8 3 29.9 1 24 1 14.8 1 7.2 6.5 3.8 14l7.1 5.5C12.6 13 17.8 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.1 24.5c0-1.7-.2-3.4-.6-5H24v9.5h12.4c-.5 2.7-2.2 5-4.6 6.6l7.1 5.5c4.1-3.8 6.5-9.4 6.5-16.6z"
      />
      <path
        fill="#FBBC05"
        d="M10.9 28.5a14.6 14.6 0 0 1 0-9l-7.1-5.5A23.96 23.96 0 0 0 0 24c0 3.9 0.9 7.6 2.5 10.9l8.4-6.4z"
      />
      <path
        fill="#4285F4"
        d="M24 48c6.5 0 12-2.1 16-5.7l-7.1-5.5c-2 1.4-4.6 2.2-8.9 2.2-6.2 0-11.4-3.5-13.7-8.6l-8.4 6.4C7.2 41.5 14.8 48 24 48z"
      />
    </svg>
  );

  const CustomGoogleButton = () => {
    const login = useGoogleLogin({
      onSuccess: async (credentialResponse) => {
        const token = credentialResponse.access_token;
        const user = await loginWithGoogle({ token }).unwrap();
        dispatch(setCredentials({ ...user, loginType: "google" }));
      },
      onError: () => console.log("Google login failed"),
      flow: "implicit",
    });

    return (
      <Button
        variant="outline"
        onClick={() => login()}
        className="flex items-center gap-2 w-full"
      >
        <GoogleIcon />
        Continue with Google
      </Button>
    );
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
                <CustomGoogleButton />
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
