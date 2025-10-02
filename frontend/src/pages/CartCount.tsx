import { Flex } from "@radix-ui/themes";
import { useAppSelector } from "../types/hooks";

const CartCount = () => {
  const { cartItems } = useAppSelector((state) => state.cart);

  if (cartItems.length <= 0) return null;
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
      {cartItems.length}
    </Flex>
  );
};

export default CartCount;
