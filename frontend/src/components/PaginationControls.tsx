import { Flex, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

interface PaginationControlsProps {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PaginationControls = ({
  pageNumber,
  setPageNumber,
  totalPages,
}: PaginationControlsProps) => {
  return (
    <Flex justify="center" align="center" gap="3" my="5">
      <IconButton
        onClick={() => setPageNumber((p) => p - 1)}
        disabled={pageNumber === 1}
        variant="soft"
      >
        <FaArrowAltCircleLeft />
      </IconButton>
      <Text color="teal" weight="medium">
        Page {pageNumber} of {totalPages}
      </Text>
      <IconButton
        onClick={() => setPageNumber((p) => p + 1)}
        disabled={pageNumber === totalPages}
        variant="soft"
      >
        <FaArrowAltCircleRight />
      </IconButton>
    </Flex>
  );
};

export default PaginationControls;
