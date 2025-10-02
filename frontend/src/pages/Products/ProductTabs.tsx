import { Link } from "react-router-dom";
import React from "react";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import {
  Box,
  Flex,
  Spinner,
  Tabs,
  Text,
  Link as RadixLink,
  Select,
  TextArea,
  Button,
  Heading,
} from "@radix-ui/themes";
import type { UserInfo } from "../../types/userTypes";
import type { Product } from "../../types/productTypes";

interface ProductTabsProps {
  loadingProductReview: boolean;
  userInfo: UserInfo | null;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  product: Product | undefined;
}

const valueTabs: { [key: string]: string } = {
  1: "Inferior",
  2: "Decent",
  3: "Not Bad",
  4: "Excellent",
  5: "Amazing",
};

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}: ProductTabsProps) => {
  const { data, isLoading } = useGetTopProductsQuery();

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Flex direction={{ initial: "column", md: "row" }}>
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="yourReview">Write Your Review</Tabs.Trigger>
          <Tabs.Trigger value="allReviews">All Reviews</Tabs.Trigger>
          <Tabs.Trigger value="relatedProducts">Related Products</Tabs.Trigger>
        </Tabs.List>
        <Box p="4" width={{ initial: "100vw", md: "70vw" }}>
          <Tabs.Content value="yourReview">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <Box my="2">
                  <Text as="label" htmlFor="rating" size="3" mb="2" mr="2">
                    Rating
                  </Text>
                  <Select.Root
                    value={String(rating)}
                    onValueChange={(rating) => setRating(Number(rating))}
                    required
                  >
                    <Select.Trigger>{valueTabs[rating]}</Select.Trigger>
                    <Select.Content>
                      <Select.Item value="1">Inferior</Select.Item>
                      <Select.Item value="2">Decent</Select.Item>
                      <Select.Item value="3">Not bad</Select.Item>
                      <Select.Item value="4">Excellent</Select.Item>
                      <Select.Item value="5">Amazing</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
                <Box my="2">
                  <Text as="label" htmlFor="comment" size="3" mb="2" mr="2">
                    Comment
                  </Text>
                  <TextArea
                    id="comment"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    radius="medium"
                  ></TextArea>
                </Box>

                <Button
                  type="submit"
                  disabled={loadingProductReview}
                  radius="medium"
                >
                  Submit
                </Button>
              </form>
            ) : (
              <Text as="p">
                Please{" "}
                <RadixLink asChild>
                  <Link to="/login">Sign In</Link>
                </RadixLink>{" "}
                to write a review
              </Text>
            )}
          </Tabs.Content>
          <Tabs.Content value="allReviews">
            <Box>
              {product?.reviews.length === 0 && (
                <Text>No Reviews. Become first</Text>
              )}
            </Box>
            <Box my="2">
              {product?.reviews.map((review) => (
                <Box
                  key={review._id}
                  p="3"
                  className="rounded-lg bg-[var(--gray-3)]"
                  mb="2"
                >
                  <Flex justify="between">
                    <Heading size="4">{review.name}</Heading>
                    <Text>{review.createdAt.substring(0, 10)}</Text>
                  </Flex>
                  <Box my="4">
                    <Text>{review.comment}</Text>
                  </Box>
                  <Ratings value={review.rating} />
                </Box>
              ))}
            </Box>
          </Tabs.Content>
          <Tabs.Content value="relatedProducts">
            <Flex wrap="wrap">
              {!data ? (
                <Spinner />
              ) : (
                data.map((product) => (
                  <React.Fragment key={product._id}>
                    <SmallProduct product={product} />
                  </React.Fragment>
                ))
              )}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
};

export default ProductTabs;
