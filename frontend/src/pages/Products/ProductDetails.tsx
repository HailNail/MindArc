import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../types/hooks";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import type { CustomFetchError } from "../../types/hooks";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import { useState } from "react";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link as RadixLink,
  Select,
  Spinner,
  Text,
} from "@radix-ui/themes";
import {
  FaBox,
  FaClock,
  FaEye,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import type { CartItem } from "../../types/cartTypes";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId ?? "");

  const { userInfo } = useAppSelector((state) => state.auth);
  const dataStock = [...Array(product?.countInStock).keys()];

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof productId === "undefined") return;
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
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

  const addToCardHandler = () => {
    dispatch(addToCart({ ...product, quantity } as CartItem));
    navigate("/cart");
  };
  return (
    <>
      <Box mb="4" ml={{ initial: "0", sm: "9rem", md: "11rem", lg: "15rem" }}>
        <RadixLink weight="medium" asChild>
          <Link to="/">Go Back</Link>
        </RadixLink>
      </Box>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Message variant="error">
          {" "}
          {(error as CustomFetchError).data?.message || "Something went wrong"}
        </Message>
      ) : (
        <>
          <Flex
            position="relative"
            justify="between"
            ml={{ initial: "0", sm: "9rem", md: "11rem", lg: "15rem" }}
            direction={{ initial: "column", sm: "row" }}
          >
            {product && (
              <>
                <Box
                  width={{
                    initial: "100vw",
                    sm: "30rem",
                    md: "40rem",
                    lg: "45rem",
                    xl: "50rem",
                  }}
                  mr="4"
                  mb={{ initial: "4", sm: "0" }}
                >
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {product.countInStock === 0 && (
                      <Flex
                        position="absolute"
                        top="50%"
                        left="50%"
                        style={{ transform: "translate(-50%, -50%)" }}
                        align="center"
                        justify="center"
                      >
                        <Badge
                          radius="full"
                          color="ruby"
                          variant="solid"
                          size={{ initial: "3", md: "1", lg: "2" }}
                        >
                          {`The product is out of stock`}
                        </Badge>
                      </Flex>
                    )}
                  </AspectRatio>
                </Box>
                <HeartIcon product={product} />

                <Flex
                  direction="column"
                  gap="3"
                  mr="8"
                  ml={{ initial: "3", sm: "0" }}
                >
                  <Heading size="5" weight="medium">
                    {product.name}
                  </Heading>
                  <Text size="2">{product.description}</Text>
                  <Text size="6" my="4" weight="medium">
                    $ {product.price}
                  </Text>

                  <Flex align="center" justify="between" maxWidth="20rem">
                    <Box>
                      <Flex align="center" mb="4">
                        <FaStore className="mr-2" />
                        <Text>Brand: {product.brand}</Text>
                      </Flex>
                      <Flex align="center" mb="4">
                        <FaClock className="mr-2" />
                        <Text>
                          Added: {moment(product.createdAt).fromNow()}
                        </Text>
                      </Flex>
                      <Flex align="center" mb="4">
                        <FaEye className="mr-2" />
                        <Text>Reviews: {product.numReviews}</Text>
                      </Flex>
                    </Box>

                    <Box>
                      <Flex align="center" mb="4">
                        <FaStar className="mr-2" />
                        <Text>Ratings: {rating}</Text>
                      </Flex>
                      <Flex align="center" mb="4">
                        <FaShoppingCart className="mr-2" />
                        <Text>Quantity: {product.quantity}</Text>
                      </Flex>
                      <Flex align="center" mb="4">
                        <FaBox className="mr-2" />
                        <Text>In Stock: {product.countInStock}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Flex wrap="wrap">
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                    {product.countInStock > 0 && (
                      <Box ml="4">
                        <Select.Root
                          value={String(quantity)}
                          onValueChange={(val) => setQuantity(Number(val))}
                        >
                          <Select.Trigger>{quantity}</Select.Trigger>

                          <Select.Content
                            position="popper"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {dataStock.map((x) => (
                              <Select.Item key={x + 1} value={String(x + 1)}>
                                {x + 1}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Box>
                    )}
                  </Flex>
                  <Box>
                    <Button
                      onClick={addToCardHandler}
                      disabled={product.countInStock === 0}
                      radius="medium"
                      mt={{ initial: "4", md: "0" }}
                    >
                      Add To Cart
                    </Button>
                  </Box>
                </Flex>
              </>
            )}
          </Flex>
          <Flex
            wrap="wrap"
            align="start"
            justify="between"
            mt="4"
            ml={{ initial: "0", sm: "9rem", md: "11rem", lg: "15rem" }}
          >
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </Flex>
        </>
      )}
    </>
  );
};

export default ProductDetails;
