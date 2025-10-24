import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import type { CustomFetchError } from "../../types/hooks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Inset,
  Text,
} from "@radix-ui/themes";
import {
  FaBox,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEye,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    swipe: true,
  };
  return (
    <Box mt="7" display="block">
      {isLoading ? null : error ? (
        <Message variant="error">
          {(error as CustomFetchError).data?.message || "Something went wrong"}
        </Message>
      ) : (
        <Box position="relative" display="block">
          {}
          <Slider {...settings} className="lg:w-[36rem] md:w-[42rem] w-[95vw]">
            {products?.map(
              ({
                name,
                image,
                _id,
                price,
                description,
                brand,
                createdAt,
                numReviews,
                rating,
                quantity,
                countInStock,
              }) => (
                <Card key={_id}>
                  <Link to={`/product/${_id}`}>
                    <Box>
                      <Inset clip="padding-box" side="top" pb="current">
                        <Box position="relative">
                          <img
                            src={image}
                            alt={name}
                            className="w-full object-cover h-[20rem]"
                          />

                          <Text className="absolute top-2 right-2 bg-[var(--teal-5)] p-1 rounded-full">
                            $ {price}
                          </Text>
                        </Box>
                      </Inset>

                      <Flex
                        justify="between"
                        wrap={{ initial: "wrap", md: "nowrap" }}
                      >
                        <Box
                          mt="4"
                          width={{ initial: "full", md: "18vw", xl: "14vw" }}
                        >
                          <Heading size="3" truncate>
                            {name}
                          </Heading>
                          <Text as="p" mt="1" mb="3">
                            {description.length > 150
                              ? description.substring(0, 150) + "..."
                              : description}
                          </Text>
                        </Box>
                        <Flex direction="column" gap="3" mt="4">
                          <Flex align="center">
                            <FaStore className="mr-2" />
                            <Text>Brand: {brand}</Text>
                          </Flex>
                          <Flex align="center">
                            <FaClock className="mr-2" />
                            <Text>
                              Added:{" "}
                              {moment(createdAt)
                                .fromNow()
                                .replace("hours", "h")
                                .replace("hour", "h")}
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <FaEye className="mr-2" />
                            <Text>Reviews: {numReviews}</Text>
                          </Flex>
                        </Flex>
                        <Flex direction="column" gap="3" mt="4">
                          <Flex align="center">
                            <FaStar className="mr-2" />{" "}
                            <Text>Ratings: {Math.round(rating)}</Text>
                          </Flex>
                          <Flex align="center">
                            <FaShoppingCart className="mr-2" />{" "}
                            <Text>Quantity: {quantity}</Text>
                          </Flex>
                          <Flex align="center">
                            <FaBox className="mr-2" />{" "}
                            <Text>In Stock: {countInStock}</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Box>
                  </Link>
                </Card>
              )
            )}
          </Slider>
        </Box>
      )}
    </Box>
  );
};

export default ProductCarousel;
