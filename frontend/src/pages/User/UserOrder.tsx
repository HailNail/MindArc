import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import {
  AspectRatio,
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Table,
  Link as RadixLink,
} from "@radix-ui/themes";
import type { CustomFetchError } from "../../types/hooks";
import { useState } from "react";
import PaginationControls from "../../components/PaginationControls";

const UserOrder = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const {
    data: orderData,
    isLoading,
    error,
  } = useGetMyOrdersQuery({ pageNumber, pageSize });
  const orders = orderData?.orders;
  const totalPages = orderData?.pages || 1;

  return (
    <Container
      mt="6"
      size={{ initial: "1", md: "3", lg: "4" }}
      ml={{ initial: "0", md: "4rem" }}
    >
      <Heading ml="2">My Orders</Heading>
      {isLoading ? (
        <Flex width="100%" justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Message variant="error">
          {(error as CustomFetchError).data?.message || "Something went wrong"}
        </Message>
      ) : (
        <>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.RowHeaderCell>Image</Table.RowHeaderCell>
                <Table.RowHeaderCell>ID</Table.RowHeaderCell>
                <Table.RowHeaderCell>Date</Table.RowHeaderCell>
                <Table.RowHeaderCell>Total</Table.RowHeaderCell>
                <Table.RowHeaderCell>Paid</Table.RowHeaderCell>
                <Table.RowHeaderCell>Delivered</Table.RowHeaderCell>
                <Table.RowHeaderCell></Table.RowHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders?.map((order) => (
                <Table.Row key={order._id} style={{ verticalAlign: "middle" }}>
                  <Table.RowHeaderCell>
                    <Box width="4rem">
                      <AspectRatio ratio={4 / 4}>
                        <img
                          src={order.orderItems[0].image}
                          alt={order._id}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            borderRadius: "var(--radius-2)",
                          }}
                        />
                      </AspectRatio>
                    </Box>
                  </Table.RowHeaderCell>
                  <Table.Cell>{order._id}</Table.Cell>
                  <Table.Cell>
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </Table.Cell>
                  <Table.Cell>$ {order.totalPrice}</Table.Cell>
                  <Table.Cell>
                    {order.isPaid ? (
                      <Badge size="2" radius="large">
                        Completed
                      </Badge>
                    ) : (
                      <Badge size="2" color="orange" radius="large">
                        Pending
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {order.isDelivered ? (
                      <Badge size="2" radius="large">
                        Delivered
                      </Badge>
                    ) : (
                      <Badge size="2" color="orange" radius="large">
                        Pending
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <RadixLink asChild>
                      <Link to={`/order/${order._id}`}>View Details</Link>
                    </RadixLink>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <PaginationControls
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalPages={totalPages}
          />
        </>
      )}
    </Container>
  );
};

export default UserOrder;
