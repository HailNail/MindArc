import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import {
  Container,
  Heading,
  Spinner,
  Flex,
  Table,
  Box,
  TextField,
  Button,
  IconButton,
  Text,
} from "@radix-ui/themes";
import Message from "../../components/Message";
import type { CustomFetchError } from "../../types/hooks";
import type { UserInfo } from "../../types/userTypes";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [editableUsername, setEditableUsername] = useState<string>("");
  const [editableEmail, setEditableEmail] = useState<string>("");

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(
          (error as CustomFetchError).data?.message || "Failed to delete user"
        );
      }
    }
  };

  const toggleEdit = (
    id: string,
    currentUsername: string,
    currentEmail: string
  ) => {
    if (editableUserId === id) {
      // If already editing this user, cancel edit
      setEditableUserId(null);
      setEditableUsername("");
      setEditableEmail("");
    } else {
      // Start editing this user
      setEditableUserId(id);
      setEditableUsername(currentUsername);
      setEditableEmail(currentEmail);
    }
  };

  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        userId: id,
        username: editableUsername,
        email: editableEmail,
      }).unwrap();
      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(
        (error as CustomFetchError).data?.message || "Failed to update user"
      );
    }
  };

  return (
    <Container mt="7" ml={{ initial: "0", md: "4rem", xl: "0" }}>
      <AdminMenu />

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Message variant="error">
          {(error as CustomFetchError).data?.message || "An error occurred"}
        </Message>
      ) : (
        <Flex direction={{ initial: "column", md: "row" }} justify="center">
          <Box>
            <Heading align="center">Users</Heading>
            <Table.Root size="3">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify="center">
                    ADMIN
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify="center">
                    ACTIONS
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {users?.map((user: UserInfo) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <Flex align="center">
                        <Text>{user._id}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      {editableUserId === user._id ? (
                        <Flex align="center">
                          <TextField.Root
                            mr="3"
                            value={editableUsername}
                            onChange={(e) =>
                              setEditableUsername(e.target.value)
                            }
                            size="2"
                            radius="medium"
                          >
                            <TextField.Slot px="1"></TextField.Slot>
                          </TextField.Root>
                          <Button
                            onClick={() => updateHandler(user._id)}
                            variant="ghost"
                          >
                            <FaCheck />
                          </Button>
                        </Flex>
                      ) : (
                        <Flex align="center">
                          {user.username}{" "}
                          <Button
                            ml="2"
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            variant="ghost"
                          >
                            <FaEdit />
                          </Button>
                        </Flex>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editableUserId === user._id ? (
                        <Flex align="center">
                          <TextField.Root
                            mr="3"
                            value={editableEmail}
                            onChange={(e) => setEditableEmail(e.target.value)}
                            size="2"
                            radius="medium"
                          >
                            <TextField.Slot px="1"></TextField.Slot>
                          </TextField.Root>
                          <Button
                            onClick={() => updateHandler(user._id)}
                            variant="ghost"
                          >
                            <FaCheck />
                          </Button>
                        </Flex>
                      ) : (
                        <Flex align="center">
                          <Text>{user.email}</Text>
                          <Button
                            ml="2"
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            variant="ghost"
                          >
                            <FaEdit />
                          </Button>
                        </Flex>
                      )}
                    </Table.Cell>
                    <Table.Cell justify="center">
                      {user.isAdmin ? (
                        <IconButton color="green" variant="ghost">
                          <FaCheck />
                        </IconButton>
                      ) : (
                        <IconButton color="red" variant="ghost">
                          <FaTimes />
                        </IconButton>
                      )}
                    </Table.Cell>
                    <Table.Cell justify={"center"}>
                      {!user.isAdmin && (
                        <IconButton
                          color="red"
                          variant="ghost"
                          onClick={() => deleteHandler(user._id!)}
                        >
                          <FaTrash />
                        </IconButton>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Flex>
      )}
    </Container>
  );
};

export default UserList;
