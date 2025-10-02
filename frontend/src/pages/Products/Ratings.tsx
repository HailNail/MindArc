import { Flex, Text } from "@radix-ui/themes";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface RatingsProps {
  value: number;
  text?: string;
  color?: string;
}

const Ratings = ({ value, text, color = "var(--amber-10)" }: RatingsProps) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;
  return (
    <Flex align="center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} style={{ color }} className={` mr-1`} />
      ))}

      {halfStars === 1 && (
        <FaStarHalfAlt style={{ color }} className={` mr-1`} />
      )}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={index} style={{ color }} className={`mr-1`} />
      ))}

      <Text ml="2" style={{ color }}>
        {text}
      </Text>
    </Flex>
  );
};

export default Ratings;
