import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useGetTotalOrdersQuery } from "../../redux/api/orderApiSlice";
import {
  useGetStripeTotalSalesQuery,
  useGetStripeSalesByDateQuery,
} from "../../redux/api/stripeApiSlice";
import AdminMenu from "./AdminMenu";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Container,
  Flex,
  Heading,
  Section,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import type { SalesChartState } from "../../types/chartDashboard";

const AdminDashboard = () => {
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: totalSales, isLoading: loadingTotal } =
    useGetStripeTotalSalesQuery();
  const { data: salesByDate, isLoading: loadingByDate } =
    useGetStripeSalesByDateQuery();

  const [state, setState] = useState<SalesChartState>({
    options: {
      chart: {
        type: "line",
      },
      colors: ["var(--orange-8)"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "var(--teal-9)",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesByDate) {
      const categories = salesByDate.map((item) => item.date);
      const data = salesByDate.map((item) => item.totalSales);

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,

            categories: categories,
          },
        },
        series: [{ name: "Sales", data: data }],
      }));
    }
  }, [salesByDate]);

  return (
    <>
      <AdminMenu />
      <Container ml={{ initial: "0", md: "4rem", xl: "0" }}>
        <Flex width="80%" justify={"between"} wrap="wrap" mt="9" ml="2">
          <Box width={{ initial: "100%", md: "15rem" }} my="1">
            <Card>
              <Avatar size="3" fallback="$" radius="full" color="teal"></Avatar>
              <Box mt="5">
                <Text>
                  {loadingTotal || loadingByDate ? (
                    <Skeleton>Sales:</Skeleton>
                  ) : (
                    "Sales:"
                  )}{" "}
                </Text>
                <Heading size="5" weight="medium">
                  {loadingTotal || loadingByDate ? (
                    <Skeleton width="80%" height="20px" />
                  ) : (
                    `$ ${totalSales?.totalSales.toFixed(2)}`
                  )}
                </Heading>
              </Box>
            </Card>
          </Box>
          <Box width={{ initial: "100%", md: "15rem" }} my="1">
            <Card>
              <Avatar size="3" fallback="$" radius="full" color="teal"></Avatar>
              <Box mt="5">
                <Text>
                  {loadingCustomers ? (
                    <Skeleton>Customers:</Skeleton>
                  ) : (
                    "Customers:"
                  )}
                </Text>
                <Heading size="5" weight="medium">
                  {loadingCustomers ? (
                    <Skeleton width="80%" height="20px" />
                  ) : (
                    customers?.length
                  )}
                </Heading>
              </Box>
            </Card>
          </Box>
          <Box width={{ initial: "100%", md: "15rem" }} my="1">
            <Card>
              <Avatar size="3" fallback="$" radius="full" color="teal"></Avatar>
              <Box mt="5">
                <Text>
                  {loadingOrders ? <Skeleton>Orders:</Skeleton> : "Orders:"}
                </Text>
                <Heading size="5" weight="medium">
                  {" "}
                  {loadingOrders ? (
                    <Skeleton width="80%" height="20px" />
                  ) : (
                    orders?.totalOrders
                  )}
                </Heading>
              </Box>
            </Card>
          </Box>
        </Flex>

        <Box mt="4" ml="2">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="70%"
          />
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
