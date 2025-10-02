import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { type CustomFetchError, type RootState } from "../../redux/store";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  Spinner,
} from "@radix-ui/themes";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo?.username || "");
    setEmail(userInfo?.email || "");
  }, [userInfo?.username, userInfo?.email]);

  const dispatch = useDispatch();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo?._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
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
    <Container mx="auto" p="4" mt="4rem">
      <Flex justify="center" align="center" display={{ md: "flex" }} gapX="4">
        <Box width={{ md: "30vw" }}>
          <Heading size="3" mb="4">
            User Profile
          </Heading>
          <form onSubmit={submitHandler}>
            <Box mb="4">
              <Text as="label" htmlFor="name" size="2" weight="medium">
                Name
              </Text>
              <TextField.Root
                type="text"
                id="name"
                placeholder="Enter your name"
                value={username}
                mt="1"
                onChange={(e) => setUsername(e.target.value)}
                radius="medium"
              >
                <TextField.Slot px="1"></TextField.Slot>
              </TextField.Root>
            </Box>
            <Box mb="4">
              <Text as="label" htmlFor="email" size="2" weight="medium">
                Email
              </Text>
              <TextField.Root
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                mt="1"
                onChange={(e) => setEmail(e.target.value)}
                radius="medium"
              >
                <TextField.Slot px="1"></TextField.Slot>
              </TextField.Root>
            </Box>
            <Box mb="4">
              <Text as="label" htmlFor="password" size="2" weight="medium">
                Password
              </Text>
              <TextField.Root
                type="password"
                placeholder="Enter your password"
                value={password}
                mt="1"
                onChange={(e) => setPassword(e.target.value)}
                radius="medium"
              >
                <TextField.Slot px="1"></TextField.Slot>
              </TextField.Root>
            </Box>
            <Box mb="4">
              <Text
                as="label"
                htmlFor="confirmPassword"
                size="2"
                weight="medium"
              >
                Confirm Password
              </Text>
              <TextField.Root
                type="text"
                placeholder="Confirm your password"
                value={confirmPassword}
                mt="1"
                onChange={(e) => setConfirmPassword(e.target.value)}
                radius="medium"
              >
                <TextField.Slot px="1"></TextField.Slot>
              </TextField.Root>

              <Flex justify="between" mt="4">
                <Button type="submit" radius="medium">
                  Update
                </Button>
                <Button variant="outline" radius="medium" asChild>
                  <Link to="/user-orders">My Orders</Link>
                </Button>
              </Flex>
            </Box>
          </form>
        </Box>
        {loadingUpdateProfile && <Spinner />}
      </Flex>
    </Container>
  );
};

export default Profile;
