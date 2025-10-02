import { Flex } from "@radix-ui/themes";
import { useAppSelector } from "../../types/hooks";

const FavoritesCount = () => {
  const favorites = useAppSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  if (favoriteCount <= 0) return null;
  return (
    <Flex
      position="absolute"
      right="-4px"
      top="-2px"
      align="center"
      justify="center"
      minWidth="16px"
      height="16px"
      px="4px"
      className="bg-[var(--ruby-10)] rounded-full text-[var(--gray-1)] shadow-md font-medium"
    >
      {favoriteCount}
    </Flex>
  );
};

export default FavoritesCount;
